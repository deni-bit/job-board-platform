const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { sendNotification } = require('../socket/index');

// POST /api/applications/:jobId — apply for a job
router.post('/:jobId', authMiddleware, authorize('jobseeker'), upload.single('resume'), async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId).populate('employer', 'email name');
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or no longer active' });
    }

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Upload resume if provided, otherwise use placeholder
    let resumeUrl = req.user.resume || 'https://placeholder.com/resume';
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'resumes', 'raw');
        resumeUrl = result.secure_url;
      } catch (uploadError) {
        console.log('Upload error:', uploadError.message);
        // Continue without upload
      }
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: resumeUrl
    });

    await application.save();
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    // Real-time notification to employer
    const io = req.app.get('io');
    await sendNotification(io, {
      recipientId: job.employer._id,
      type: 'new_application',
      message: `${req.user.name} applied for ${job.title}`,
      link: `/dashboard`
    });

    // Email employer
    const template = emailTemplates.applicationReceived(req.user.name, job.title);
    await sendEmail({ to: job.employer.email, ...template });

    res.status(201).json({ message: 'Application submitted successfully', application });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications/mine — jobseeker sees their applications
router.get('/mine', authMiddleware, authorize('jobseeker'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications/job/:jobId — employer sees applicants
router.get('/job/:jobId', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar skills bio resume')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/applications/:id/status — employer updates status
router.put('/:id/status', authMiddleware, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'title employer')
      .populate('applicant', 'name email');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Notify applicant
    const io = req.app.get('io');
    await sendNotification(io, {
      recipientId: application.applicant._id,
      type: 'status_change',
      message: `Your application for ${application.job.title} is now ${status}`,
      link: `/applications`
    });

    // Email applicant
    const template = emailTemplates.statusUpdate(application.job.title, status);
    await sendEmail({ to: application.applicant.email, ...template });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
