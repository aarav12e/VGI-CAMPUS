import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import authRoutes from './modules/auth/auth.routes';
import academicRoutes from './modules/academic/academic.routes';
import studentRoutes from './modules/students/students.routes';
import teacherRoutes from './modules/teachers/teachers.routes';
import teachingAssignmentRoutes from './modules/teaching-assignments/teaching-assignments.routes';
import timetableRoutes from './modules/timetable/timetable.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import assignmentRoutes from './modules/assignments/assignments.routes';
import syllabusRoutes from './modules/syllabus/syllabus.routes';
import resultsRoutes from './modules/results/results.routes';
import noticesRoutes from './modules/notices/notices.routes';
import eventsRoutes from './modules/events/events.routes';
import campusRoutes from './modules/campus/campus.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import auditRoutes from './modules/audit/audit.routes';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Base health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'VGI CAMPUS',
    timestamp: new Date().toISOString()
  });
});

// Mount /api/v1 modules
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/academic', academicRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/teaching-assignments', teachingAssignmentRoutes);
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/syllabus', syllabusRoutes);
app.use('/api/v1/results', resultsRoutes);
app.use('/api/v1/notices', noticesRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/campus', campusRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/audit', auditRoutes);

export default app;
