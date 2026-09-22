import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { teacherId, sectionId, subjectId } = req.query;
    const where: any = {};
    if (teacherId) where.teacherId = String(teacherId);
    if (sectionId) where.sectionId = String(sectionId);
    if (subjectId) where.subjectId = String(subjectId);

    const assignments = await prisma.teachingAssignment.findMany({
      where,
      include: {
        teacher: { include: { user: true, department: true } },
        subject: { include: { program: true } },
        section: {
          include: {
            semester: {
              include: {
                batch: { include: { program: true } }
              }
            }
          }
        }
      }
    });

    return sendSuccess(res, assignments);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
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
        teacher: { include: { user: true } },
        subject: true,
        section: true
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'ASSIGN_TEACHER',
      entityType: 'TeachingAssignment',
      entityId: assignment.id,
      details: { teacherId, subjectId, sectionId }
    });

    return sendSuccess(res, assignment, 'Teacher assigned successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.teachingAssignment.delete({ where: { id } });
    await logAuditAction({
      userId: req.user?.id,
      action: 'REMOVE_TEACHER_ASSIGNMENT',
      entityType: 'TeachingAssignment',
      entityId: id
    });
    return sendSuccess(res, null, 'Assignment removed successfully');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
