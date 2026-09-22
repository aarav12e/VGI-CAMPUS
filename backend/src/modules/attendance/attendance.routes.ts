import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET student attendance overview (Calculates overall % and subject-wise %)
router.get('/student/:studentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;

    if (req.user?.role === 'STUDENT' && req.user.studentId !== studentId) {
      return sendError(res, 'FORBIDDEN', 'Access denied to other student attendance', 403);
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        semester: true,
        program: true
      }
    });

    if (!student) {
      return sendError(res, 'NOT_FOUND', 'Student not found', 404);
    }

    // Fetch all attendance records for this student
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        session: {
          include: {
            subject: true,
            teacher: { include: { user: true } }
          }
        }
      },
      orderBy: { session: { date: 'desc' } }
    });

    const totalSessions = records.length;
    const totalPresent = records.filter(r => r.isPresent).length;
    const totalAbsent = totalSessions - totalPresent;
    const overallPercentage = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 100;

    // Subject-wise grouping
    const subjectMap = new Map<string, {
      subjectId: string;
      subjectCode: string;
      subjectName: string;
      total: number;
      present: number;
    }>();

    for (const r of records) {
      const sub = r.session.subject;
      if (!subjectMap.has(sub.id)) {
        subjectMap.set(sub.id, {
          subjectId: sub.id,
          subjectCode: sub.code,
          subjectName: sub.name,
          total: 0,
          present: 0
        });
      }
      const entry = subjectMap.get(sub.id)!;
      entry.total += 1;
      if (r.isPresent) entry.present += 1;
    }

    const subjectWise = Array.from(subjectMap.values()).map(s => ({
      subjectId: s.subjectId,
      subjectCode: s.subjectCode,
      subjectName: s.subjectName,
      totalSessions: s.total,
      presentSessions: s.present,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 100,
      isWarning: s.total > 0 && Math.round((s.present / s.total) * 100) < 75
    }));

    return sendSuccess(res, {
      overallPercentage,
      totalSessions,
      totalPresent,
      totalAbsent,
      isWarning: overallPercentage < 75,
      subjectWise,
      recentHistory: records.slice(0, 15).map(r => ({
        id: r.id,
        date: r.session.date,
        subjectName: r.session.subject.name,
        subjectCode: r.session.subject.code,
        teacherName: r.session.teacher.user.fullName,
        isPresent: r.isPresent,
        remarks: r.remarks
      }))
    });
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET attendance sessions list (with optional filters)
router.get('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, subjectId, teacherId, date } = req.query;
    const where: any = {};
    if (sectionId) where.sectionId = String(sectionId);
    if (subjectId) where.subjectId = String(subjectId);
    if (teacherId) where.teacherId = String(teacherId);
    if (date) where.date = String(date);

    const sessions = await prisma.attendanceSession.findMany({
      where,
      include: {
        subject: true,
        teacher: { include: { user: true } },
        section: true,
        records: { include: { student: { include: { user: true } } } }
      },
      orderBy: { date: 'desc' }
    });

    return sendSuccess(res, sessions);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE Attendance Session & Records (Teacher marks attendance)
router.post('/sessions', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { subjectId, sectionId, date, topic, records } = req.body;
    // records: Array<{ studentId: string, isPresent: boolean, remarks?: string }>

    if (!subjectId || !sectionId || !date || !Array.isArray(records)) {
      return sendError(res, 'VALIDATION_ERROR', 'subjectId, sectionId, date, and records array are required', 400);
    }

    let teacherId = req.user?.teacherId;
    if (!teacherId && (req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN')) {
      const assignment = await prisma.teachingAssignment.findFirst({
        where: { subjectId, sectionId }
      });
      if (assignment) {
        teacherId = assignment.teacherId;
      } else {
        const anyTeacher = await prisma.teacher.findFirst();
        teacherId = anyTeacher?.id;
      }
    }

    if (!teacherId) {
      return sendError(res, 'FORBIDDEN', 'No valid teacher found for this session', 403);
    }

    const session = await prisma.$transaction(async (tx) => {
      const newSession = await tx.attendanceSession.create({
        data: {
          subjectId,
          sectionId,
          teacherId,
          date,
          topic: topic || 'Regular Lecture',
          records: {
            create: records.map((r: any) => ({
              studentId: r.studentId,
              isPresent: Boolean(r.isPresent),
              remarks: r.remarks || null
            }))
          }
        },
        include: {
          subject: true,
          section: true,
          records: true
        }
      });
      return newSession;
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'SUBMIT_ATTENDANCE',
      entityType: 'AttendanceSession',
      entityId: session.id,
      details: {
        subjectId,
        sectionId,
        date,
        totalMarked: records.length,
        presentCount: records.filter((r: any) => r.isPresent).length
      }
    });

    return sendSuccess(res, session, 'Attendance marked successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
