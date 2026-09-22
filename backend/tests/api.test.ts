import app from '../src/app';
import http from 'http';

let server: http.Server;
const BASE_URL = 'http://127.0.0.1:5099/api/v1';

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('🧪 Starting VGI CAMPUS API Automated Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Start test server on port 5099
  server = app.listen(5099);

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.data.appName === 'VGI CAMPUS', 'Health check returns VGI CAMPUS status');

    // 2. Admin Login
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@vgi.ac.in', password: 'Admin@123' })
    });
    assert(adminLogin.status === 200 && adminLogin.data.data.user.role === 'ADMIN', 'Admin login successful with ADMIN role');
    const adminToken = adminLogin.data.data.token;

    // 3. Teacher Login
    const teacherLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'rajesh.sharma@vgi.ac.in', password: 'Password@123' })
    });
    assert(teacherLogin.status === 200 && teacherLogin.data.data.user.role === 'TEACHER', 'Teacher login returns teacher profile');
    const teacherToken = teacherLogin.data.data.token;
    const teacherId = teacherLogin.data.data.user.teacher.id;

    // 4. Student Login
    const studentLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'aarav.patel@vgi.ac.in', password: 'Password@123' })
    });
    assert(studentLogin.status === 200 && studentLogin.data.data.user.role === 'STUDENT', 'Student login returns student profile');
    const studentToken = studentLogin.data.data.token;
    const studentId = studentLogin.data.data.user.student.id;
    const sectionId = studentLogin.data.data.user.student.sectionId;

    // 5. Get Student Dashboard
    const studentDashboard = await request(`/students/${studentId}/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(studentDashboard.status === 200 && studentDashboard.data.data.attendancePercentage > 0, 'Student dashboard returns attendance & timetable');

    // 6. Get Attendance Overview
    const attendance = await request(`/attendance/student/${studentId}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(attendance.status === 200 && attendance.data.data.subjectWise.length > 0, 'Attendance calculates subject-wise percentages');

    // 7. Academic Hierarchy
    const depts = await request('/academic/departments', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(depts.status === 200 && depts.data.data.length >= 2, 'Departments list retrieved');

    // 8. Timetable Conflict Detection Test
    // Try to double-book Teacher 1 at Monday 09:00 - 10:00 in another section/room
    const conflictAttempt = await request('/timetable', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '10:00',
        subjectId: depts.data.data[0].programs[0]?.id || 'fake',
        teacherId: teacherId,
        sectionId: sectionId,
        roomName: 'New Room 999'
      })
    });
    assert(conflictAttempt.status === 409, 'Timetable prevents double booking with 409 Conflict');

    // 9. Admin Dashboard Analytics
    const analytics = await request('/analytics/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(analytics.status === 200 && analytics.data.data.stats.totalStudents >= 3, 'Admin analytics returns institutional KPIs');

    // 10. Audit Logs
    const audit = await request('/audit', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(audit.status === 200 && audit.data.data.length > 0, 'Audit logs track administrative actions');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n-----------------------------------------');
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('-----------------------------------------');
    if (failed > 0) process.exit(1);
  }
}

runTests();
