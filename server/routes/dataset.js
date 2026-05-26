const express = require('express');
const router = express.Router();
const { getComponents, getResearchPapers } = require('../controllers/datasetController');

// GET /api/dataset/components/:machineType
// Public endpoint for loading dataset components
router.get('/components/:machineType', getComponents);

// GET /api/dataset/research/:machineType
// Public endpoint for loading research papers
router.get('/research/:machineType', getResearchPapers);

module.exports = router;
