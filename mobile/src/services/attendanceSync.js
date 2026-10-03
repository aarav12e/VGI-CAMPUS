// VGI CAMPUS - High-Performance Synchronized Attendance Store
// Scaled for 3,000+ students, 200+ teachers across 4 years, multiple sections & departments

const STORAGE_KEY = 'vgi_campus_attendance_sessions_v2';

let liveAttendanceSessions = [
  {
    id: 'sess-init-1',
    courseCode: 'BCA',
    semester: 3,
    section: 'Section C',
    subjectCode: 'BCA301',
    subjectName: 'Database Management Systems',
    timeSlot: '09:00 - 10:00 AM',
    date: new Date().toISOString().split('T')[0],
    topic: 'Relational Schema & SQL Primary Keys',
    markedBy: 'Dr. Sunita Rao (HOD CA)',
    records: [
      { studentId: 'bca-c-1', name: 'Amit Sharma', roll: '24BCA011', isPresent: true },
      { studentId: 'bca-c-2', name: 'Neha Verma', roll: '24BCA012', isPresent: true },
      { studentId: 'bca-c-3', name: 'Kunal Jain', roll: '24BCA013', isPresent: true },
      { studentId: 'bca-c-4', name: 'Priya Dixit', roll: '24BCA014', isPresent: true },
      { studentId: 'bca-c-5', name: 'Harsh Vardhan', roll: '24BCA015', isPresent: false }
    ]
  },
  {
    id: 'sess-init-2',
    courseCode: 'BTECH-CSE',
    semester: 5,
    section: 'Section A',
    subjectCode: 'BCS501',
    subjectName: 'Database Management Systems',
    timeSlot: '09:00 - 10:00 AM',
    date: new Date().toISOString().split('T')[0],
    topic: 'Relational Normalization (1NF to BCNF)',
    markedBy: 'Prof. Priya Verma',
    records: [
      { studentId: 'eb9a6d84-090d-478b-8684-83e008476448', name: 'Aarav Patel', roll: '24DS001', isPresent: true },
      { studentId: 'stud-sneha', name: 'Sneha Gupta', roll: '24DS002', isPresent: true },
      { studentId: 'stud-rohan', name: 'Rohan Singh', roll: '24DS003', isPresent: false },
      { studentId: 'stud-ananya', name: 'Ananya Sharma', roll: '24DS004', isPresent: true }
    ]
  }
];

// Inverted Index for O(1) query lookups
const rollIndex = new Map(); // roll -> array of session references
const cohortIndex = new Map(); // `${course}_${section}` -> array of session references
const listeners = new Set();
let isNotifying = false;

// Initialize index
function reindexAll() {
  rollIndex.clear();
  cohortIndex.clear();

  for (let i = 0; i < liveAttendanceSessions.length; i++) {
    const s = liveAttendanceSessions[i];
    const cKey = `${s.courseCode || ''}_${s.section || ''}`.toUpperCase();
    if (!cohortIndex.has(cKey)) cohortIndex.set(cKey, []);
    cohortIndex.get(cKey).push(s);

    if (Array.isArray(s.records)) {
      for (let j = 0; j < s.records.length; j++) {
        const r = s.records[j];
        if (r.roll) {
          const rKey = r.roll.toUpperCase();
          if (!rollIndex.has(rKey)) rollIndex.set(rKey, []);
          rollIndex.get(rKey).push(s);
        }
      }
    }
  }
}

// Load cached sessions if present
try {
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        liveAttendanceSessions = parsed;
      }
    }
  }
} catch (e) {}

reindexAll();

export function getLiveSessions(filter = {}) {
  // Fast path: Indexed by roll
  if (filter.studentRoll) {
    const rKey = filter.studentRoll.toUpperCase();
    const list = rollIndex.get(rKey) || [];
    if (!filter.courseCode && !filter.section) {
      return list;
    }
    return list.filter(s => {
      if (filter.courseCode && s.courseCode !== filter.courseCode) return false;
      if (filter.section && s.section !== filter.section) return false;
      return true;
    });
  }

  // Fast path: Indexed by cohort
  if (filter.courseCode && filter.section) {
    const cKey = `${filter.courseCode}_${filter.section}`.toUpperCase();
    return cohortIndex.get(cKey) || [];
  }

  // General fallback
  return liveAttendanceSessions.filter(s => {
    if (filter.courseCode && s.courseCode !== filter.courseCode) return false;
    if (filter.section && s.section !== filter.section) return false;
    return true;
  });
}

// Fast aggregate stats calculation for a student
export function getStudentAttendanceMetrics(studentRoll) {
  if (!studentRoll) return { total: 0, attended: 0, percentage: 100 };
  const rKey = studentRoll.toUpperCase();
  const sessions = rollIndex.get(rKey) || [];
  let attended = 0;
  for (let i = 0; i < sessions.length; i++) {
    const rec = sessions[i].records?.find(r => r.roll?.toUpperCase() === rKey);
    if (rec && rec.isPresent) attended++;
  }
  const total = sessions.length;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;
  return { total, attended, percentage };
}

export function broadcastAttendanceSession(sessionData) {
  const newSession = {
    id: 'sess-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    ...sessionData
  };

  liveAttendanceSessions = [newSession, ...liveAttendanceSessions];

  // Incremental index update O(1)
  const cKey = `${newSession.courseCode || ''}_${newSession.section || ''}`.toUpperCase();
  if (!cohortIndex.has(cKey)) cohortIndex.set(cKey, []);
  cohortIndex.get(cKey).unshift(newSession);

  if (Array.isArray(newSession.records)) {
    for (let j = 0; j < newSession.records.length; j++) {
      const r = newSession.records[j];
      if (r.roll) {
        const rKey = r.roll.toUpperCase();
        if (!rollIndex.has(rKey)) rollIndex.set(rKey, []);
        rollIndex.get(rKey).unshift(newSession);
      }
    }
  }

  // Persist asynchronously
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveAttendanceSessions.slice(0, 500)));
    }
  } catch (e) {}

  // Throttled notification batching to prevent UI stutter with 200 teachers
  if (!isNotifying) {
    isNotifying = true;
    Promise.resolve().then(() => {
      listeners.forEach(cb => {
        try {
          cb(liveAttendanceSessions);
        } catch (e) {}
      });
      isNotifying = false;
    });
  }

  return newSession;
}

export function subscribeToAttendance(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

