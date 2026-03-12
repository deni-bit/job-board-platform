const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer', 'admin'],
    default: 'jobseeker'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [String],
  resume: {
    type: String,
    default: ''
  },

  // ── BASIC COMPANY INFO ──────────────────────────────────────────────────
  company: {
    type: String,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  companyWebsite: {
    type: String,
    default: ''
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', ''],
    default: ''
  },
  companyIndustry: {
    type: String,
    default: ''
  },
  companyDescription: {
    type: String,
    default: ''
  },
  companyLocation: {
    type: String,
    default: ''
  },
  companyFoundedYear: {
    type: Number,
    default: null
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;