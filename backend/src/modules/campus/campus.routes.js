const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const campusController = require('./campus.controller');

const router = Router();

// HOSTEL
router.get('/hostel/rooms', authenticate, asyncHandler(campusController.getHostelRooms));
router.get('/hostel/complaints', authenticate, asyncHandler(campusController.getHostelComplaints));
router.post('/hostel/complaints', authenticate, requireRole(['STUDENT']), asyncHandler(campusController.createHostelComplaint));
router.patch('/hostel/complaints/:id/status', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOSTEL_STAFF']), asyncHandler(campusController.updateHostelComplaintStatus));

// MESS MENU
router.get('/mess/menu', authenticate, asyncHandler(campusController.getMessMenu));
router.post('/mess/menu', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN', 'HOSTEL_STAFF']), asyncHandler(campusController.updateMessMenu));

// LIBRARY
router.get('/library/books', authenticate, asyncHandler(campusController.getLibraryBooks));
router.get('/library/my-books', authenticate, requireRole(['STUDENT']), asyncHandler(campusController.getMyLibraryBooks));

// FEES
router.get('/fees/my-fee', authenticate, requireRole(['STUDENT']), asyncHandler(campusController.getMyFee));

module.exports = router;