const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const teachingAssignmentsController = require('./teaching-assignments.controller');

const router = Router();

// GET all teaching assignments
router.get('/', authenticate, asyncHandler(teachingAssignmentsController.getTeachingAssignments));

// CREATE teaching assignment
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(teachingAssignmentsController.createTeachingAssignment));

// DELETE teaching assignment
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD']), asyncHandler(teachingAssignmentsController.deleteTeachingAssignment));

module.exports = router;