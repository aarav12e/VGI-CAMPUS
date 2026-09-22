// =========================================================================
// DEMO PERSONAS
// =========================================================================
export const DEMO_STUDENT = {
    name: 'Aarav Patel',
    role: 'STUDENT',
    email: 'aarav.patel@vgi.ac.in',
    userId: '24DS001',
    rollNumber: '24DS001',
    enrollmentNumber: 'ENR2024001',
    program: 'B.Tech Data Science (CSE)',
    semester: 5,
    section: 'Section A',
    cgpa: '8.65',
    attendance: 84,
    hostelRoom: 'Aryabhata Hostel - Room 204',
    guardian: 'Suresh Patel (+91 98760 11223)'
};

export const DEMO_TEACHER = {
    name: 'Dr. Rajesh Sharma',
    role: 'TEACHER',
    email: 'rajesh.sharma@vgi.ac.in',
    userId: 'EMP001',
    employeeId: 'EMP001',
    designation: 'Professor & HOD',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. in Computer Science (IIT Roorkee)',
    specialization: 'Artificial Intelligence & Databases',
    cabin: 'Room 214, Academic Block A',
    phone: '+91 98765 43210'
};

export const DEMO_PARENT = {
    name: 'Suresh Patel',
    role: 'PARENT',
    email: 'suresh.patel@vgi.ac.in',
    userId: 'PAR24001',
    phone: '+91 98760 11223',
    relation: 'Father / Guardian',
    ward: {
        name: 'Aarav Patel',
        rollNumber: '24DS001',
        program: 'B.Tech Data Science (CSE)',
        semester: 5,
        section: 'Section A',
        attendance: 84,
        cgpa: '8.65',
        hostelRoom: 'Aryabhata Hostel - Room 204',
        feeStatus: 'PAID',
        feeAmount: '₹ 1,25,000'
    }
};

export const DEMO_ADMIN = {
    name: 'Prof. S. K. Verma',
    role: 'ADMIN',
    email: 'admin@vgi.ac.in',
    userId: 'ADM001',
    designation: 'Registrar & Dean of Academics',
    department: 'University Central Administration',
    cabin: 'Administrative Block, Ground Floor',
    phone: '+91 98111 22334'
};

// =========================================================================
// 1. REGULAR STUDENT TILES CATALOG (Inspiration Image 1)
// =========================================================================
export const ALL_STUDENT_TILES = [
    { id: 'announce', label: 'Announce', badge: '15', iconName: 'megaphone-outline', category: 'Circulars' },
    { id: 'edu_revolution', label: 'Edu\nRevolution', highlight: true, iconName: 'school-outline', category: 'Learning' },
    { id: 'fee_statement', label: 'Fee\nStatement', iconName: 'cash-outline', category: 'Finance' },
    { id: 'attendance', label: 'Attendance', badge: '95 %', iconName: 'clipboard-outline', category: 'Academics' },
    { id: 'assignment', label: 'Assignment', badge: '6', iconName: 'reader-outline', category: 'Academics' },
    { id: 'results', label: 'Results', badge: '7.78', iconName: 'pie-chart-outline', category: 'Exams' },
    { id: 'exams', label: 'Exams', badge: '14', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'rms_status', label: 'RMS Status', iconName: 'calendar-outline', category: 'Support' },
    { id: 'events', label: 'Events', iconName: 'people-outline', category: 'Campus' },
    // Extra student tiles via '+'
    { id: 'placement_scanner', label: 'Placement\nScanner', badge: 'NEW', iconName: 'qr-code-outline', category: 'Placements' },
    { id: 'timetable', label: 'Time Table', iconName: 'time-outline', category: 'Academics' },
    { id: 'transport', label: 'Transport', iconName: 'bus-outline', category: 'Services' },
    { id: 'hostel_mess', label: 'Hostel & Mess', iconName: 'bed-outline', category: 'Hostel' },
    { id: 'library', label: 'E-Library', badge: '3', iconName: 'book-outline', category: 'Library' },
];

export const DEFAULT_TILE_IDS = [
    'announce',
    'edu_revolution',
    'fee_statement',
    'attendance',
    'assignment',
    'results',
    'exams',
    'rms_status',
    'events'
];

// =========================================================================
// 2. ADMIN TILES CATALOG (Dean & Registrar)
// =========================================================================
export const ALL_ADMIN_TILES = [
    { id: 'admin_students', label: 'Student\nRoster', badge: '4,280', highlight: true, iconName: 'people-outline', category: 'Students' },
    { id: 'admin_admissions', label: 'Admissions\nDesk', badge: '42 New', iconName: 'person-add-outline', category: 'Enrollment' },
    { id: 'admin_faculty', label: 'Faculty\nRoster', badge: '142', iconName: 'briefcase-outline', category: 'Staff' },
    { id: 'admin_fees', label: 'Fee Revenue\nLedger', badge: '₹ 4.2 Cr', iconName: 'cash-outline', category: 'Finance' },
    { id: 'admin_attendance', label: 'Campus\nAttendance', badge: '94.2%', iconName: 'stats-chart-outline', category: 'Analytics' },
    { id: 'admin_exams', label: 'Exam Cell\nControl', badge: 'Sem 5', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'admin_rms', label: 'Grievance\nRedressal', badge: '3 Open', iconName: 'chatbubbles-outline', category: 'Support' },
    { id: 'admin_broadcast', label: 'Circular\nBroadcast', badge: 'Live', iconName: 'megaphone-outline', category: 'Notices' },
    { id: 'admin_hostel', label: 'Hostel\nAllotment', badge: '92% Full', iconName: 'bed-outline', category: 'Hostel' },
    { id: 'admin_naac', label: 'NAAC & AICTE\nCompliance', badge: 'A+ Grade', iconName: 'ribbon-outline', category: 'Quality' },
    // Extra admin tiles
    { id: 'admin_transport', label: 'Transport\nFleet', badge: '24 Buses', iconName: 'bus-outline', category: 'Services' },
    { id: 'admin_timetable', label: 'Master\nTimetable', iconName: 'calendar-outline', category: 'Academics' },
    { id: 'admin_placement', label: 'Placement\nAnalytics', badge: '88%', iconName: 'trophy-outline', category: 'Placements' },
    { id: 'admin_audit', label: 'System Audit\nLogs', iconName: 'shield-checkmark-outline', category: 'Security' }
];

