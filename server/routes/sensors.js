// ============================================
// Sensor Routes — SCADA Data Queries
// ============================================

const express = require('express');
const router = express.Router();
const { getSensorData, getSensorStats } = require('../controllers/sensorController');

// Sensor data is public (for learning)
router.get('/:machineType', getSensorData);
router.get('/:machineType/stats', getSensorStats);

module.exports = router;
