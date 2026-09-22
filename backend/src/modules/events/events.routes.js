const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const eventsController = require('./events.controller');

const router = Router();

// GET all events
router.get('/', authenticate, asyncHandler(eventsController.getEvents));

// CREATE event
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), asyncHandler(eventsController.createEvent));

// REGISTER for event (Student)
router.post('/:id/register', authenticate, requireRole(['STUDENT']), asyncHandler(eventsController.registerForEvent));

// CANCEL event registration
router.delete('/:id/register', authenticate, requireRole(['STUDENT']), asyncHandler(eventsController.cancelEventRegistration));

module.exports = router;