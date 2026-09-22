import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// GET assignments
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, subjectId, teacherId } = req.query;
    const where: any = { isPublished: true };

    if (sectionId) where.sectionId = String(sectionId);
    if (subjectId) where.subjectId = String(subjectId);
    if (teacherId) where.teacherId = String(teacherId);

    // If student, get assignments for student's section including their submission status
    if (req.user?.role === 'STUDENT' && req.user.studentId) {
      const student = await prisma.student.findUnique({ where: { id: req.user.studentId } });
      if (student) {
        where.sectionId = student.sectionId;
      }
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        subject: true,
        teacher: { include: { user: true } },
        section: true,
        submissions: req.user?.studentId
          ? { where: { studentId: req.user.studentId } }
          : { include: { student: { include: { user: true } } } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    const formatted = assignments.map(a => {
      const studentSub = req.user?.studentId && a.submissions.length > 0 ? a.submissions[0] : null;
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        subject: a.subject,
        teacher: a.teacher,
        section: a.section,
        dueDate: a.dueDate,
        maxMarks: a.maxMarks,
        attachmentUrl: a.attachmentUrl,
        submissionCount: a._count.submissions,
        mySubmission: studentSub
          ? {
              status: studentSub.status,
              marks: studentSub.marks,
              feedback: studentSub.feedback,
              submittedAt: studentSub.submittedAt,
              fileUrl: studentSub.fileUrl
            }
          : null
      };
    });

    return sendSuccess(res, formatted);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// GET single assignment details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        section: { include: { students: { include: { user: true } } } },
        submissions: {
          include: {
            student: { include: { user: true } }
          }
        }
      }
    });

    if (!assignment) {
      return sendError(res, 'NOT_FOUND', 'Assignment not found', 404);
    }

    return sendSuccess(res, assignment);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// CREATE assignment (Teacher or Admin)
router.post('/', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subjectId, sectionId, dueDate, maxMarks, attachmentUrl } = req.body;

    if (!title || !subjectId || !sectionId || !dueDate) {
      return sendError(res, 'VALIDATION_ERROR', 'Title, subjectId, sectionId, and dueDate are required', 400);
    }

    let teacherId = req.user?.teacherId;
    if (!teacherId) {
      const assignment = await prisma.teachingAssignment.findFirst({
        where: { subjectId, sectionId }
      });
      teacherId = assignment?.teacherId;
    }

    if (!teacherId) {
      const anyTeacher = await prisma.teacher.findFirst();
      teacherId = anyTeacher?.id;
    }

    if (!teacherId) {
      return sendError(res, 'FORBIDDEN', 'Teacher could not be determined', 403);
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || '',
        subjectId,
        sectionId,
        teacherId,
        dueDate,
        maxMarks: Number(maxMarks) || 100,
        attachmentUrl
      },
      include: {
        subject: true,
        section: true
      }
    });

    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_ASSIGNMENT',
      entityType: 'Assignment',
      entityId: newAssignment.id,
      details: { title, subjectId, sectionId, dueDate }
    });

    return sendSuccess(res, newAssignment, 'Assignment created successfully', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// SUBMIT assignment (Student)
router.post('/:id/submit', authenticate, requireRole(['STUDENT']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, fileUrl } = req.body;
    const studentId = req.user?.studentId;

    if (!studentId) {
      return sendError(res, 'FORBIDDEN', 'Student profile missing', 403);
    }

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      return sendError(res, 'NOT_FOUND', 'Assignment not found', 404);
    }

    const now = new Date();
    const isLate = new Date(assignment.dueDate) < now;

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: id,
          studentId
        }
      },
      update: {
        content,
        fileUrl: fileUrl || 'https://vgi.ac.in/uploads/assignments/submission_doc.pdf',
        submittedAt: now,
        status: isLate ? 'LATE' : 'SUBMITTED'
      },
      create: {
        assignmentId: id,
        studentId,
        content,
        fileUrl: fileUrl || 'https://vgi.ac.in/uploads/assignments/submission_doc.pdf',
        status: isLate ? 'LATE' : 'SUBMITTED'
      }
    });

    return sendSuccess(res, submission, 'Assignment submitted successfully');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// GRADE submission (Teacher or Admin)
router.post('/submissions/:submissionId/grade', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marks: Number(marks),
        feedback,
        status: 'GRADED'
      }
    });

    return sendSuccess(res, submission, 'Submission graded successfully');
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
