import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET notices (filtered by user role and department)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { category, priority } = req.query;
    const where: any = {};

    if (category) where.category = String(category);
    if (priority) where.priority = String(priority);

    // Audience filtering based on user role
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      where.OR = [
        { targetAudience: 'ALL' },
        { targetAudience: 'STUDENTS' },
        ...(student ? [{ departmentId: student.departmentId }] : [])
      ];
    } else if (req.user?.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });
      where.OR = [
        { targetAudience: 'ALL' },
        { targetAudience: 'TEACHERS' },
        ...(teacher ? [{ departmentId: teacher.departmentId }] : [])
      ];
    }

    const notices = await prisma.notice.findMany({
      where,
      include: {
        author: { select: { id: true, fullName: true, role: true } }
      },
      orderBy: { publishDate: 'desc' }
    });

    return sendSuccess(res, notices);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE notice
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD', 'TEACHER']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category = 'GENERAL', priority = 'MEDIUM', targetAudience = 'ALL', departmentId, attachmentUrl } = req.body;

    if (!title || !content) {
      return sendError(res, 'VALIDATION_ERROR', 'Title and content are required', 400);
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category,
        priority,
        targetAudience,
        departmentId: departmentId || null,
        attachmentUrl,
        authorId: req.user!.id
      },
      include: {
        author: { select: { id: true, fullName: true, role: true } }
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_NOTICE',
      entityType: 'Notice',
      entityId: notice.id,
      details: { title, category, priority, targetAudience }
    });

    return sendSuccess(res, notice, 'Notice published successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// DELETE notice
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    await logAuditAction({
      userId: req.user?.id,
      action: 'DELETE_NOTICE',
      entityType: 'Notice',
      entityId: id
    });
    return sendSuccess(res, null, 'Notice deleted successfully');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
