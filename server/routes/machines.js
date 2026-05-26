// ============================================
// Machine Routes — Catalog, CAD, Research, SCADA
// ============================================

const express = require('express');
const router = express.Router();
const {
  getAllMachines,
  getMachineCatalog,
  getCadModels,
  getResearchPapers,
  getScadaData,
  getResourceLinks,
} = require('../controllers/machineController');

// All machine routes are public (for learning/exploration)
router.get('/', getAllMachines);
router.get('/:type/catalog', getMachineCatalog);
router.get('/:type/cad-models', getCadModels);
router.get('/:type/research', getResearchPapers);
router.get('/:type/scada', getScadaData);
router.get('/:type/resources', getResourceLinks);

module.exports = router;
