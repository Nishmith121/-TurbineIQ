// ============================================
// Simulation Controller — Trial & Error Engine
// The core feature: students modify parameters
// and see how efficiency changes
// ============================================

const prisma = require('../config/postgres');
const SimulationLog = require('../models/SimulationLog');
const { runSimulation, getDefaultParameters, getParameterInfo } = require('../utils/simulationEngine');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * POST /api/projects/:id/simulate
 * Run a new simulation trial
 * Body: { parameters: { bladeCount: 3, rotorDiameter: 80, ... }, trialName?: string, notes?: string }
 */
const runTrial = async (req, res) => {
  try {
    const { parameters, trialName, notes } = req.body;

    // Get the project and verify ownership
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        trials: { orderBy: { trialNumber: 'desc' }, take: 1 },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Please provide simulation parameters',
      });
    }

    // Determine trial number
    const lastTrialNumber = project.trials.length > 0 ? project.trials[0].trialNumber : 0;
    const trialNumber = lastTrialNumber + 1;

    // Run the simulation engine
    const result = runSimulation(project.machineType, parameters);

    // Save trial to PostgreSQL
    const trial = await prisma.simulationTrial.create({
      data: {
        trialNumber,
        trialName: trialName || `Trial ${trialNumber}`,
        parameters,
        efficiencyPercent: result.efficiency,
        powerOutput: result.powerOutput,
        specificResults: result.specificResults,
        notes: notes || null,
        projectId: project.id,
      },
    });

    // Calculate improvement from previous trial
    let improvement = null;
    if (project.trials.length > 0) {
      const prevTrial = project.trials[0];
      const prevParams = prevTrial.parameters || {};
      
      // Find changed parameters
      const changedParameters = [];
      for (const [key, value] of Object.entries(parameters)) {
        if (prevParams[key] !== undefined && prevParams[key] !== value) {
          changedParameters.push({
            paramName: key,
            oldValue: prevParams[key],
            newValue: value,
          });
        }
      }

      improvement = {
        efficiencyDelta: result.efficiency - (prevTrial.efficiencyPercent || 0),
        powerDelta: result.powerOutput - (prevTrial.powerOutput || 0),
        changedParameters,
      };
    }

    // Save detailed log to MongoDB
    try {
      await SimulationLog.create({
        projectId: project.id,
        trialId: trial.id,
        machineType: project.machineType.toLowerCase(),
        parameterSnapshot: parameters,
        calculationSteps: result.calculationSteps,
        intermediateResults: result.specificResults,
        finalEfficiency: result.efficiency,
        finalPowerOutput: result.powerOutput,
        improvementFromPrevious: improvement,
      });
    } catch (mongoErr) {
      console.warn('Failed to save simulation log to MongoDB:', mongoErr.message);
      // Don't fail the request — PG data is saved
    }

    res.status(201).json({
      success: true,
      data: {
        trial,
        results: result,
        improvement,
      },
    });
  } catch (error) {
    console.error('RunTrial error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

/**
 * GET /api/projects/:id/trials
 * List all trials for a project (for comparison)
 */
const getTrials = async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const trials = await prisma.simulationTrial.findMany({
      where: { projectId: req.params.id },
      orderBy: { trialNumber: 'asc' },
    });

    // Calculate improvements between consecutive trials
    const trialsWithComparison = trials.map((trial, idx) => {
      let improvement = null;
      if (idx > 0) {
        const prev = trials[idx - 1];
        improvement = {
          efficiencyDelta: (trial.efficiencyPercent || 0) - (prev.efficiencyPercent || 0),
          powerDelta: (trial.powerOutput || 0) - (prev.powerOutput || 0),
        };
      }
      return { ...trial, improvement };
    });

    res.json({
      success: true,
      data: trialsWithComparison,
      count: trials.length,
      summary: {
        totalTrials: trials.length,
        bestEfficiency: trials.length > 0
          ? Math.max(...trials.map(t => t.efficiencyPercent || 0))
          : null,
        bestPowerOutput: trials.length > 0
          ? Math.max(...trials.map(t => t.powerOutput || 0))
          : null,
      },
    });
  } catch (error) {
    console.error('GetTrials error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/projects/:id/trials/:trialId
 * Get a single trial's details (including MongoDB simulation log)
 */
const getTrial = async (req, res) => {
  try {
    const trial = await prisma.simulationTrial.findUnique({
      where: { id: req.params.trialId },
      include: {
        project: {
          select: { id: true, name: true, machineType: true, userId: true },
        },
      },
    });

    if (!trial || trial.project.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Trial not found',
      });
    }

    // Fetch detailed calculation steps from MongoDB
    let simulationLog = null;
    try {
      simulationLog = await SimulationLog.findOne({ trialId: trial.id }).lean();
    } catch (mongoErr) {
      console.warn('Could not fetch simulation log from MongoDB:', mongoErr.message);
    }

    res.json({
      success: true,
      data: {
        ...trial,
        simulationLog,
      },
    });
  } catch (error) {
    console.error('GetTrial error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/simulations/defaults/:machineType
 * Get default parameters and parameter info for a machine type
 */
const getSimulationDefaults = async (req, res) => {
  try {
    const { machineType } = req.params;

    const validTypes = [
      'WIND_TURBINE', 'STEAM_TURBINE', 'GAS_TURBINE', 'HYDRO_TURBINE',
      'MOTOR', 'GENERATOR', 'PUMP', 'COMPRESSOR',
    ];

    if (!validTypes.includes(machineType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type. Valid: ${validTypes.join(', ')}`,
      });
    }

    const defaults = getDefaultParameters(machineType);
    const paramInfo = getParameterInfo(machineType);

    // Also run a baseline simulation with default params
    const baselineResult = runSimulation(machineType, defaults);

    res.json({
      success: true,
      data: {
        machineType,
        defaultParameters: defaults,
        parameterInfo: paramInfo,
        baselineResult,
      },
    });
  } catch (error) {
    console.error('GetSimulationDefaults error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * POST /api/projects/:id/validate-real
 * Validates a physical model using Gemini Vision API and ML Engine
 * Body: { description, image (base64 string), sensorData }
 */
const validateRealModel = async (req, res) => {
  try {
    const { description, image, sensorData } = req.body;

    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    
    // 1. Machine Learning Diagnostic on Sensor Data
    let powerOutput = 0;
    let efficiency = 0;
    let aiRecommendation = '';
    
    if (sensorData) {
      const result = runSimulation(project.machineType, sensorData);
      powerOutput = result.powerOutput;
      efficiency = result.efficiency;
      aiRecommendation = result.specificResults?.aiRecommendation || "We need more data to optimize your model.";
    }

    // 2. Gemini Vision Diagnostic on Image
    let visionFeedback = "No image provided for visual inspection.";
    if (image) {
      try {
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `You are an expert mechanical engineering professor at a top university analyzing a student's physical scale model of a ${project.machineType.replace('_', ' ')}. 
The student describes it as: "${description || 'No description'}". 
Analyze the image of their physical model. Point out what they did correctly, and identify any potential flaws, misalignments, or inefficiencies in their build. Keep it encouraging but highly technical (about 3-4 sentences max).`;
        
        const imageParts = [
          {
            inlineData: {
              data: base64Data,
              mimeType
            }
          }
        ];
        
        const aiResult = await model.generateContent([prompt, ...imageParts]);
        const response = await aiResult.response;
        visionFeedback = response.text();
      } catch (geminiError) {
        console.error("Gemini Vision failed:", geminiError);
        visionFeedback = "Error analyzing image with AI. Please ensure your image is clear and try again.";
      }
    }

    res.json({
      success: true,
      data: {
        powerOutput,
        efficiency,
        aiRecommendation,
        visionFeedback
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ success: false, error: 'Validation failed' });
  }
};

module.exports = {
  runTrial,
  getTrials,
  getTrial,
  getSimulationDefaults,
  validateRealModel,
};
