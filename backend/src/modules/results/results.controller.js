const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// GET results for a student
async function getStudentResults(req, res) {
  const { studentId } = req.params;
  if (req.user?.role === 'STUDENT' && req.user.studentId !== studentId) {
    return sendError(res, 'FORBIDDEN', 'Access denied to other student results', 403);
  }
  const results = await prisma.result.findMany({
    where: {
      studentId,
      isPublished: true
    },
    include: {
      semester: true,
      items: {
        include: {
          subject: true
        }
      }
    },
    orderBy: {
      semester: {
        number: 'desc'
      }
    }
  });
  return sendSuccess(res, results);
}

// GET all results (for Admin/Staff overview)
async function getAllResults(req, res) {
  const { semesterId } = req.query;
  const where = {};
  if (semesterId) where.semesterId = String(semesterId);
  const results = await prisma.result.findMany({
    where,
    include: {
      student: {
        include: {
          user: true,
          program: true
        }
      },
      semester: true,
      items: {
        include: {
          subject: true
        }
      }
    }
  });
  return sendSuccess(res, results);
}

// CREATE / RECORD RESULT (Admin or Authorized Faculty)
async function createResult(req, res) {
  const {
    studentId,
    semesterId,
    sgpa,
    cgpa,
    status = 'PASSED',
    items
  } = req.body;

  if (!studentId || !semesterId || !Array.isArray(items)) {
    return sendError(res, 'VALIDATION_ERROR', 'studentId, semesterId, and items array are required', 400);
  }

  const result = await prisma.$transaction(async tx => {
    // Upsert result header
    const resHeader = await tx.result.upsert({
      where: {
        studentId_semesterId: {
          studentId,
          semesterId
        }
      },
      update: {
        sgpa: Number(sgpa) || 0.0,
        cgpa: Number(cgpa) || 0.0,
        status,
        isPublished: true
      },
      create: {
        studentId,
        semesterId,
        sgpa: Number(sgpa) || 0.0,
        cgpa: Number(cgpa) || 0.0,
        status,
        isPublished: true
      }
    });

    // Clear previous items if re-entering
    await tx.resultItem.deleteMany({
      where: {
        resultId: resHeader.id
      }
    });

    // Create items
    for (const item of items) {
      await tx.resultItem.create({
        data: {
          resultId: resHeader.id,
          subjectId: item.subjectId,
          internalMarks: Number(item.internalMarks) || 0,
          externalMarks: Number(item.externalMarks) || 0,
          totalMarks: (Number(item.internalMarks) || 0) + (Number(item.externalMarks) || 0),
          grade: item.grade || 'A',
          gradePoints: Number(item.gradePoints) || 8.0
        }
      });
    }

    // Update student's cumulative CGPA
    await tx.student.update({
      where: { id: studentId },
      data: {
        cgpa: Number(cgpa) || Number(sgpa) || 0.0
      }
    });

    return tx.result.findUnique({
      where: { id: resHeader.id },
      include: {
        items: {
          include: {
            subject: true
          }
        }
      }
    });
  });

  await logAuditAction({
    userId: req.user?.id,
    action: 'PUBLISH_RESULT',
    entityType: 'Result',
    entityId: result?.id,
    details: {
      studentId,
      semesterId,
      sgpa,
      cgpa
    }
  });

  return sendSuccess(res, result, 'Result published successfully', 201);
}

module.exports = {
  getStudentResults,
  getAllResults,
  createResult
};
