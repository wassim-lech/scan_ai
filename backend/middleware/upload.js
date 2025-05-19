const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueFilename = `${uuid.v4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  // Allow only image files
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
