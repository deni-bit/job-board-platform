const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"JobConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.log('❌ Email error:', error.message);
  }
};

// Email templates
const emailTemplates = {

  welcomeEmail: (name) => ({
    subject: 'Welcome to JobConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366F1;">Welcome to JobConnect, ${name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>Start exploring thousands of job opportunities today.</p>
        <a href="${process.env.CLIENT_URL}" 
           style="background: #6366F1; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Browse Jobs
        </a>
      </div>
    `
  }),

  applicationReceived: (applicantName, jobTitle) => ({
    subject: `New Application for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366F1;">New Application Received</h2>
        <p><strong>${applicantName}</strong> has applied for <strong>${jobTitle}</strong>.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="background: #6366F1; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          View Application
        </a>
      </div>
    `
  }),

  statusUpdate: (jobTitle, status) => ({
    subject: `Application Update — ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366F1;">Application Status Update</h2>
        <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
        <p>New status: <strong style="color: #6366F1; text-transform: uppercase;">${status}</strong></p>
        <a href="${process.env.CLIENT_URL}/applications" 
           style="background: #6366F1; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          View My Applications
        </a>
      </div>
    `
  })

};

module.exports = { sendEmail, emailTemplates };