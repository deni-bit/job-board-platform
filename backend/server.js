const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

app.use(helmet());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  message: { message: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true, legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true, legacyHeaders: false,
});

app.use(generalLimiter);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] }
});

app.set('io', io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

const { initSocket } = require('./socket/index');
initSocket(io);

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 JobConnect API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: 'CORS policy violation' });
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired, please login again' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format' });
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));