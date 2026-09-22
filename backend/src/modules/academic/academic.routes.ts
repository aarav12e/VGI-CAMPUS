import { Router, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, requireRole, AuthRequest } from '../../middleware/auth';
import { logAuditAction } from '../../middleware/audit';

const router = Router();

// Departments
router.get('/departments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        programs: true,
        _count: { select: { teachers: true, students: true } }
      }
    });
    return sendSuccess(res, departments);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/departments', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, description } = req.body;
    const dept = await prisma.department.create({
      data: { code, name, description }
    });
    await logAuditAction({
      userId: req.user?.id,
      action: 'CREATE_DEPARTMENT',
      entityType: 'Department',
      entityId: dept.id,
      details: { code, name }
    });
    return sendSuccess(res, dept, 'Department created', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// Programs
router.get('/programs', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      include: {
        department: true,
        batches: { include: { semesters: { include: { sections: true } } } },
        _count: { select: { subjects: true, students: true } }
      }
    });
    return sendSuccess(res, programs);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/programs', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, durationYears, departmentId } = req.body;
    const program = await prisma.program.create({
      data: { code, name, durationYears: Number(durationYears) || 4, departmentId }
    });
    return sendSuccess(res, program, 'Program created', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// Academic Years
router.get('/academic-years', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const years = await prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' }
    });
    return sendSuccess(res, years);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/academic-years', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;
    if (isCurrent) {
      await prisma.academicYear.updateMany({ data: { isCurrent: false } });
    }
    const year = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: Boolean(isCurrent)
      }
    });
    return sendSuccess(res, year, 'Academic year created', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// Batches
router.get('/batches', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        program: true,
        semesters: { include: { sections: true } },
        _count: { select: { students: true } }
      }
    });
    return sendSuccess(res, batches);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/batches', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, programId, startYear, endYear } = req.body;
    const batch = await prisma.batch.create({
      data: {
        name,
        programId,
        startYear: Number(startYear),
        endYear: Number(endYear)
      }
    });
    return sendSuccess(res, batch, 'Batch created', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

// Semesters
router.get('/semesters', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const semesters = await prisma.semester.findMany({
      include: {
        batch: { include: { program: true } },
        academicYear: true,
        sections: true
      }
    });
    return sendSuccess(res, semesters);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Sections
router.get('/sections', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      include: {
        semester: {
          include: {
            batch: { include: { program: true } }
          }
        },
        _count: { select: { students: true } }
      }
    });
    return sendSuccess(res, sections);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

// Subjects
router.get('/subjects', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { programId, semesterNumber } = req.query;
    const whereClause: any = {};
    if (programId) whereClause.programId = String(programId);
    if (semesterNumber) whereClause.semesterNumber = Number(semesterNumber);

    const subjects = await prisma.subject.findMany({
      where: whereClause,
      include: {
        program: true,
        teachingAssignments: {
          include: {
            teacher: { include: { user: true } },
            section: true
          }
        },
        syllabusUnits: true,
        studyMaterials: true
      }
    });
    return sendSuccess(res, subjects);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 500);
  }
});

router.post('/subjects', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, credits, type, programId, semesterNumber } = req.body;
    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        credits: Number(credits) || 4,
        type: type || 'THEORY',
        programId,
        semesterNumber: Number(semesterNumber) || 1
      }
    });
    return sendSuccess(res, subject, 'Subject created', 201);
  } catch (error: any) {
    return sendError(res, 'SERVER_ERROR', error.message, 400);
  }
});

export default router;
