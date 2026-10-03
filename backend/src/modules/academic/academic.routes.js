const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const academicController = require('./academic.controller');

const router = Router();

// Departments & HODs
router.get('/departments', authenticate, asyncHandler(academicController.getDepartments));
router.post('/departments', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(academicController.createDepartment));
router.post('/assign-hod', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(academicController.assignHod));
router.get('/departments/:id/overview', authenticate, asyncHandler(academicController.getDepartmentOverview));

// Programs
router.get('/programs', authenticate, asyncHandler(academicController.getPrograms));
router.post('/programs', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(academicController.createProgram));

// Academic Years
router.get('/academic-years', authenticate, asyncHandler(academicController.getAcademicYears));
router.post('/academic-years', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(academicController.createAcademicYear));

// Batches
router.get('/batches', authenticate, asyncHandler(academicController.getBatches));
router.post('/batches', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(academicController.createBatch));

// Semesters
router.get('/semesters', authenticate, asyncHandler(academicController.getSemesters));

// Sections
router.get('/sections', authenticate, asyncHandler(academicController.getSections));
router.post('/sections', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(academicController.createSection));

// Subjects
router.get('/subjects', authenticate, asyncHandler(academicController.getSubjects));
router.post('/subjects', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(academicController.createSubject));

module.exports = router;