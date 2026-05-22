// ============================================
// MongoDB Model: Sensor/SCADA Readings
// Time-series data from each machine type
// ============================================

const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  machineType: {
    type: String,
    required: true,
    enum: ['wind_turbine', 'steam_turbine', 'gas_turbine', 'hydro_turbine', 'motor', 'generator', 'pump', 'compressor'],
    index: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
  },
  // Dynamic readings — each machine type has different sensor columns
  // e.g., wind: { wind_speed_m_s, active_power_kw, rotor_speed_rpm, ... }
  // e.g., gas:  { exhaust_temp_c, fuel_flow_kg_s, compressor_discharge_pressure_bar, ... }
  readings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
  collection: 'sensor_readings',
});

// Compound index for efficient queries
sensorReadingSchema.index({ machineType: 1, timestamp: 1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
