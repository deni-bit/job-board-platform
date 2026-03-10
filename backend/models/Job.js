const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: [String],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote'],
    required: true
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  skills: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deadline: {
    type: Date
  },
  applicantsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for faster search queries
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;