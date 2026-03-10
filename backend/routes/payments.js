const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Job = require('../models/Job');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/feature-job/:jobId
// Employer pays to feature their job
router.post('/feature-job/:jobId', authMiddleware, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only the employer who posted can feature it
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (job.isFeatured) {
      return res.status(400).json({ message: 'Job is already featured' });
    }

    // Create Stripe checkout session — $29 to feature a job
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Featured Job Post — ${job.title}`,
            description: `Feature "${job.title}" at ${job.company} for 30 days`,
          },
          unit_amount: 2900, // $29.00 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?featured=success&jobId=${job._id}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?featured=cancelled`,
      metadata: {
        jobId: job._id.toString(),
        employerId: req.user._id.toString()
      }
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/payments/webhook — Stripe calls this after payment
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Payment was successful
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const jobId = session.metadata.jobId;

    // Mark job as featured
    await Job.findByIdAndUpdate(jobId, { isFeatured: true });
    console.log(`✅ Job ${jobId} is now featured!`);
  }

  res.json({ received: true });
});

module.exports = router;
