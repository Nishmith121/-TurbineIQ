// ============================================
// MongoDB Model: Simulation Logs
// Detailed per-iteration logs with parameter snapshots
// ============================================

const mongoose = require('mongoose');

const simulationLogSchema = new mongoose.Schema({
  // Reference to PostgreSQL project/trial IDs
  projectId: {
    type: String,
    required: true,
    index: true,
  },
  trialId: {
    type: String,
    required: true,
    index: true,
  },
  machineType: {
    type: String,
    required: true,
    enum: ['wind_turbine', 'steam_turbine', 'gas_turbine', 'hydro_turbine', 'motor', 'generator', 'pump', 'compressor'],
  },
  
  // Full parameter snapshot at the time of simulation
  parameterSnapshot: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  
  // Step-by-step calculation details
  calculationSteps: [{
    stepName: String,
    formula: String,
    inputs: mongoose.Schema.Types.Mixed,
    output: Number,
    unit: String,
  }],
  
  // Intermediate results
  intermediateResults: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  
  // Final results
  finalEfficiency: Number,
  finalPowerOutput: Number,
  
  // Comparison with previous trial
  improvementFromPrevious: {
    efficiencyDelta: Number,    // +2.5 means 2.5% improvement
    powerDelta: Number,
    changedParameters: [{
      paramName: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    }],
  },
  
}, {
  timestamps: true,
  collection: 'simulation_logs',
});

module.exports = mongoose.model('SimulationLog', simulationLogSchema);
