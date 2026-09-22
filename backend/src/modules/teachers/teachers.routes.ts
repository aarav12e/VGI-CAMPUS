import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET all teachers
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId } = req.query;
    const where: any = {};
    if (departmentId) where.departmentId = String(departmentId);

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, isActive: true } },
        department: true,
        teachingAssignments: {
          include: {
            subject: true,
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
        }
      },
      orderBy: { employeeId: 'asc' }
    });

    return sendSuccess(res, teachers);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET teacher by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, isActive: true } },
        department: true,
        teachingAssignments: {
          include: {
            subject: true,
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
        }
      }
    });

    if (!teacher) {
      return sendError(res, 'NOT_FOUND', 'Teacher not found', 404);
    }

    return sendSuccess(res, teacher);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE teacher
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const {
      email,
      fullName,
      password = 'Password@123',
      phone,
      employeeId,
      departmentId,
      designation = 'Assistant Professor',
      qualification = 'M.Tech / Ph.D'
    } = req.body;

    if (!email || !fullName || !employeeId || !departmentId) {
      return sendError(res, 'VALIDATION_ERROR', 'Email, fullName, employeeId, and departmentId are required', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return sendError(res, 'CONFLICT', 'Email already in use', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash,
          fullName,
          phone,
          role: 'TEACHER'
        }
      });

      return tx.teacher.create({
        data: {
          userId: user.id,
          employeeId,
          departmentId,
          designation,
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
      action: 'CREATE_TEACHER',
      entityType: 'Teacher',
      entityId: teacher.id,
      details: { employeeId, email, fullName }
    });

    return sendSuccess(res, teacher, 'Teacher created successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// GET teacher dashboard
router.get('/:id/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
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
                    batch: { include: { program: true } }
                  }
                },
                _count: { select: { students: true } }
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
      where: { teacherId: id, dayOfWeek: currentDay },
      include: {
        subject: true,
        section: true
      },
      orderBy: { startTime: 'asc' }
    });

    const activeAssignments = await prisma.assignment.findMany({
      where: { teacherId: id },
      include: {
        subject: true,
        section: true,
        _count: { select: { submissions: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return sendSuccess(res, {
      teacher,
      assignedClasses: teacher.teachingAssignments,
      todayClasses,
      activeAssignments
    });
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

export default router;
