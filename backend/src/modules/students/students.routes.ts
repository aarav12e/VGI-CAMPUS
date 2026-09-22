import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET all students (with filtering)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, programId, semesterId, sectionId, search } = req.query;
    const where: any = {};

    if (departmentId) where.departmentId = String(departmentId);
    if (programId) where.programId = String(programId);
    if (semesterId) where.semesterId = String(semesterId);
    if (sectionId) where.sectionId = String(sectionId);

    if (search) {
      const q = String(search);
      where.OR = [
        { enrollmentNumber: { contains: q } },
        { rollNumber: { contains: q } },
        { user: { fullName: { contains: q } } },
        { user: { email: { contains: q } } }
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, isActive: true } },
        department: true,
        program: true,
        batch: true,
        semester: true,
        section: true
      },
      orderBy: { rollNumber: 'asc' }
    });

    return sendSuccess(res, students);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET student by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Student privacy check: A student can only view their own profile unless admin/teacher
    if (req.user?.role === 'STUDENT' && req.user.studentId !== id) {
      return sendError(res, 'FORBIDDEN', 'Access denied to other student profiles', 403);
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, isActive: true } },
        department: true,
        program: true,
        batch: true,
        semester: true,
        section: true
      }
    });

    if (!student) {
      return sendError(res, 'NOT_FOUND', 'Student not found', 404);
    }

    return sendSuccess(res, student);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE new student
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const {
      email,
      fullName,
      password = 'Password@123',
      phone,
      enrollmentNumber,
      rollNumber,
      departmentId,
      programId,
      batchId,
      semesterId,
      sectionId,
      cgpa = 0.0,
      hostelRoom,
      guardianName,
      guardianPhone
    } = req.body;

    if (!email || !fullName || !enrollmentNumber || !rollNumber || !departmentId || !programId || !semesterId || !sectionId) {
      return sendError(res, 'VALIDATION_ERROR', 'Missing required student registration fields', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return sendError(res, 'CONFLICT', 'User email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash,
          fullName,
          phone,
          role: 'STUDENT'
        }
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          enrollmentNumber,
          rollNumber,
          departmentId,
          programId,
          batchId,
          semesterId,
          sectionId,
          cgpa: Number(cgpa) || 0.0,
          hostelRoom,
          guardianName,
          guardianPhone
        },
        include: {
          user: true,
          department: true,
          program: true,
          batch: true,
          semester: true,
          section: true
        }
      });

      return student;
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_STUDENT',
      entityType: 'Student',
      entityId: result.id,
      details: { enrollmentNumber, rollNumber, email, fullName }
    });

    return sendSuccess(res, result, 'Student registered successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// GET student dashboard summary (matches PRD Section 9.1)
router.get('/:id/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role === 'STUDENT' && req.user.studentId !== id) {
      return sendError(res, 'FORBIDDEN', 'Access denied', 403);
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        program: true,
        batch: true,
        semester: true,
        section: true
      }
    });

    if (!student) {
      return sendError(res, 'NOT_FOUND', 'Student not found', 404);
    }

    // Attendance stats
    const records = await prisma.attendanceRecord.findMany({
      where: { studentId: id }
    });
    const totalSessions = records.length;
    const totalPresent = records.filter(r => r.isPresent).length;
    const attendancePercentage = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 100;

    // Timetable for today
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDay = days[new Date().getDay()];

    const todayClasses = await prisma.timetableEntry.findMany({
      where: {
        sectionId: student.sectionId,
        dayOfWeek: currentDay
      },
      include: {
        subject: true,
        teacher: { include: { user: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    // Pending assignments
    const assignments = await prisma.assignment.findMany({
      where: { sectionId: student.sectionId, isPublished: true },
      include: {
        subject: true,
        submissions: { where: { studentId: id } }
      },
      orderBy: { dueDate: 'asc' },
      take: 5
    });

    const pendingAssignments = assignments.map(a => ({
      id: a.id,
      title: a.title,
      subjectName: a.subject.name,
      dueDate: a.dueDate,
      isSubmitted: a.submissions.length > 0
    }));

    // Latest notices
    const latestNotices = await prisma.notice.findMany({
      where: {
        OR: [
          { targetAudience: 'ALL' },
          { targetAudience: 'STUDENTS' },
          { departmentId: student.departmentId }
        ]
      },
      orderBy: { publishDate: 'desc' },
      take: 3
    });

    // Upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { date: 'asc' },
      take: 2
    });

    return sendSuccess(res, {
      student,
      attendancePercentage,
      totalSessions,
      totalPresent,
      isAttendanceWarning: attendancePercentage < 75,
      todayClasses,
      nextClass: todayClasses[0] || null,
      pendingAssignments,
      latestNotices,
      upcomingEvents
    });
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

export default router;
