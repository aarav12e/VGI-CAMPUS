import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// ------------------------------------------------
// HOSTEL & COMPLAINTS
// ------------------------------------------------

// GET hostel rooms
router.get('/hostel/rooms', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await prisma.hostelRoom.findMany({
      orderBy: [{ hostelName: 'asc' }, { roomNumber: 'asc' }]
    });
    return sendSuccess(res, rooms);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET hostel complaints
router.get('/hostel/complaints', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const where: any = {};
    if (req.user?.role === 'STUDENT') {
      where.studentId = req.user.studentId;
    }

    const complaints = await prisma.hostelComplaint.findMany({
      where,
      include: {
        student: { include: { user: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, complaints);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE hostel complaint (Student)
router.post('/hostel/complaints', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const { roomNumber, category, description } = req.body;
    const studentId = req.user?.studentId;

    if (!studentId || !roomNumber || !category || !description) {
      return sendError(res, 'VALIDATION_ERROR', 'All complaint fields are required', 400);
    }

    const complaint = await prisma.hostelComplaint.create({
      data: {
        studentId,
        roomNumber,
        category,
        description,
        status: 'PENDING'
      }
    });

    return sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// UPDATE hostel complaint status (Staff or Admin)
router.patch('/hostel/complaints/:id/status', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOSTEL_STAFF']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await prisma.hostelComplaint.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'UPDATE_COMPLAINT_STATUS',
      entityType: 'HostelComplaint',
      entityId: id,
      details: { status }
    });

    return sendSuccess(res, complaint, 'Complaint status updated');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// ------------------------------------------------
// MESS MENU
// ------------------------------------------------

router.get('/mess/menu', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const menu = await prisma.messMenu.findMany();
    return sendSuccess(res, menu);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/mess/menu', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOSTEL_STAFF']), async (req: AuthRequest, res: Response) => {
  try {
    const { dayOfWeek, breakfast, lunch, dinner, specialMeal } = req.body;
    const menu = await prisma.messMenu.upsert({
      where: { dayOfWeek: dayOfWeek.toUpperCase() },
      update: { breakfast, lunch, dinner, specialMeal },
      create: { dayOfWeek: dayOfWeek.toUpperCase(), breakfast, lunch, dinner, specialMeal }
    });
    return sendSuccess(res, menu, 'Mess menu updated');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// ------------------------------------------------
// LIBRARY
// ------------------------------------------------

router.get('/library/books', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { search, category } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (search) {
      const q = String(search);
      where.OR = [
        { title: { contains: q } },
        { author: { contains: q } },
        { isbn: { contains: q } }
      ];
    }

    const books = await prisma.libraryBook.findMany({ where, orderBy: { title: 'asc' } });
    return sendSuccess(res, books);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.get('/library/my-books', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.studentId;
    if (!studentId) return sendError(res, 'FORBIDDEN', 'Student profile required', 403);

    const txs = await prisma.libraryTransaction.findMany({
      where: { studentId },
      include: { book: true },
      orderBy: { issuedAt: 'desc' }
    });
    return sendSuccess(res, txs);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// ------------------------------------------------
// FEES
// ------------------------------------------------

router.get('/fees/my-fee', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.studentId;
    if (!studentId) return sendError(res, 'FORBIDDEN', 'Student profile required', 403);

    const fee = await prisma.studentFee.findFirst({
      where: { studentId },
      orderBy: { updatedAt: 'desc' }
    });
    return sendSuccess(res, fee);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

export default router;
