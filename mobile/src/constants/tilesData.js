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
// =========================================================================
// 1. REGULAR STUDENT TILES CATALOG (Inspiration Image 1)
// =========================================================================
export const ALL_STUDENT_TILES = [
    { id: 'attendance', label: 'Live\nAttendance', badge: '84 %', highlight: true, iconName: 'clipboard-outline', category: 'Academics' },
    { id: 'syllabus', label: 'Course\nSyllabus', badge: 'Units', highlight: true, iconName: 'book-outline', category: 'Academics' },
    { id: 'timetable', label: 'Class\nTimetable', badge: 'Live', highlight: true, iconName: 'calendar-outline', category: 'Academics' },
    { id: 'results', label: 'Results &\nGrades', badge: '8.65', iconName: 'pie-chart-outline', category: 'Exams' },
    { id: 'events', label: 'Happenings\n& Events', badge: 'Fest', iconName: 'newspaper-outline', category: 'Campus' },
    { id: 'rms_status', label: 'RMS\nGrievance', iconName: 'chatbubbles-outline', category: 'Support' },
    { id: 'exams', label: 'Exams\nPortal', badge: '14 Days', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'fee_statement', label: 'Fee\nStatement', badge: 'Paid', iconName: 'cash-outline', category: 'Finance' },
    { id: 'announce', label: 'Official\nNotices', badge: '15', iconName: 'megaphone-outline', category: 'Circulars' },
    { id: 'placement_scanner', label: 'Placement\nScanner', badge: 'NEW', iconName: 'qr-code-outline', category: 'Placements' },
    { id: 'transport', label: 'Transport', iconName: 'bus-outline', category: 'Services' },
    { id: 'hostel_mess', label: 'Hostel & Mess', iconName: 'bed-outline', category: 'Hostel' },
    { id: 'library', label: 'E-Library', badge: '3', iconName: 'library-outline', category: 'Library' },
];

export const DEFAULT_TILE_IDS = [
    'attendance',
    'syllabus',
    'timetable',
    'results',
    'events',
    'rms_status',
    'exams',
    'fee_statement',
    'announce'
];

// =========================================================================
// 2. ADMIN TILES CATALOG (Dean & Registrar)
// =========================================================================
export const ALL_ADMIN_TILES = [
    { id: 'admin_departments', label: 'Depts & HOD\nAppointment', badge: 'Multi-Yr', highlight: true, iconName: 'business-outline', category: 'Academic' },
    { id: 'admin_admissions', label: 'Admissions &\nEnrollment', badge: '42 New', highlight: true, iconName: 'person-add-outline', category: 'Enrollment' },
    { id: 'admin_events', label: 'Campus Fests\n& Hackathons', badge: 'Live', highlight: true, iconName: 'newspaper-outline', category: 'Campus' },
    { id: 'admin_attendance', label: 'University\nAttendance', badge: '94.2%', iconName: 'stats-chart-outline', category: 'Analytics' },
    { id: 'admin_rms', label: 'Central RMS\nGrievance', badge: '3 Open', iconName: 'chatbubbles-outline', category: 'Support' },
    { id: 'admin_fees', label: 'Fee Revenue\nLedger', badge: '₹ 4.2 Cr', iconName: 'cash-outline', category: 'Finance' },
    { id: 'admin_exams', label: 'Exam Cell\nControl', badge: 'Sem 5', iconName: 'document-text-outline', category: 'Exams' },
    { id: 'admin_broadcast', label: 'Broadcast\nNotice', badge: 'Live', iconName: 'megaphone-outline', category: 'Notices' },
    { id: 'admin_hostel', label: 'Hostel\nAllotment', badge: '92% Full', iconName: 'bed-outline', category: 'Hostel' },
];

export const DEFAULT_ADMIN_TILE_IDS = [
    'admin_departments',
    'admin_admissions',
    'admin_events',
    'admin_attendance',
    'admin_rms',
    'admin_fees',
    'admin_exams',
    'admin_broadcast',
    'admin_hostel'
];

// =========================================================================
// 3. HOD TILES CATALOG (Executive Academic Head)
// =========================================================================
export const ALL_HOD_TILES = [
    { id: 'hod_syllabus', label: 'Course\nSyllabus', badge: 'Active', highlight: true, iconName: 'book-outline', category: 'Curriculum' },
    { id: 'hod_timetable', label: 'Timetable &\nAllocations', badge: 'Daily', highlight: true, iconName: 'calendar-outline', category: 'Schedule' },
    { id: 'hod_rollcall', label: 'Class Roll\nCall', badge: 'Live', highlight: true, iconName: 'checkbox-outline', category: 'Teaching' },
    { id: 'hod_faculty', label: 'Faculty\nDirectory', badge: '14 Profs', iconName: 'people-outline', category: 'Department' },
    { id: 'hod_students', label: 'Students &\nCohorts', badge: '120 Stud', iconName: 'school-outline', category: 'Students' },
    { id: 'hod_analytics', label: 'Attendance\nAudit', badge: '89.4%', iconName: 'stats-chart-outline', category: 'Analytics' },
    { id: 'hod_sections', label: 'Create\nSection', badge: '+ New', iconName: 'grid-outline', category: 'Sections' },
    { id: 'hod_campus', label: 'Campus Life\n& Events', badge: 'Fest', iconName: 'newspaper-outline', category: 'Campus' },
    { id: 'hod_rms', label: 'Dept RMS\nSupport', badge: 'Support', iconName: 'chatbubbles-outline', category: 'Support' },
];

export const DEFAULT_HOD_TILE_IDS = [
    'hod_syllabus',
    'hod_timetable',
    'hod_rollcall',
    'hod_faculty',
    'hod_students',
    'hod_analytics',
    'hod_sections',
    'hod_campus',
    'hod_rms'
];

// =========================================================================
// 3b. TEACHER TILES CATALOG (Teaching Faculty)
// =========================================================================
export const ALL_TEACHER_TILES = [
    { id: 'teacher_rollcall', label: 'Classroom\nRoll-Call', badge: 'Live', highlight: true, iconName: 'checkbox-outline', category: 'Attendance' },
    { id: 'teacher_schedule', label: 'Lecture\nSchedule', badge: 'Today', highlight: true, iconName: 'calendar-outline', category: 'Schedule' },
    { id: 'teacher_students', label: 'My Student\nCohorts', badge: '3 Classes', iconName: 'people-outline', category: 'Students' },
    { id: 'teacher_history', label: 'Completed\nSessions', badge: 'Logs', iconName: 'time-outline', category: 'History' },
    { id: 'teacher_campus', label: 'Campus\nEvents', badge: 'Fest', iconName: 'newspaper-outline', category: 'Campus' },
    { id: 'teacher_support', label: 'Faculty\nRMS', badge: 'Support', iconName: 'chatbubbles-outline', category: 'Support' },
];

export const DEFAULT_TEACHER_TILE_IDS = [
    'teacher_rollcall',
    'teacher_schedule',
    'teacher_students',
    'teacher_history',
    'teacher_campus',
    'teacher_support'
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
    'parent_hostel',
    'parent_outpass',
    'parent_notices'
];
