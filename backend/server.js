const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config();

const app = express();

// ── SECURITY HEADERS ───────────────────────────────────────────────────────
// Helmet sets 14 HTTP security headers automatically
app.use(helmet());

// ── RATE LIMITING ──────────────────────────────────────────────────────────
// General rate limit — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth routes — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI rate limit — 20 requests per hour per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { message: 'AI request limit reached, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all routes
app.use(generalLimiter);

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── BODY PARSER ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── DATA SANITIZATION ──────────────────────────────────────────────────────
// Prevent MongoDB operator injection attacks e.g. { "$gt": "" }
app.use(mongoSanitize());

// Prevent XSS attacks — sanitize user input from HTML tags
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// ── CREATE HTTP SERVER ─────────────────────────────────────────────────────
const server = http.createServer(app);

// ── SOCKET.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Make io accessible in routes via req.app.get('io')
app.set('io', io);

// ── DATABASE ───────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ── SOCKET EVENTS ──────────────────────────────────────────────────────────
const { initSocket } = require('./socket/index');
initSocket(io);

// ── ROUTES ─────────────────────────────────────────────────────────────────
// Apply strict rate limit to auth routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// ── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 JobConnect API is running' });
});

// ── 404 HANDLER ────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy violation' });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired, please login again' });
  }

  // Handle MongoDB errors
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  // Default server error
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
});

// ── START SERVER ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});