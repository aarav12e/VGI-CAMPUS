import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET all events
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.studentId;

    const events = await prisma.event.findMany({
      where: { isPublished: true },
      include: {
        registrations: studentId ? { where: { studentId } } : false,
        _count: { select: { registrations: true } }
      },
      orderBy: { date: 'asc' }
    });

    const formatted = events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      venue: e.venue,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      maxParticipants: e.maxParticipants,
      posterUrl: e.posterUrl,
      registeredCount: e._count.registrations,
      isRegistered: Array.isArray(e.registrations) ? e.registrations.length > 0 : false
    }));

    return sendSuccess(res, formatted);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE event
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, venue, date, startTime, endTime, maxParticipants, posterUrl } = req.body;

    if (!title || !venue || !date || !startTime || !endTime) {
      return sendError(res, 'VALIDATION_ERROR', 'Title, venue, date, and times are required', 400);
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        category: category || 'CAMPUS',
        venue,
        date,
        startTime,
        endTime,
        maxParticipants: maxParticipants ? Number(maxParticipants) : null,
        posterUrl
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_EVENT',
      entityType: 'Event',
      entityId: event.id,
      details: { title, venue, date }
    });

    return sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// REGISTER for event (Student)
router.post('/:id/register', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.studentId;

    if (!studentId) {
      return sendError(res, 'FORBIDDEN', 'Student profile required', 403);
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) {
      return sendError(res, 'NOT_FOUND', 'Event not found', 404);
    }

    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return sendError(res, 'CAPACITY_FULL', 'Event is fully booked', 400);
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        studentId
      }
    });

    return sendSuccess(res, registration, 'Registered for event successfully');
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'ALREADY_REGISTERED', 'You are already registered for this event', 409);
    }
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// CANCEL event registration
router.delete('/:id/register', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.studentId;

    if (!studentId) {
      return sendError(res, 'FORBIDDEN', 'Student profile required', 403);
    }

    await prisma.eventRegistration.delete({
      where: {
        eventId_studentId: {
          eventId: id,
          studentId
        }
      }
    });

    return sendSuccess(res, null, 'Registration cancelled successfully');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
