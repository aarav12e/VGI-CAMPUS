const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// GET all students (with filtering)
async function getStudents(req, res) {
  const { departmentId, programId, semesterId, sectionId, search } = req.query;
  const where = {};
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
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatarUrl: true,
          isActive: true
        }
      },
      department: true,
      program: true,
      batch: true,
      semester: true,
      section: true
    },
    orderBy: { rollNumber: 'asc' }
  });
  return sendSuccess(res, students);
}

// GET student by ID
async function getStudentById(req, res) {
  const { id } = req.params;
  if (req.user?.role === 'STUDENT' && req.user.studentId !== id) {
    return sendError(res, 'FORBIDDEN', 'Access denied to other student profiles', 403);
  }
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatarUrl: true,
          isActive: true
        }
      },
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
}

// CREATE new student
async function createStudent(req, res) {
  const {
    email,
    fullName,
    password = 'student123',
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

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });
  if (existingUser) {
    return sendError(res, 'CONFLICT', 'User email already exists', 409);
  }

  // Auto-resolve batchId from semester if omitted
  let effectiveBatchId = batchId;
  if (!effectiveBatchId) {
    const sem = await prisma.semester.findUnique({ where: { id: semesterId } });
    effectiveBatchId = sem?.batchId;
  }
  if (!effectiveBatchId) {
    const anyBatch = await prisma.batch.findFirst({ where: { programId } });
    effectiveBatchId = anyBatch?.id;
  }

  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: password, // Plain-text unhashed as requested
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
        batchId: effectiveBatchId,
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
    details: {
      enrollmentNumber,
      rollNumber,
      email,
      fullName
    }
  });

  return sendSuccess(res, result, 'Student registered successfully', 201);
}

// GET student dashboard summary
async function getStudentDashboard(req, res) {
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
  const attendancePercentage = totalSessions > 0 ? Math.round(totalPresent / totalSessions * 100) : 100;

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
      teacher: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // Pending assignments
  const assignments = await prisma.assignment.findMany({
    where: {
      sectionId: student.sectionId,
      isPublished: true
    },
    include: {
      subject: true,
      submissions: {
        where: { studentId: id }
      }
    },
    orderBy: {
      dueDate: 'asc'
    },
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
    orderBy: {
      publishDate: 'desc'
    },
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
}

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  getStudentDashboard
};
