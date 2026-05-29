const prisma = require('../config/postgres');

// =============================================
// TEAM MANAGEMENT (Professor & Student)
// =============================================

// GET /api/teams (Get all teams for the current user)
const getTeams = async (req, res) => {
  try {
    const isTeacher = req.user.role === 'TEACHER';
    
    let teams;
    if (isTeacher) {
      teams = await prisma.team.findMany({
        where: { teacherId: req.user.id },
        include: { members: { select: { id: true, name: true, email: true } }, _count: { select: { assignments: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      teams = await prisma.team.findMany({
        where: { members: { some: { id: req.user.id } } },
        include: { teacher: { select: { id: true, name: true } }, members: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ success: true, data: teams });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching teams' });
  }
};

// POST /api/teams (Teacher only)
const createTeam = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Only teachers can create teams' });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Team name is required' });

    // Generate random 6 character alphanumeric code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const team = await prisma.team.create({
      data: {
        name,
        joinCode,
        teacherId: req.user.id
      }
    });

    res.json({ success: true, data: team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ success: false, error: 'Server error creating team' });
  }
};

// POST /api/teams/join (Student only)
const joinTeam = async (req, res) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode) return res.status(400).json({ success: false, error: 'Join code is required' });

    // Find the team
    const team = await prisma.team.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
      include: { members: true }
    });

    if (!team) return res.status(404).json({ success: false, error: 'Invalid join code' });

    // Check if already a member
    if (team.members.some(m => m.id === req.user.id)) {
      return res.status(400).json({ success: false, error: 'You are already a member of this team' });
    }

    // Check team size limit (assuming max 6)
    if (team.members.length >= 6) {
      return res.status(400).json({ success: false, error: 'This team is full (max 6 students)' });
    }

    // Add user to team
    await prisma.team.update({
      where: { id: team.id },
      data: {
        members: { connect: { id: req.user.id } }
      }
    });

    res.json({ success: true, message: `Successfully joined team ${team.name}` });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ success: false, error: 'Server error joining team' });
  }
};

module.exports = {
  getTeams,
  createTeam,
  joinTeam
};
