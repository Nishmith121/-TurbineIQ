// ============================================
// Simulation Routes — Trial & Error
// ============================================

const express = require('express');
const router = express.Router();
const {
  runTrial,
  getTrials,
  getTrial,
  getSimulationDefaults,
  validateRealModel,
} = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');

// Get default parameters (public — helps students explore before signing up)
router.get('/defaults/:machineType', getSimulationDefaults);

// Trial routes require authentication
router.post('/projects/:id/simulate', protect, runTrial);
router.post('/projects/:id/validate-real', protect, validateRealModel);
router.get('/projects/:id/trials', protect, getTrials);
router.get('/projects/:id/trials/:trialId', protect, getTrial);

module.exports = router;
