const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const studentsController = require('./students.controller');

const router = Router();

// GET all students (with filtering)
router.get('/', authenticate, asyncHandler(studentsController.getStudents));

// GET student by ID
router.get('/:id', authenticate, asyncHandler(studentsController.getStudentById));

// CREATE new student (Admin & HOD)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(studentsController.createStudent));

// GET student dashboard summary
router.get('/:id/dashboard', authenticate, asyncHandler(studentsController.getStudentDashboard));

module.exports = router;