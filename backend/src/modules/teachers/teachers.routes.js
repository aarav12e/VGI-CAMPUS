const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const teachersController = require('./teachers.controller');

const router = Router();

// GET all teachers
router.get('/', authenticate, asyncHandler(teachersController.getTeachers));

// GET teacher by ID
router.get('/:id', authenticate, asyncHandler(teachersController.getTeacherById));

// CREATE teacher or HOD (Admin & HOD)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(teachersController.createTeacher));

// GET teacher dashboard
router.get('/:id/dashboard', authenticate, asyncHandler(teachersController.getTeacherDashboard));

module.exports = router;