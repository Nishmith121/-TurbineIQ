// ============================================
// Project Controller — CRUD for student projects
// ============================================

const prisma = require('../config/postgres');

/**
 * GET /api/projects
 * List all projects for the current user
 */
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        _count: { select: { trials: true } },
        trials: {
          orderBy: { trialNumber: 'desc' },
          take: 1,
          select: {
            trialNumber: true,
            efficiencyPercent: true,
            powerOutput: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('GetProjects error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * POST /api/projects
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const { name, description, machineType } = req.body;

    if (!name || !machineType) {
      return res.status(400).json({
        success: false,
        error: 'Please provide project name and machine type',
      });
    }

    // Validate machine type
    const validTypes = [
      'WIND_TURBINE', 'STEAM_TURBINE', 'GAS_TURBINE', 'HYDRO_TURBINE',
      'MOTOR', 'GENERATOR', 'PUMP', 'COMPRESSOR',
    ];
    if (!validTypes.includes(machineType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid machine type. Valid types: ${validTypes.join(', ')}`,
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        machineType,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('CreateProject error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * GET /api/projects/:id
 * Get project details with all trials
 */
const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        trials: {
          orderBy: { trialNumber: 'asc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('GetProject error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * PUT /api/projects/:id
 * Update project
 */
const updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('UpdateProject error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * DELETE /api/projects/:id
 * Delete project and all its trials
 */
const deleteProject = async (req, res) => {
  try {
    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('DeleteProject error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject };
