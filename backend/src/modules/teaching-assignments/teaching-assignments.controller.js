const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// GET all teaching assignments
async function getTeachingAssignments(req, res) {
  const { teacherId, sectionId, subjectId } = req.query;
  const where = {};
  if (teacherId) where.teacherId = String(teacherId);
  if (sectionId) where.sectionId = String(sectionId);
  if (subjectId) where.subjectId = String(subjectId);

  const assignments = await prisma.teachingAssignment.findMany({
    where,
    include: {
      teacher: {
        include: {
          user: true,
          department: true
        }
      },
      subject: {
        include: {
          program: true
        }
      },
      section: {
        include: {
          semester: {
            include: {
              batch: {
                include: {
                  program: true
                }
              }
            }
          }
        }
      }
    }
  });
  return sendSuccess(res, assignments);
}

// CREATE teaching assignment
async function createTeachingAssignment(req, res) {
  const { teacherId, subjectId, sectionId } = req.body;
  if (!teacherId || !subjectId || !sectionId) {
    return sendError(res, 'VALIDATION_ERROR', 'teacherId, subjectId, and sectionId are required', 400);
  }

  // Check if already assigned
  const existing = await prisma.teachingAssignment.findUnique({
    where: {
      teacherId_subjectId_sectionId: {
        teacherId,
        subjectId,
        sectionId
      }
    }
  });
  if (existing) {
    return sendError(res, 'CONFLICT', 'Teaching assignment already exists for this teacher, subject, and section', 409);
  }

  const assignment = await prisma.teachingAssignment.create({
    data: {
      teacherId,
      subjectId,
      sectionId
    },
    include: {
      teacher: {
        include: {
          user: true
        }
      },
      subject: true,
      section: true
    }
  });

  await logAuditAction({
    userId: req.user?.id,
    action: 'ASSIGN_TEACHER',
    entityType: 'TeachingAssignment',
    entityId: assignment.id,
    details: {
      teacherId,
      subjectId,
      sectionId
    }
  });

  return sendSuccess(res, assignment, 'Teacher assigned successfully', 201);
}

// DELETE teaching assignment
async function deleteTeachingAssignment(req, res) {
  const { id } = req.params;
  await prisma.teachingAssignment.delete({
    where: { id }
  });
  await logAuditAction({
    userId: req.user?.id,
    action: 'REMOVE_TEACHER_ASSIGNMENT',
    entityType: 'TeachingAssignment',
    entityId: id
  });
  return sendSuccess(res, null, 'Assignment removed successfully');
}

module.exports = {
  getTeachingAssignments,
  createTeachingAssignment,
  deleteTeachingAssignment
};
