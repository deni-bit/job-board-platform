const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (role === 'admin') {
      return res.status(400).json({ message: 'Cannot register as admin' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name, email, password: hashedPassword,
      role: role || 'jobseeker',
      company: role === 'employer' ? company : ''
    });
    await user.save();
    const template = emailTemplates.welcomeEmail(name);
    await sendEmail({ to: email, ...template });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedJobs', 'title company location type');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/profile — update jobseeker profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, skills, company } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, bio, skills, company }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/profile/:id — public jobseeker profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/company — employer updates company profile
router.put('/company', authMiddleware, authorize('employer'), async (req, res) => {
  try {
    const {
      company, companyLogo, companyWebsite, companySize,
      companyIndustry, companyDescription, companyLocation, companyFoundedYear
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { company, companyLogo, companyWebsite, companySize, companyIndustry, companyDescription, companyLocation, companyFoundedYear },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/company/:id — public company profile
router.get('/company/:id', async (req, res) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: 'employer' }).select('-password');
    if (!employer) return res.status(404).json({ message: 'Company not found' });
    const Job = require('../models/Job');
    const jobs = await Job.find({ employer: req.params.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ employer, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;