const express = require('express');
const router = express.Router();
const { getTeams, createTeam, joinTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTeams);
router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam);

module.exports = router;
