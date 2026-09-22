import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { action, entityType } = req.query;
    const where: any = {};
    if (action) where.action = String(action);
    if (entityType) where.entityType = String(entityType);

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return sendSuccess(res, logs);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

export default router;
