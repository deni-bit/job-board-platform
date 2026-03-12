require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');

const jobs = [
  // TECH
  { title: 'Senior React Developer', company: 'TechCorp Ltd', location: 'Dar es Salaam', type: 'full-time', salary: { min: 2000, max: 4000 }, description: 'We are looking for an experienced React developer to join our growing team. You will build beautiful user interfaces for our flagship products.', requirements: ['3+ years React experience', 'Strong JavaScript skills', 'Experience with Redux', 'Knowledge of REST APIs'], skills: ['React', 'JavaScript', 'Redux', 'CSS'], category: 'Technology' },
  { title: 'Backend Node.js Developer', company: 'Innovate Africa', location: 'Nairobi', type: 'full-time', salary: { min: 1800, max: 3500 }, description: 'Join our backend team to build scalable APIs and microservices that power millions of users across East Africa.', requirements: ['2+ years Node.js', 'MongoDB experience', 'REST API design', 'Git proficiency'], skills: ['Node.js', 'MongoDB', 'Express', 'AWS'], category: 'Technology' },
  { title: 'Mobile Developer (React Native)', company: 'AppVentures', location: 'remote', type: 'full-time', salary: { min: 2500, max: 5000 }, description: 'Build cross-platform mobile applications used by thousands of customers daily.', requirements: ['React Native experience', 'iOS and Android knowledge', 'API integration', 'App Store deployment'], skills: ['React Native', 'Expo', 'JavaScript', 'Firebase'], category: 'Technology' },
  { title: 'UI/UX Designer', company: 'DesignHub', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1200, max: 2500 }, description: 'Create stunning user experiences for web and mobile applications. You will work closely with developers to bring designs to life.', requirements: ['Figma proficiency', 'Portfolio required', 'Mobile design experience', 'User research skills'], skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'], category: 'Design' },
  { title: 'DevOps Engineer', company: 'CloudSystems', location: 'remote', type: 'full-time', salary: { min: 3000, max: 6000 }, description: 'Manage and scale our cloud infrastructure on AWS. Implement CI/CD pipelines and ensure 99.9% uptime.', requirements: ['AWS certification preferred', 'Docker and Kubernetes', 'CI/CD experience', 'Linux proficiency'], skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], category: 'Technology' },
  { title: 'Data Scientist', company: 'DataMinds Africa', location: 'Nairobi', type: 'full-time', salary: { min: 2500, max: 5000 }, description: 'Use machine learning and data analysis to drive business decisions for our clients across Africa.', requirements: ['Python proficiency', 'Machine learning knowledge', 'SQL expertise', 'Statistics background'], skills: ['Python', 'TensorFlow', 'SQL', 'Pandas'], category: 'Technology' },
  { title: 'Cybersecurity Analyst', company: 'SecureNet', location: 'Dar es Salaam', type: 'full-time', salary: { min: 2000, max: 4000 }, description: 'Protect our clients digital assets from cyber threats. Conduct security audits and implement security protocols.', requirements: ['Security certifications preferred', 'Network security knowledge', 'Penetration testing', 'Incident response'], skills: ['Kali Linux', 'Network Security', 'Python', 'SIEM'], category: 'Technology' },
  { title: 'Full Stack Developer', company: 'StartupTZ', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1500, max: 3000 }, description: 'Work on all layers of our platform from database to user interface. Great opportunity to grow fast in a startup environment.', requirements: ['React and Node.js', 'MongoDB knowledge', 'Problem solving skills', 'Team player'], skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'], category: 'Technology' },

  // FINANCE
  { title: 'Financial Analyst', company: 'First National Bank', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1500, max: 3000 }, description: 'Analyze financial data and prepare reports to support business decisions. Work with senior management on strategic planning.', requirements: ['Finance degree', 'Excel proficiency', 'Analytical skills', '2+ years experience'], skills: ['Excel', 'Financial Modeling', 'PowerBI', 'Accounting'], category: 'Finance' },
  { title: 'Accountant', company: 'PriceWaterhouseTZ', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1200, max: 2500 }, description: 'Manage financial records, prepare tax filings and ensure compliance with financial regulations.', requirements: ['CPA qualification', 'QuickBooks experience', 'Tax knowledge', 'Attention to detail'], skills: ['QuickBooks', 'Tax Filing', 'IFRS', 'Excel'], category: 'Finance' },
  { title: 'Investment Banker', company: 'Equity Capital Africa', location: 'Nairobi', type: 'full-time', salary: { min: 4000, max: 8000 }, description: 'Execute mergers, acquisitions, and capital raising transactions for leading African companies.', requirements: ['Finance or Economics degree', 'Financial modeling', 'Deal experience', 'CFA preferred'], skills: ['Financial Modeling', 'Valuation', 'Excel', 'PowerPoint'], category: 'Finance' },

  // MARKETING
  { title: 'Digital Marketing Manager', company: 'BrandAfrica', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1200, max: 2500 }, description: 'Lead our digital marketing strategy across social media, email, and paid advertising to grow our brand presence.', requirements: ['3+ years digital marketing', 'Google Ads certified', 'SEO knowledge', 'Analytics skills'], skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Google Analytics'], category: 'Marketing' },
  { title: 'Content Creator', company: 'MediaHub TZ', location: 'remote', type: 'part-time', salary: { min: 500, max: 1200 }, description: 'Create engaging content for social media platforms including Instagram, TikTok and YouTube for our clients.', requirements: ['Video editing skills', 'Creative mindset', 'Social media knowledge', 'Portfolio required'], skills: ['Video Editing', 'Canva', 'Copywriting', 'Social Media'], category: 'Marketing' },
  { title: 'SEO Specialist', company: 'GrowthHackers', location: 'remote', type: 'full-time', salary: { min: 1000, max: 2000 }, description: 'Improve organic search rankings for our clients websites and drive qualified traffic through search engine optimization.', requirements: ['SEO tools experience', 'Content writing', 'Technical SEO knowledge', 'Link building experience'], skills: ['SEMrush', 'Ahrefs', 'Google Search Console', 'WordPress'], category: 'Marketing' },

  // HEALTHCARE
  { title: 'Medical Doctor', company: 'Aga Khan Hospital', location: 'Dar es Salaam', type: 'full-time', salary: { min: 3000, max: 6000 }, description: 'Provide high quality medical care to patients. Opportunity to work in a world-class healthcare facility.', requirements: ['Medical degree (MD)', 'Medical board registration', '2+ years clinical experience', 'Patient care focus'], skills: ['Clinical Diagnosis', 'Patient Care', 'Medical Records', 'Emergency Medicine'], category: 'Healthcare' },
  { title: 'Nurse', company: 'Muhimbili Hospital', location: 'Dar es Salaam', type: 'full-time', salary: { min: 800, max: 1500 }, description: 'Provide compassionate nursing care to patients in our busy hospital wards.', requirements: ['Nursing degree', 'Nursing board registration', 'Patient care experience', 'Teamwork skills'], skills: ['Patient Care', 'IV Administration', 'Medical Records', 'Emergency Response'], category: 'Healthcare' },
  { title: 'Pharmacist', company: 'MedPlus Pharmacy', location: 'Mwanza', type: 'full-time', salary: { min: 1200, max: 2500 }, description: 'Dispense medications and provide pharmaceutical advice to patients and healthcare professionals.', requirements: ['Pharmacy degree', 'Board registration', 'Attention to detail', 'Customer service skills'], skills: ['Drug Dispensing', 'Patient Counseling', 'Inventory Management', 'Prescription Review'], category: 'Healthcare' },

  // EDUCATION
  { title: 'Mathematics Teacher', company: 'International School of Dar', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1000, max: 2000 }, description: 'Teach mathematics to secondary school students in a dynamic international school environment.', requirements: ['Mathematics degree', 'Teaching certificate', 'Classroom management', 'Patience and passion'], skills: ['Mathematics', 'Curriculum Development', 'Student Assessment', 'Classroom Management'], category: 'Education' },
  { title: 'E-Learning Developer', company: 'EduTech Africa', location: 'remote', type: 'full-time', salary: { min: 1200, max: 2500 }, description: 'Create engaging online learning content and interactive courses for our e-learning platform.', requirements: ['Instructional design experience', 'Video production', 'LMS knowledge', 'Creative skills'], skills: ['Articulate 360', 'Video Editing', 'Instructional Design', 'HTML/CSS'], category: 'Education' },

  // ENGINEERING
  { title: 'Civil Engineer', company: 'BuildTech Tanzania', location: 'Dar es Salaam', type: 'full-time', salary: { min: 1800, max: 3500 }, description: 'Design and supervise construction of infrastructure projects including roads, bridges and buildings.', requirements: ['Civil Engineering degree', 'AutoCAD proficiency', '3+ years experience', 'Project management skills'], skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'Site Supervision'], category: 'Engineering' },
  { title: 'Electrical Engineer', company: 'PowerGrid Tanzania', location: 'Dodoma', type: 'full-time', salary: { min: 1500, max: 3000 }, description: 'Design and maintain electrical systems for industrial and commercial facilities across Tanzania.', requirements: ['Electrical Engineering degree', 'Board registration', 'AutoCAD Electrical', 'Safety knowledge'], skills: ['Electrical Design', 'AutoCAD', 'PLC Programming', 'Safety Standards'], category: 'Engineering' },

  // HOSPITALITY
  { title: 'Hotel Manager', company: 'Serena Hotels', location: 'Zanzibar', type: 'full-time', salary: { min: 2000, max: 4000 }, description: 'Manage all operations of our luxury hotel in Zanzibar. Ensure exceptional guest experience and team performance.', requirements: ['Hospitality degree', '5+ years hotel experience', 'Leadership skills', 'Multiple languages preferred'], skills: ['Hotel Management', 'Customer Service', 'Team Leadership', 'Revenue Management'], category: 'Hospitality' },
  { title: 'Executive Chef', company: 'Zanzibar Beach Resort', location: 'Zanzibar', type: 'full-time', salary: { min: 1500, max: 3000 }, description: 'Lead our kitchen team to create world-class culinary experiences for our international guests.', requirements: ['Culinary degree', '5+ years kitchen experience', 'Menu development', 'Team management'], skills: ['Culinary Arts', 'Menu Planning', 'Kitchen Management', 'Food Safety'], category: 'Hospitality' },

  // LOGISTICS
  { title: 'Supply Chain Manager', company: 'LogiTech Africa', location: 'Dar es Salaam', type: 'full-time', salary: { min: 2000, max: 4000 }, description: 'Oversee end-to-end supply chain operations for our East African distribution network.', requirements: ['Supply chain degree', '4+ years experience', 'ERP systems knowledge', 'Analytical skills'], skills: ['SAP', 'Inventory Management', 'Logistics Planning', 'Data Analysis'], category: 'Logistics' },
  { title: 'Truck Driver', company: 'FastFreight Tanzania', location: 'Dar es Salaam', type: 'full-time', salary: { min: 600, max: 1200 }, description: 'Transport goods safely and on time across Tanzania and neighboring countries.', requirements: ['Valid driving license Class C', 'Clean driving record', '3+ years experience', 'Knowledge of EAC routes'], skills: ['Heavy Vehicle Driving', 'Route Planning', 'Vehicle Maintenance', 'Safety Compliance'], category: 'Logistics' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find employer user
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      console.log('No employer found! Please register an employer first.');
      process.exit(1);
    }

    // Delete existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert all jobs with employer reference
    const jobsWithEmployer = jobs.map((job, index) => ({
      ...job,
      employer: employer._id,
      isActive: true,
      isFeatured: index < 4, // first 4 jobs are featured
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }));

    await Job.insertMany(jobsWithEmployer);
    console.log(`✅ Seeded ${jobs.length} jobs successfully!`);
    process.exit(0);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seed();