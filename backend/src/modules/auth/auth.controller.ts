import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma';
import { signToken } from '../../utils/jwt';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'VALIDATION_ERROR', 'Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        student: {
          include: {
            department: true,
            program: true,
            batch: true,
            semester: true,
            section: true
          }
        },
        teacher: {
          include: {
            department: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      studentId: user.student?.id,
      teacherId: user.teacher?.id
    };

    const token = signToken(tokenPayload);

    await logAuditAction({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ipAddress: req.ip
    });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        student: user.student,
        teacher: user.teacher
      }
    }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    return sendError(res, 'SERVER_ERROR', error.message || 'Internal server error', 500);
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        student: {
          include: {
            department: true,
            program: true,
            batch: true,
            semester: true,
            section: true
          }
        },
        teacher: {
          include: {
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
        }
      }
    });

    if (!user) {
      return sendError(res, 'NOT_FOUND', 'User not found', 404);
    }

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      student: user.student,
      teacher: user.teacher
    }, 'Current user profile retrieved');
  } catch (error: any) {
    console.error('getMe error:', error);
    return sendError(res, 'SERVER_ERROR', error.message || 'Internal server error', 500);
  }
}
