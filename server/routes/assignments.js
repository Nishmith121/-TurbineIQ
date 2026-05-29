const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAssignments, createAssignment, submitAssignment, getSubmissions, gradeSubmission } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc, and .docx format allowed!'));
    }
  }
});

router.get('/', protect, getAssignments);
router.post('/', protect, createAssignment);
router.post('/:id/submit', protect, upload.single('report'), submitAssignment);
router.get('/:id/submissions', protect, getSubmissions);
router.post('/submissions/:id/grade', protect, gradeSubmission);

module.exports = router;
