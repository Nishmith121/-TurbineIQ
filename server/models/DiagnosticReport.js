// ============================================
// MongoDB Model: Diagnostic Reports
// Generated diagnosis comparing expected vs actual
// ============================================

const mongoose = require('mongoose');

const diagnosticReportSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    index: true,
  },
  trialId: {
    type: String,
    required: true,
  },
  machineType: {
    type: String,
    required: true,
    enum: ['wind_turbine', 'steam_turbine', 'gas_turbine', 'hydro_turbine', 'motor', 'generator', 'pump', 'compressor'],
  },
  
  // Overall health score (0-100)
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  
  // Deviations detected
  deviations: [{
    parameter: String,
    expectedValue: Number,
    actualValue: Number,
    deviationPercent: Number,
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
  }],
  
  // Root causes identified
  rootCauses: [{
    cause: String,
    confidence: Number,    // 0-1 confidence score
    affectedParameters: [String],
    description: String,
  }],
  
  // Recommendations for improvement
  recommendations: [{
    action: String,
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
    },
    expectedImprovement: String,
    description: String,
  }],
  
}, {
  timestamps: true,
  collection: 'diagnostic_reports',
});

module.exports = mongoose.model('DiagnosticReport', diagnosticReportSchema);
