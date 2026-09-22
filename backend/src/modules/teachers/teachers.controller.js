const { prisma } = require('../../prisma');
const { sendSuccess, sendError } = require('../../utils/response');
const { logAuditAction } = require('../../middleware/audit');

// GET all teachers
async function getTeachers(req, res) {
  const { departmentId } = req.query;
  const where = {};
  if (departmentId) where.departmentId = String(departmentId);
  const teachers = await prisma.teacher.findMany({
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
      teachingAssignments: {
        include: {
          subject: true,
          section: {
            include: {
              semester: {
                include: {
                  batch: {
                    include: {
                      program: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      employeeId: 'asc'
    }
  });
  return sendSuccess(res, teachers);
}

// GET teacher by ID
async function getTeacherById(req, res) {
  const { id } = req.params;
  const teacher = await prisma.teacher.findUnique({
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
      teachingAssignments: {
        include: {
          subject: true,
          section: {
            include: {
              semester: {
                include: {
                  batch: {
                    include: {
                      program: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  if (!teacher) {
    return sendError(res, 'NOT_FOUND', 'Teacher not found', 404);
  }
  return sendSuccess(res, teacher);
}

// CREATE teacher or HOD (Admin & HOD)
async function createTeacher(req, res) {
  const {
    email,
    fullName,
    password = 'teacher123',
    phone,
    employeeId,
    departmentId,
    designation = 'Assistant Professor',
    qualification = 'M.Tech / Ph.D',
    role = 'TEACHER',
    headOfYear
  } = req.body;

  let resolvedDeptId = departmentId;
  if (!resolvedDeptId && req.body.departmentCode) {
    const deptMatch = await prisma.department.findFirst({
      where: { code: req.body.departmentCode }
    });
    if (deptMatch) resolvedDeptId = deptMatch.id;
  }
  if (!resolvedDeptId) {
    const firstDept = await prisma.department.findFirst();
    resolvedDeptId = firstDept ? firstDept.id : 'cdeea725-c467-4df2-b90d-beedc0624cea';
  }

  if (!email || !fullName || !employeeId) {
    return sendError(res, 'VALIDATION_ERROR', 'Email, fullName, and employeeId are required', 400);
  }
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() }
  });
  if (existingUser) {
    return sendError(res, 'CONFLICT', 'Email already in use', 409);
  }

  const assignedRole = role === 'HOD' ? 'HOD' : 'TEACHER';
  let finalDesignation = designation;
  if (assignedRole === 'HOD') {
    finalDesignation = headOfYear ? `HOD (${headOfYear}) • Professor` : 'Professor & HOD';
  }

  const teacher = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: password, // Unhashed plain text as explicitly requested
        fullName,
        phone,
        role: assignedRole
      }
    });
    return tx.teacher.create({
      data: {
        userId: user.id,
        employeeId,
        departmentId: resolvedDeptId,
        designation: finalDesignation,
        qualification
      },
      include: {
        user: true,
        department: true
      }
    });
  });

  await logAuditAction({
    userId: req.user?.id,
    action: assignedRole === 'HOD' ? 'CREATE_HOD' : 'CREATE_TEACHER',
    entityType: 'Teacher',
    entityId: teacher.id,
    details: {
      role: assignedRole,
      headOfYear: headOfYear || null,
      employeeId,
      email,
      fullName
    }
  });

  return sendSuccess(res, teacher, 'Teacher created successfully', 201);
}

// GET teacher dashboard
async function getTeacherDashboard(req, res) {
  const { id } = req.params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      teachingAssignments: {
        include: {
          subject: true,
          section: {
            include: {
              semester: {
                include: {
                  batch: {
                    include: {
                      program: true
                    }
                  }
                }
              }
            },
            _count: {
              select: { students: true }
            }
          }
        }
      }
    }
  });
  if (!teacher) {
    return sendError(res, 'NOT_FOUND', 'Teacher not found', 404);
  }

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const currentDay = days[new Date().getDay()];
  const todayClasses = await prisma.timetableEntry.findMany({
    where: {
      teacherId: id,
      dayOfWeek: currentDay
    },
    include: {
      subject: true,
      section: true
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  const activeAssignments = await prisma.assignment.findMany({
    where: { teacherId: id },
    include: {
      subject: true,
      section: true,
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  return sendSuccess(res, {
    teacher,
    assignedClasses: teacher.teachingAssignments,
    todayClasses,
    activeAssignments
  });
}

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  getTeacherDashboard
};
