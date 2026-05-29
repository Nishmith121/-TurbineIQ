const express = require('express');
const router = express.Router();
const { askQuestion } = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

// Route to ask questions to the AI tutor
router.post('/ask', protect, askQuestion);

module.exports = router;
