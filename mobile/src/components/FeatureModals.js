import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles } from './modals/modalStyles';
import { CustomizeTilesModal, FallbackModal } from './modals/CommonModals';
import StudentModals from './modals/StudentModals';
import HodModals from './modals/HodModals';
import AdminModals from './modals/AdminModals';
import ParentModals from './modals/ParentModals';

const STUDENT_MODAL_KEYS = [
  'notifications',
  'announce',
  'edu_revolution',
  'fee_statement',
  'assignment',
  'exams',
  'placement_scanner',
  'transport',
  'password',
  'hostel_mess',
  'timetable',
  'library'
];

const HOD_MODAL_KEYS = [
  'hod_rollcall',
  'hod_faculty',
  'hod_syllabus',
  'hod_marks',
  'hod_leaves',
  'hod_timetable',
  'hod_schedule',
  'hod_labs',
  'hod_mentorship',
  'hod_mentoring',
  'hod_circulars'
];

const ADMIN_MODAL_KEYS = [
  'admin_students',
  'admin_admissions',
  'admin_faculty',
  'admin_departments',
  'admin_fees',
  'admin_attendance',
  'admin_exams',
  'admin_broadcast',
  'admin_timetable'
];

const PARENT_MODAL_KEYS = [
  'parent_attendance',
  'parent_marks',
  'parent_fee'
];

const MODAL_TITLES = {
  notifications: 'Campus Notifications (28)',
  addTiles: 'Customize Dashboard Grids',
  announce: 'Announcements & Circulars (15)',
  edu_revolution: 'Edu Revolution (E-Learning)',
  fee_statement: 'Fee Statement & Ledger',
  attendance: 'Attendance Details (95 %)',
  assignment: 'Active Assignments (6)',
  results: 'Results & Grade Card (7.78)',
  exams: 'Examination Schedule (14 Days)',
  rms_status: 'RMS Grievance Status',
  events: 'Campus Events & Fest',
  placement_scanner: 'Placement Barcode Scanner',
  transport: 'Transport & Bus Preference',
  password: 'Change UMS Password',
  hostel_mess: 'Hostel & Mess Services',
  timetable: 'Weekly Class Timetable',
  library: 'E-Library & Question Bank',
  hod_rollcall: 'Class Roll Call & Attendance',
  hod_faculty: 'Faculty Directory & Teacher Manager',
  hod_syllabus: 'Syllabus & Course Coverage',
  hod_marks: 'Internal Marks & Sessional Entry',
  hod_leaves: 'Faculty Leave Approvals',
  hod_timetable: 'Department Timetable',
  hod_schedule: 'Dept Class Schedule',
  hod_labs: 'Lab Sessions & Practical Slots',
  hod_mentorship: 'Student Mentorship & Wards',
  hod_mentoring: 'Student Mentorship & Wards',
  hod_circulars: 'Department Circulars & Notices',
  admin_students: 'Student Roster & Bulk Import',
  admin_admissions: 'Admissions & Enrollment Matrix',
  admin_faculty: 'University Faculty Directory',
  admin_fees: 'Central Fee Collection & Finance',
  admin_attendance: 'University Attendance Monitoring',
  admin_exams: 'Examination Control Cell',
  admin_broadcast: 'Broadcast Official Notice',
  admin_timetable: 'Master University Timetable',
  parent_attendance: 'Ward Daily Attendance',
  parent_marks: 'Semester Grade Card',
  parent_fee: 'Fee Receipts & Ledger'
};

export default function FeatureModals({
  activeModal,
  onClose,
  activeTileIds,
  onToggleTile,
  rmsTickets,
  onAddRmsTicket
}) {
  if (!activeModal) return null;

  const modalTitle = MODAL_TITLES[activeModal] || (
    activeModal ? activeModal.replace(/_/g, ' ').toUpperCase() : 'VGI Portal Module'
  );

  return (
    <View style={modalStyles.featureModalOverlay}>
      <View style={modalStyles.featureModalCard}>
        {/* Top Header */}
        <View style={modalStyles.featureModalHeader}>
          <Text style={modalStyles.featureModalTitle}>{modalTitle}</Text>
          <TouchableOpacity
            style={modalStyles.featureModalCloseBtn}
            onPress={onClose}
          >
            <Ionicons name="close" size={22} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Modal Scrollable Content */}
        <ScrollView style={modalStyles.featureModalBody} showsVerticalScrollIndicator={false}>
          {activeModal === 'addTiles' && (
            <CustomizeTilesModal
              activeTileIds={activeTileIds}
              onToggleTile={onToggleTile}
              onClose={onClose}
            />
          )}

          {STUDENT_MODAL_KEYS.includes(activeModal) && (
            <StudentModals
              activeModal={activeModal}
              rmsTickets={rmsTickets}
              onAddRmsTicket={onAddRmsTicket}
              onClose={onClose}
            />
          )}

          {HOD_MODAL_KEYS.includes(activeModal) && (
            <HodModals
              activeModal={activeModal}
              onClose={onClose}
            />
          )}

          {ADMIN_MODAL_KEYS.includes(activeModal) && (
            <AdminModals
              activeModal={activeModal}
              onClose={onClose}
            />
          )}

          {PARENT_MODAL_KEYS.includes(activeModal) && (
            <ParentModals
              activeModal={activeModal}
              onClose={onClose}
            />
          )}

          {activeModal !== 'addTiles' &&
            !STUDENT_MODAL_KEYS.includes(activeModal) &&
            !HOD_MODAL_KEYS.includes(activeModal) &&
            !ADMIN_MODAL_KEYS.includes(activeModal) &&
            !PARENT_MODAL_KEYS.includes(activeModal) && (
              <FallbackModal
                activeModal={activeModal}
                onClose={onClose}
              />
            )}
        </ScrollView>
      </View>
    </View>
  );
}
