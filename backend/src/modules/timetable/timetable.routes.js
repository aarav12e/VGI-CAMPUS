const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const timetableController = require('./timetable.controller');

const router = Router();

// GET timetable
router.get('/', authenticate, asyncHandler(timetableController.getTimetable));

// CREATE timetable entry (with conflict detection)
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(timetableController.createTimetableEntry));

// DELETE timetable entry
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(timetableController.deleteTimetableEntry));

module.exports = router;