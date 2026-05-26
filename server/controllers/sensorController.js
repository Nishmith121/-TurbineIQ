// ============================================
// Sensor Controller — SCADA data queries
// ============================================

const SensorReading = require('../models/SensorReading');

/**
 * GET /api/sensors/:machineType
 * Get sensor readings for a machine type with filtering
 */
const getSensorData = async (req, res) => {
  try {
    const { machineType } = req.params;
    const { startTime, endTime, limit = 100, skip = 0, sortOrder = 'asc' } = req.query;

    const validTypes = [
      'wind_turbine', 'steam_turbine', 'gas_turbine', 'hydro_turbine',
      'motor', 'generator', 'pump', 'compressor',
    ];

    if (!validTypes.includes(machineType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type. Valid: ${validTypes.join(', ')}`,
      });
    }

    // Build query
    const query = { machineType };
    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) query.timestamp.$gte = new Date(startTime);
      if (endTime) query.timestamp.$lte = new Date(endTime);
    }

    const readings = await SensorReading.find(query)
      .sort({ timestamp: sortOrder === 'desc' ? -1 : 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await SensorReading.countDocuments(query);

    // Get available sensor fields
    let sensorFields = [];
    if (readings.length > 0 && readings[0].readings) {
      sensorFields = Array.from(readings[0].readings.keys ? readings[0].readings.keys() : Object.keys(readings[0].readings));
    }

    res.json({
      success: true,
      data: readings,
      count: readings.length,
      total,
      sensorFields,
    });
  } catch (error) {
    console.error('GetSensorData error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/sensors/:machineType/stats
 * Get aggregated statistics for sensor data
 */
const getSensorStats = async (req, res) => {
  try {
    const { machineType } = req.params;

    const stats = await SensorReading.aggregate([
      { $match: { machineType } },
      {
        $group: {
          _id: '$machineType',
          totalReadings: { $sum: 1 },
          firstReading: { $min: '$timestamp' },
          lastReading: { $max: '$timestamp' },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats.length > 0 ? stats[0] : { totalReadings: 0 },
    });
  } catch (error) {
    console.error('GetSensorStats error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getSensorData, getSensorStats };
