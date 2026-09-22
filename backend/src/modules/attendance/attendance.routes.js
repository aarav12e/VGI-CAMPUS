const { Router } = require('express');
const { authenticate, requireRole } = require('../../middleware/auth');
const { asyncHandler } = require('../../utils/asyncHandler');
const attendanceController = require('./attendance.controller');

const router = Router();

// Student attendance overview (Calculates overall % and subject-wise %)
router.get('/student/:studentId', authenticate, asyncHandler(attendanceController.getStudentAttendanceOverview));

// Attendance sessions list (with optional filters)
router.get('/sessions', authenticate, asyncHandler(attendanceController.getAttendanceSessions));

// Teacher marks attendance
router.post('/sessions', authenticate, requireRole(['TEACHER', 'HOD', 'ADMIN', 'SUPER_ADMIN']), asyncHandler(attendanceController.createAttendanceSession));

// Department Attendance Analytics (Per-Subject % and Combined Total Average %)
router.get('/analytics/department/:departmentId', authenticate, asyncHandler(attendanceController.getDepartmentAttendanceAnalytics));

module.exports = router;