const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const academicRoutes = require('../modules/academic/academic.routes');
const studentRoutes = require('../modules/students/students.routes');
const teacherRoutes = require('../modules/teachers/teachers.routes');
const teachingAssignmentRoutes = require('../modules/teaching-assignments/teaching-assignments.routes');
const timetableRoutes = require('../modules/timetable/timetable.routes');
const attendanceRoutes = require('../modules/attendance/attendance.routes');
const assignmentRoutes = require('../modules/assignments/assignments.routes');
const syllabusRoutes = require('../modules/syllabus/syllabus.routes');
const resultsRoutes = require('../modules/results/results.routes');
const noticesRoutes = require('../modules/notices/notices.routes');
const eventsRoutes = require('../modules/events/events.routes');
const campusRoutes = require('../modules/campus/campus.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const auditRoutes = require('../modules/audit/audit.routes');

const router = Router();

// Base health check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'VGI CAMPUS',
    timestamp: new Date().toISOString()
  });
});

// Domain routes mounting
router.use('/auth', authRoutes);
router.use('/academic', academicRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/teaching-assignments', teachingAssignmentRoutes);
router.use('/timetable', timetableRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/syllabus', syllabusRoutes);
router.use('/results', resultsRoutes);
router.use('/notices', noticesRoutes);
router.use('/events', eventsRoutes);
router.use('/campus', campusRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit', auditRoutes);

module.exports = router;
