const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = '';
    
    // Organize files by type
    if (file.fieldname === 'documents') {
      subfolder = 'documents';
    } else if (file.fieldname === 'photos') {
      subfolder = 'photos';
    } else if (file.fieldname === 'avatars') {
      subfolder = 'avatars';
    } else {
      subfolder = 'misc';
    }
    
    const fullPath = path.join(uploadDir, subfolder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    documents: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i,
    photos: /\.(jpg|jpeg|png|gif|webp)$/i,
    avatars: /\.(jpg|jpeg|png|gif|webp)$/i
  };
  
  const fieldType = file.fieldname;
  const allowedPattern = allowedTypes[fieldType];
  
  if (allowedPattern && allowedPattern.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldType}. Allowed: ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10 // Maximum 10 files per request
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field' });
    }
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};

// Helper function to delete uploaded file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file ${filePath}:`, error.message);
  }
};

module.exports = {
  upload,
  handleUploadError,
  deleteFile
};
