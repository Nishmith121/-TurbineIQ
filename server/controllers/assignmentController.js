const prisma = require('../config/postgres');

// =============================================
// ASSIGNMENT MANAGEMENT (Professor & Student)
// =============================================

// GET /api/assignments (Get assignments for teacher or student)
const getAssignments = async (req, res) => {
  try {
    const isTeacher = req.user.role === 'TEACHER';
    
    let assignments;
    if (isTeacher) {
      assignments = await prisma.assignment.findMany({
        where: { teacherId: req.user.id },
        include: { teams: { select: { id: true, name: true } }, _count: { select: { submissions: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Get all teams the student is in
      const userTeams = await prisma.team.findMany({
        where: { members: { some: { id: req.user.id } } },
        select: { id: true }
      });
      const teamIds = userTeams.map(t => t.id);

      assignments = await prisma.assignment.findMany({
        where: { teams: { some: { id: { in: teamIds } } } },
        include: { 
          teacher: { select: { name: true } },
          submissions: {
            where: { studentId: req.user.id }
          }
        },
        orderBy: { dueDate: 'asc' }
      });
    }

    res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching assignments' });
  }
};

// POST /api/assignments (Teacher only)
const createAssignment = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Only teachers can create assignments' });
    }

    const { title, description, machineType, dueDate, teamIds } = req.body;
    
    if (!title || !description || !machineType || !teamIds || teamIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields (title, description, machineType, teamIds)' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        machineType,
        dueDate: dueDate ? new Date(dueDate) : null,
        teacherId: req.user.id,
        teams: {
          connect: teamIds.map(id => ({ id }))
        }
      }
    });

    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ success: false, error: 'Server error creating assignment' });
  }
};

// POST /api/assignments/:id/submit (Student only)
const submitAssignment = async (req, res) => {
  try {
    const { projectId } = req.body;
    const assignmentId = req.params.id;

    if (!projectId) {
      return res.status(400).json({ success: false, error: 'Please select a project to submit' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Check if already submitted
    const existing = await prisma.submission.findFirst({
      where: { assignmentId, studentId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already submitted this assignment' });
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: req.user.id,
        projectId,
        fileUrl
      }
    });

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, error: 'Server error submitting assignment' });
  }
};

// GET /api/assignments/:id/submissions (Teacher only)
const getSubmissions = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Only teachers can view submissions' });
    }

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: req.params.id, assignment: { teacherId: req.user.id } },
      include: {
        student: { select: { id: true, name: true, email: true } },
        project: { include: { trials: { orderBy: { trialNumber: 'desc' }, take: 1 } } }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, error: 'Server error fetching submissions' });
  }
};

// POST /api/submissions/:id/grade (Teacher only)
const gradeSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'TEACHER') {
      return res.status(403).json({ success: false, error: 'Only teachers can grade submissions' });
    }

    const { score, feedback } = req.body;
    
    // Verify submission belongs to an assignment owned by this teacher
    const submission = await prisma.submission.findFirst({
      where: { id: req.params.id, assignment: { teacherId: req.user.id } }
    });

    if (!submission) {
      return res.status(404).json({ success: false, error: 'Submission not found or unauthorized' });
    }

    const updated = await prisma.submission.update({
      where: { id: req.params.id },
      data: {
        score: parseFloat(score),
        feedback,
        status: 'GRADED',
        gradedAt: new Date()
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ success: false, error: 'Server error grading submission' });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission
};
