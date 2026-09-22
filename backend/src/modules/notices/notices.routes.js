const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const noticesController = require('./notices.controller');

const router = Router();

// GET notices (filtered by user role and department)
router.get('/', authenticate, asyncHandler(noticesController.getNotices));

// CREATE notice
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOD', 'TEACHER']), asyncHandler(noticesController.createNotice));

// DELETE notice
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(noticesController.deleteNotice));

module.exports = router;