export const DEFAULT_ADMIN_TILE_IDS = [
    'admin_students',
    'admin_admissions',
    'admin_faculty',
    'admin_fees',
    'admin_attendance',
    'admin_exams',
    'admin_rms',
    'admin_broadcast',
    'admin_hostel',
    'admin_naac'
];

// =========================================================================
// 3. HOD / TEACHER TILES CATALOG (Dr. Rajesh Sharma)
// =========================================================================
export const ALL_HOD_TILES = [
    { id: 'hod_rollcall', label: 'Class Roll\nCall', badge: 'Live', highlight: true, iconName: 'checkbox-outline', category: 'Teaching' },
    { id: 'hod_faculty', label: 'Dept Faculty\nRoster', badge: '18 Faculty', iconName: 'people-outline', category: 'Department' },
    { id: 'hod_syllabus', label: 'Syllabus\nCoverage', badge: '68%', iconName: 'pie-chart-outline', category: 'Academics' },
    { id: 'hod_marks', label: 'Internal\nMarks Entry', badge: 'Pending', iconName: 'create-outline', category: 'Exams' },
    { id: 'hod_leaves', label: 'Faculty Leave\nApprovals', badge: '2 New', iconName: 'calendar-outline', category: 'Approvals' },
    { id: 'hod_timetable', label: 'Dept Class\nSchedule', badge: 'Mon-Fri', iconName: 'time-outline', category: 'Schedule' },
    { id: 'hod_labs', label: 'Lab Sessions\n& Slots', badge: 'Lab 3', iconName: 'flask-outline', category: 'Labs' },
    { id: 'hod_mentoring', label: 'Student\nMentorship', badge: '15 Wards', iconName: 'school-outline', category: 'Mentoring' },
    { id: 'hod_circulars', label: 'Dept\nCirculars', badge: '4 New', iconName: 'megaphone-outline', category: 'Notices' },
    // Extra HOD tiles
    { id: 'hod_projects', label: 'Final Year\nProjects', badge: '24 Teams', iconName: 'folder-outline', category: 'Projects' },
    { id: 'hod_exam_duties', label: 'Exam Invigil.\nDuties', badge: '3 Slots', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'hod_rms', label: 'Dept Level\nGrievance', badge: '1 Active', iconName: 'chatbubble-ellipses-outline', category: 'Support' }
];

export const DEFAULT_HOD_TILE_IDS = [
    'hod_rollcall',
    'hod_faculty',
    'hod_syllabus',
    'hod_marks',
    'hod_leaves',
    'hod_timetable',
    'hod_labs',
    'hod_mentoring',
    'hod_circulars'
];

// =========================================================================
// 4. PARENT TILES CATALOG (Suresh Patel monitoring Aarav Patel)
// =========================================================================
export const ALL_PARENT_TILES = [
    { id: 'parent_attendance', label: 'Ward Daily\nAttendance', badge: '84 %', highlight: true, iconName: 'clipboard-outline', category: 'Academics' },
    { id: 'parent_marks', label: 'Semester\nGrade Card', badge: '8.65 CGPA', iconName: 'pie-chart-outline', category: 'Grades' },
    { id: 'parent_fee', label: 'Fee Receipts\n& Dues', badge: 'Paid', iconName: 'cash-outline', category: 'Finance' },
    { id: 'parent_mentor', label: 'Faculty Mentor\nConnect', badge: 'Dr. Rajesh', iconName: 'call-outline', category: 'Communication' },
    { id: 'parent_timetable', label: 'Class\nTimetable', badge: 'Live', iconName: 'time-outline', category: 'Schedule' },
    { id: 'parent_bus', label: 'College Bus\nGPS Track', badge: 'Route 7', iconName: 'bus-outline', category: 'Transport' },
    { id: 'parent_hostel', label: 'Hostel & Mess\nMenu', badge: 'Room 204', iconName: 'bed-outline', category: 'Residence' },
    { id: 'parent_outpass', label: 'Apply Ward\nOutpass', badge: 'Approved', iconName: 'exit-outline', category: 'Gatepass' },
    { id: 'parent_notices', label: 'College\nNotices', badge: '3 New', iconName: 'megaphone-outline', category: 'Notices' },
    // Extra Parent tiles
    { id: 'parent_health', label: 'Campus Health\nRecord', badge: 'Fit', iconName: 'medkit-outline', category: 'Health' },
    { id: 'parent_exams', label: 'Exam Dates\n& Centers', badge: '14 Days', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'parent_feedback', label: 'Feedback &\nGrievance', iconName: 'chatbubbles-outline', category: 'Support' }
];

export const DEFAULT_PARENT_TILE_IDS = [
    'parent_attendance',
    'parent_marks',
    'parent_fee',
    'parent_mentor',
    'parent_timetable',
    'parent_bus',
    'parent_hostel',
    'parent_outpass',
    'parent_notices'
];
