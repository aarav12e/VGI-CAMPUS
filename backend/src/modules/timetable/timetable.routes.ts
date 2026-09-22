import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// Helper to check for timetable conflicts
async function checkConflicts(params: {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  roomName: string;
  sectionId: string;
  excludeId?: string;
}) {
  const { dayOfWeek, startTime, endTime, teacherId, roomName, sectionId, excludeId } = params;

  // Find overlapping slots on the same day
  const candidateSlots = await prisma.timetableEntry.findMany({
    where: {
      dayOfWeek,
      id: excludeId ? { not: excludeId } : undefined
    },
    include: {
      teacher: { include: { user: true } },
      subject: true,
      section: true
    }
  });

  // Time overlap check: start1 < end2 && start2 < end1
  const overlaps = candidateSlots.filter(slot => {
    return startTime < slot.endTime && slot.startTime < endTime;
  });

  for (const slot of overlaps) {
    if (slot.teacherId === teacherId) {
      return {
        hasConflict: true,
        type: 'TEACHER_CONFLICT',
        message: `Teacher ${slot.teacher.user.fullName} is already booked in section ${slot.section.name} for ${slot.subject.name} from ${slot.startTime} to ${slot.endTime}`
      };
    }
    if (slot.roomName.toLowerCase().trim() === roomName.toLowerCase().trim()) {
      return {
        hasConflict: true,
        type: 'ROOM_CONFLICT',
        message: `Room ${roomName} is already occupied by ${slot.section.name} (${slot.subject.name}) from ${slot.startTime} to ${slot.endTime}`
      };
    }
    if (slot.sectionId === sectionId) {
      return {
        hasConflict: true,
        type: 'SECTION_CONFLICT',
        message: `Section ${slot.section.name} already has a class scheduled (${slot.subject.name}) from ${slot.startTime} to ${slot.endTime}`
      };
    }
  }

  return { hasConflict: false };
}

// GET timetable
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, teacherId, dayOfWeek } = req.query;
    const where: any = {};

    if (sectionId) where.sectionId = String(sectionId);
    if (teacherId) where.teacherId = String(teacherId);
    if (dayOfWeek) where.dayOfWeek = String(dayOfWeek).toUpperCase();

    // If student request without sectionId, use student's enrolled section
    if (req.user?.role === 'STUDENT' && !sectionId) {
      const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
      if (student) {
        where.sectionId = student.sectionId;
      }
    }

    const timetable = await prisma.timetableEntry.findMany({
      where,
      include: {
        subject: true,
        teacher: { include: { user: true, department: true } },
        section: {
          include: {
            semester: {
              include: {
                batch: { include: { program: true } }
              }
            }
          }
        }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return sendSuccess(res, timetable);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE timetable entry (with conflict detection)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { dayOfWeek, startTime, endTime, subjectId, teacherId, sectionId, roomName } = req.body;

    if (!dayOfWeek || !startTime || !endTime || !subjectId || !teacherId || !sectionId || !roomName) {
      return sendError(res, 'VALIDATION_ERROR', 'All timetable fields are required', 400);
    }

    const conflict = await checkConflicts({
      dayOfWeek: dayOfWeek.toUpperCase(),
      startTime,
      endTime,
      teacherId,
      roomName,
      sectionId
    });

    if (conflict.hasConflict) {
      return sendError(res, conflict.type || 'CONFLICT', conflict.message || 'Timetable conflict detected', 409);
    }

    const entry = await prisma.timetableEntry.create({
      data: {
        dayOfWeek: dayOfWeek.toUpperCase(),
        startTime,
        endTime,
        subjectId,
        teacherId,
        sectionId,
        roomName
      },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        section: true
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_TIMETABLE_ENTRY',
      entityType: 'TimetableEntry',
      entityId: entry.id,
      details: { dayOfWeek, startTime, endTime, roomName, subjectId }
    });

    return sendSuccess(res, entry, 'Timetable entry created successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// DELETE timetable entry
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.timetableEntry.delete({ where: { id } });
    await logAuditAction({
      userId: req.user?.id,
      action: 'DELETE_TIMETABLE_ENTRY',
      entityType: 'TimetableEntry',
      entityId: id
    });
    return sendSuccess(res, null, 'Timetable entry deleted');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
