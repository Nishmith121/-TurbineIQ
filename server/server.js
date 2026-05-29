// ============================================
// TurbineIQ — Express Server Entry Point
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectMongoDB = require('./config/mongodb');

// Import routes
const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const projectRoutes = require('./routes/projects');
const simulationRoutes = require('./routes/simulations');
const sensorRoutes = require('./routes/sensors');
const learningRoutes = require('./routes/learning');
const datasetRoutes = require('./routes/dataset');
const teamRoutes = require('./routes/teams');
const assignmentRoutes = require('./routes/assignments');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE
// =============================================

// CORS — allow React dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============================================
// ROUTES
// =============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TurbineIQ API is running ⚡',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/dataset', datasetRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/assignments', assignmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// =============================================
// START SERVER
// =============================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Note: Prisma connects lazily on first query
    // If you want to verify PG connection at startup:
    const prisma = require('./config/postgres');
    await prisma.$connect();
    console.log('✅ PostgreSQL connected via Prisma');

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n⚡ TurbineIQ Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
