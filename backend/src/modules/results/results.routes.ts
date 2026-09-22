import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET results for a student
router.get('/student/:studentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
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
      orderBy: { semester: { number: 'desc' } }
    });

    return sendSuccess(res, results);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET all results (for Admin/Staff overview)
router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER', 'HOD']), async (req: AuthRequest, res: Response) => {
  try {
    const { semesterId } = req.query;
    const where: any = {};
    if (semesterId) where.semesterId = String(semesterId);

    const results = await prisma.result.findMany({
      where,
      include: {
        student: { include: { user: true, program: true } },
        semester: true,
        items: { include: { subject: true } }
      }
    });

    return sendSuccess(res, results);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE / RECORD RESULT (Admin or Authorized Faculty)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, semesterId, sgpa, cgpa, status = 'PASSED', items } = req.body;

    if (!studentId || !semesterId || !Array.isArray(items)) {
      return sendError(res, 'VALIDATION_ERROR', 'studentId, semesterId, and items array are required', 400);
    }

    const result = await prisma.$transaction(async (tx) => {
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
      await tx.resultItem.deleteMany({ where: { resultId: resHeader.id } });

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
        data: { cgpa: Number(cgpa) || Number(sgpa) || 0.0 }
      });

      return tx.result.findUnique({
        where: { id: resHeader.id },
        include: { items: { include: { subject: true } } }
      });
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'PUBLISH_RESULT',
      entityType: 'Result',
      entityId: result?.id,
      details: { studentId, semesterId, sgpa, cgpa }
    });

    return sendSuccess(res, result, 'Result published successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
