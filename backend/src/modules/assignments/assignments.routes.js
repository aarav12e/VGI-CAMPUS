const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const assignmentsController = require('./assignments.controller');

const router = Router();

// GET assignments
router.get('/', authenticate, asyncHandler(assignmentsController.getAssignments));

// GET single assignment details
router.get('/:id', authenticate, asyncHandler(assignmentsController.getAssignmentById));

// CREATE assignment (Teacher or Admin)
router.post('/', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), asyncHandler(assignmentsController.createAssignment));

// SUBMIT assignment (Student)
router.post('/:id/submit', authenticate, requireRole(['STUDENT']), asyncHandler(assignmentsController.submitAssignment));

// GRADE submission (Teacher or Admin)
router.post('/submissions/:submissionId/grade', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), asyncHandler(assignmentsController.gradeSubmission));

module.exports = router;