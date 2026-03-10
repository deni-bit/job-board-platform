const multer = require('multer');

// Store file in memory — we send it to Cloudinary directly
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Only allow PDF, JPG, PNG
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;