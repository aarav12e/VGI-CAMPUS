const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const resultsController = require('./results.controller');

const router = Router();

// GET results for a student
router.get('/student/:studentId', authenticate, asyncHandler(resultsController.getStudentResults));

// GET all results (for Admin/Staff overview)
router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'TEACHER', 'HOD']), asyncHandler(resultsController.getAllResults));

// CREATE / RECORD RESULT (Admin or Authorized Faculty)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(resultsController.createResult));

module.exports = router;