const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// GET /api/jobs — get all jobs with search and filters
router.get('/', async (req, res) => {
  try {
    const { search, location, type, featured, page = 1, limit = 10 } = req.query;

    // Build query object dynamically
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('employer', 'name company avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      jobs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id — get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name company avatar bio');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs — create job (employers only)
router.post('/', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const {
      title, description, requirements,
      location, type, salary, skills, deadline
    } = req.body;

    const job = new Job({
      title,
      company: req.user.company,
      employer: req.user._id,
      description,
      requirements,
      location,
      type,
      salary,
      skills,
      deadline
    });

    await job.save();
    res.status(201).json(job);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/jobs/:id — update job
router.put('/:id', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the employer who posted it can edit (unless admin)
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/jobs/:id — delete job
router.delete('/:id', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/employer/myjobs — get employer's own jobs
router.get('/employer/myjobs', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
