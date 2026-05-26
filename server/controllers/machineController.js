// ============================================
// Machine Controller — Catalog, CAD, Research, SCADA
// ============================================

const prisma = require('../config/postgres');
const SensorReading = require('../models/SensorReading');

// Map URL-friendly types to Prisma enum values
const MACHINE_TYPE_MAP = {
  'wind_turbine': 'WIND_TURBINE',
  'steam_turbine': 'STEAM_TURBINE',
  'gas_turbine': 'GAS_TURBINE',
  'hydro_turbine': 'HYDRO_TURBINE',
  'motor': 'MOTOR',
  'generator': 'GENERATOR',
  'pump': 'PUMP',
  'compressor': 'COMPRESSOR',
};

const MACHINE_INFO = {
  wind_turbine: { icon: '🌀', name: 'Wind Turbine', description: 'Convert wind kinetic energy to electrical energy' },
  steam_turbine: { icon: '💨', name: 'Steam Turbine', description: 'Convert thermal energy from steam to mechanical work' },
  gas_turbine: { icon: '🔥', name: 'Gas Turbine', description: 'Combustion-based power generation using Brayton cycle' },
  hydro_turbine: { icon: '💧', name: 'Hydraulic Turbine', description: 'Convert hydraulic energy from water flow to power' },
  motor: { icon: '⚡', name: 'Electric Motor', description: 'Convert electrical energy to mechanical rotation' },
  generator: { icon: '🔋', name: 'Generator', description: 'Convert mechanical energy to electrical energy' },
  pump: { icon: '🔄', name: 'Water Pump', description: 'Move fluids using mechanical action' },
  compressor: { icon: '🌬️', name: 'Compressor', description: 'Increase gas pressure by reducing volume' },
};

/**
 * GET /api/machines
 * List all supported machine types
 */
const getAllMachines = async (req, res) => {
  try {
    const machines = Object.entries(MACHINE_INFO).map(([key, info]) => ({
      type: key,
      enumType: MACHINE_TYPE_MAP[key],
      ...info,
    }));

    res.json({
      success: true,
      data: machines,
    });
  } catch (error) {
    console.error('GetAllMachines error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/machines/:type/catalog
 * Get manufacturers & models for a machine type
 */
const getMachineCatalog = async (req, res) => {
  try {
    const { type } = req.params;
    const enumType = MACHINE_TYPE_MAP[type];

    if (!enumType) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type: ${type}. Valid types: ${Object.keys(MACHINE_TYPE_MAP).join(', ')}`,
      });
    }

    const catalog = await prisma.machineCatalog.findMany({
      where: { machineType: enumType },
      orderBy: { manufacturer: 'asc' },
    });

    res.json({
      success: true,
      data: catalog,
      count: catalog.length,
    });
  } catch (error) {
    console.error('GetMachineCatalog error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/machines/:type/cad-models
 * Get 3D model links for a machine type
 */
const getCadModels = async (req, res) => {
  try {
    const { type } = req.params;
    const enumType = MACHINE_TYPE_MAP[type];

    if (!enumType) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type: ${type}`,
      });
    }

    const cadModels = await prisma.cadModel.findMany({
      where: { machineType: enumType },
    });

    res.json({
      success: true,
      data: cadModels,
      count: cadModels.length,
    });
  } catch (error) {
    console.error('GetCadModels error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/machines/:type/research
 * Get research papers for a machine type
 */
const getResearchPapers = async (req, res) => {
  try {
    const { type } = req.params;

    // Map URL type to domain names used in CSVs
    const domainMap = {
      wind_turbine: 'Wind',
      steam_turbine: 'Steam',
      gas_turbine: 'Gas',
      hydro_turbine: 'Hydraulic',
      motor: 'Motors',
      generator: 'Generators',
      pump: 'Pumps',
      compressor: 'Compressors',
    };

    const domain = domainMap[type];
    if (!domain) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type: ${type}`,
      });
    }

    const papers = await prisma.researchPaper.findMany({
      where: { domain },
      orderBy: { year: 'desc' },
    });

    res.json({
      success: true,
      data: papers,
      count: papers.length,
    });
  } catch (error) {
    console.error('GetResearchPapers error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/machines/:type/scada
 * Get SCADA/sensor data from MongoDB
 */
const getScadaData = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 100, skip = 0 } = req.query;

    if (!MACHINE_TYPE_MAP[type]) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type: ${type}`,
      });
    }

    const readings = await SensorReading.find({ machineType: type })
      .sort({ timestamp: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await SensorReading.countDocuments({ machineType: type });

    res.json({
      success: true,
      data: readings,
      count: readings.length,
      total,
    });
  } catch (error) {
    console.error('GetScadaData error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/machines/:type/resources
 * Get all resource links from master data pack
 */
const getResourceLinks = async (req, res) => {
  try {
    const { type } = req.params;

    // Map URL type to CSV machine type names
    const typeMap = {
      wind_turbine: 'Wind',
      steam_turbine: 'Steam',
      gas_turbine: 'Gas',
      hydro_turbine: 'Hydraulic',
      motor: 'Motors',
      generator: 'Generators',
      pump: 'Pumps',
      compressor: 'Compressors',
    };

    const machineTypeName = typeMap[type];
    if (!machineTypeName) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type: ${type}`,
      });
    }

    const resources = await prisma.resourceLink.findMany({
      where: { machineType: machineTypeName },
      orderBy: { priority: 'asc' },
    });

    res.json({
      success: true,
      data: resources,
      count: resources.length,
    });
  } catch (error) {
    console.error('GetResourceLinks error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getAllMachines,
  getMachineCatalog,
  getCadModels,
  getResearchPapers,
  getScadaData,
  getResourceLinks,
};
