import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles } from './modalStyles';
import { COLORS } from '../../theme/colors';
import { DEFAULT_DEPARTMENTS, ACADEMIC_SECTIONS, ACADEMIC_YEARS } from '../../constants/academicData';

// Demo roster data (dept-section-year keyed)
const DEMO_ROSTER = {
  'CSE-A-1st Year':  [{ name: 'Aarav Patel', id: '24CS001' }, { name: 'Riya Sharma', id: '24CS002' }, { name: 'Arjun Verma', id: '24CS003' }, { name: 'Priya Mehta', id: '24CS004' }],
  'CSE-A-2nd Year': [{ name: 'Rohit Singh', id: '23CS001' }, { name: 'Anjali Gupta', id: '23CS002' }, { name: 'Vikram Nair', id: '23CS003' }],
  'CSE-B-1st Year': [{ name: 'Sneha Kapoor', id: '24CS005' }, { name: 'Mohit Yadav', id: '24CS006' }],
  'CA-A-1st Year':  [{ name: 'Aditya Kumar', id: '24CA001' }, { name: 'Pooja Rawat', id: '24CA002' }],
  'MGMT-A-1st Year':[{ name: 'Deepak Aggarwal', id: '24MB001' }, { name: 'Sonia Rao', id: '24MB002' }],
  'LAW-A-1st Year': [{ name: 'Ishaan Khanna', id: '24LW001' }, { name: 'Tanya Malhotra', id: '24LW002' }],
  'PHARM-A-1st Year':[{ name: 'Ravi Sharma', id: '24PH001' }, { name: 'Priyanka Das', id: '24PH002' }],
};

function getBatchRange(year) {
  const now = new Date().getFullYear();
  const offset = { '1st Year': 0, '2nd Year': 1, '3rd Year': 2, '4th Year': 3 }[year] || 0;
  return `${now - offset}–${now - offset + 4}`;
}

export default function AdminModals({ activeModal, onClose }) {
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [targetRecipient, setTargetRecipient] = useState('All Students');

  // Student Roster state
  const [rosterDept, setRosterDept] = useState(null);
  const [rosterSection, setRosterSection] = useState(null);
  const [rosterYear, setRosterYear] = useState(null);

  const rosterKey = rosterDept && rosterSection && rosterYear
    ? `${rosterDept.code}-${rosterSection.replace('Section ', '')}-${rosterYear}`
    : null;
  const students = rosterKey ? (DEMO_ROSTER[rosterKey] || []) : [];

  return (
    <View>
      {/* 0. STUDENT ROSTER & BULK IMPORT */}
      {activeModal === 'admin_students' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Select Department → Section → Year to view students. Use the Bulk Import feature on the Admin Dashboard to upload via CSV.
          </Text>

          {/* Dept */}
          <Text style={styles.filterLabel}>SELECT DEPARTMENT</Text>
          <View style={styles.pillsRow}>
            {DEFAULT_DEPARTMENTS.map(d => (
              <TouchableOpacity
                key={d.code}
                style={[styles.pill, rosterDept?.code === d.code && styles.pillActive]}
                onPress={() => { setRosterDept(d); setRosterSection(null); setRosterYear(null); }}
              >
                <Text style={[styles.pillText, rosterDept?.code === d.code && styles.pillTextActive]}>{d.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {rosterDept && <Text style={styles.deptName}>{rosterDept.name}</Text>}

          {/* Section */}
          {rosterDept && (
            <>
              <Text style={styles.filterLabel}>SELECT SECTION</Text>
              <View style={styles.pillsRow}>
                {ACADEMIC_SECTIONS.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.pill, rosterSection === s && styles.pillActive]}
                    onPress={() => { setRosterSection(s); setRosterYear(null); }}
                  >
                    <Text style={[styles.pillText, rosterSection === s && styles.pillTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Year */}
          {rosterSection && (
            <>
              <Text style={styles.filterLabel}>SELECT YEAR</Text>
              <View style={styles.pillsRow}>
                {ACADEMIC_YEARS.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[styles.pill, rosterYear === y && styles.pillActive]}
                    onPress={() => setRosterYear(y)}
                  >
                    <Text style={[styles.pillText, rosterYear === y && styles.pillTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Batch range */}
          {rosterYear && (
            <View style={styles.batchBanner}>
              <Ionicons name="calendar-outline" size={12} color="#065F46" />
              <Text style={styles.batchBannerText}>
                Batch {getBatchRange(rosterYear)} • {rosterDept?.name} • {rosterSection} • {rosterYear}
              </Text>
            </View>
          )}

          {/* Student list */}
          {rosterYear && (
            <View style={styles.studentListWrap}>
              <View style={styles.studentListHead}>
                <Text style={styles.studentListHeadText}>
                  {students.length > 0 ? `${students.length} Students` : 'No Students Found'}
                </Text>
              </View>
              {students.map((s, idx) => (
                <View key={s.id} style={styles.studentRow}>
                  <Text style={styles.studentIdx}>{idx + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName}>{s.name}</Text>
                    <Text style={styles.studentId}>{s.id}</Text>
                  </View>
                </View>
              ))}
              {students.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="person-add-outline" size={24} color={COLORS.textLight} />
                  <Text style={styles.emptyText}>Use Bulk Import on Dashboard to add students</Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* 1. ADMISSIONS MATRIX */}
      {activeModal === 'admin_admissions' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Total Student Enrollment across all 4 years and 9 degree programs.
          </Text>
          <View style={styles.statGrid2}>
            <View style={styles.statCardHalf}>
              <Text style={styles.statCardHalfValue}>4,280</Text>
              <Text style={styles.statCardHalfLabel}>TOTAL STUDENTS</Text>
            </View>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.success }]}>96.4%</Text>
              <Text style={styles.statCardHalfLabel}>SEATS FILLED</Text>
            </View>
          </View>

          {[
            { course: 'B.Tech (CSE, AI, DS, ECE)', intake: '480 / 480 Seats', years: '4 Years' },
            { course: 'BCA (Bachelor of Comp. Appl)', intake: '180 / 180 Seats', years: '3-4 Years' },
            { course: 'MCA (Master of Comp. Appl)', intake: '120 / 120 Seats', years: '2 Years' },
            { course: 'M.Tech (Advanced Computing)', intake: '60 / 60 Seats', years: '2 Years' },
            { course: 'MBA (Dual Specialization)', intake: '120 / 120 Seats', years: '2 Years' },
            { course: 'BBA (Business Admin)', intake: '180 / 180 Seats', years: '3-4 Years' },
            { course: 'LLB & BA LLB (Law)', intake: '120 / 120 Seats', years: '3-5 Years' },
            { course: 'BFD (Fashion & Design)', intake: '60 / 60 Seats', years: '4 Years' },
            { course: 'B.Pharma (Pharmacy)', intake: '100 / 100 Seats', years: '4 Years' }
          ].map((p, i) => (
            <View key={i} style={styles.programRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.programCourse}>{p.course}</Text>
                <Text style={styles.programYears}>{p.years} Program</Text>
              </View>
              <View style={modalStyles.deptBadge}>
                <Text style={modalStyles.deptBadgeText}>{p.intake}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 2. CENTRAL FACULTY ROSTER */}
      {activeModal === 'admin_faculty' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            University-wide faculty roster (142 professors, associate professors, and HODs).
          </Text>
          <View style={styles.statGrid2}>
            <View style={styles.statCardHalf}>
              <Text style={styles.statCardHalfValue}>142</Text>
              <Text style={styles.statCardHalfLabel}>TOTAL FACULTY</Text>
            </View>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.success }]}>1:15</Text>
              <Text style={styles.statCardHalfLabel}>FACULTY RATIO</Text>
            </View>
          </View>

          {DEFAULT_DEPARTMENTS.map((dept, i) => (
            <View key={i} style={modalStyles.facultyCard}>
              <Text style={modalStyles.facultyName}>{dept.name} ({dept.code})</Text>
              <Text style={modalStyles.facultyDesignation}>Faculty Strength: {18 + i * 2} Professors & Lecturers</Text>
            </View>
          ))}
        </View>
      )}

      {/* 3. CENTRAL FEE REVENUE */}
      {activeModal === 'admin_fees' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Central University Accounts & Semester Fee Collection.
          </Text>
          <View style={styles.statGrid2}>
            <View style={styles.statCardHalf}>
              <Text style={styles.statCardHalfValue}>₹ 4.28 Cr</Text>
              <Text style={styles.statCardHalfLabel}>FEES COLLECTED</Text>
            </View>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.warning }]}>₹ 32.5 L</Text>
              <Text style={styles.statCardHalfLabel}>PENDING DUES</Text>
            </View>
          </View>
          <TouchableOpacity
            style={modalStyles.submitActionBtn}
            onPress={() => Alert.alert('Payment Reminders', 'Automated SMS & WhatsApp payment reminders dispatched to fee defaulters.')}
          >
            <Ionicons name="notifications-outline" size={16} color={COLORS.white} />
            <Text style={modalStyles.submitActionBtnText}>Send Defaulter Reminders</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. CAMPUS ATTENDANCE */}
      {activeModal === 'admin_attendance' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Real-time campus-wide biometric & classroom attendance analytics.
          </Text>
          <View style={styles.statGrid2}>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.success }]}>94.2%</Text>
              <Text style={styles.statCardHalfLabel}>CAMPUS ATTENDANCE</Text>
            </View>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.danger }]}>28</Text>
              <Text style={styles.statCardHalfLabel}>STUDENTS &lt; 75%</Text>
            </View>
          </View>
          <TouchableOpacity
            style={modalStyles.outlineActionBtn}
            onPress={() => Alert.alert('Notice Dispatched', 'Deans warning letters issued to all students below 75% attendance.')}
          >
            <Ionicons name="mail-unread-outline" size={16} color={COLORS.primary} />
            <Text style={modalStyles.outlineActionBtnText}>Issue 75% Shortage Notices</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. EXAM CONTROL CELL */}
      {activeModal === 'admin_exams' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            University Examination Control Cell & Flying Squad Roster.
          </Text>
          {[
            { exam: 'Even Semester Mid-Term Examination 2026', date: 'Starts 12 Oct 2026', status: 'Admit Cards Ready' },
            { exam: 'Practical & Viva-Voce External Assessment', date: '01 Nov - 08 Nov', status: 'Examiners Appointed' },
            { exam: 'University End Semester Final Examinations', date: '01 Dec - 22 Dec', status: 'Question Papers Vaulted' }
          ].map((ex, i) => (
            <View key={i} style={modalStyles.facultyCard}>
              <Text style={modalStyles.facultyName}>{ex.exam}</Text>
              <Text style={modalStyles.facultyDesignation}>{ex.date}</Text>
              <View style={[modalStyles.courseBadge, { alignSelf: 'flex-start', marginTop: 4 }]}>
                <Text style={modalStyles.courseBadgeText}>{ex.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 6. BROADCAST NOTICE */}
      {activeModal === 'admin_broadcast' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Broadcast official circular to all university students and faculty members.
          </Text>
          <View style={modalStyles.formContainer}>
            <Text style={modalStyles.inputLabel}>CIRCULAR SUBJECT</Text>
            <TextInput
              style={modalStyles.inputBox}
              placeholder="e.g. Schedule for University Annual Convocation"
              placeholderTextColor={COLORS.textLight}
              value={broadcastSubject}
              onChangeText={setBroadcastSubject}
            />
            <Text style={modalStyles.inputLabel}>TARGET RECIPIENTS</Text>
            <View style={modalStyles.filterPillsRow}>
              {['All Students', 'All Faculty', 'HODs & Deans'].map((t, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[modalStyles.smallPill, targetRecipient === t && modalStyles.smallPillActive]}
                  onPress={() => setTargetRecipient(t)}
                >
                  <Text style={[modalStyles.smallPillText, targetRecipient === t && modalStyles.smallPillTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={modalStyles.submitActionBtn}
              onPress={() => {
                const subj = broadcastSubject.trim() || 'University Annual Convocation';
                Alert.alert('Broadcast Dispatched', `Circular "${subj}" broadcasted across all devices to ${targetRecipient}.`);
                setBroadcastSubject('');
              }}
            >
              <Ionicons name="megaphone" size={16} color={COLORS.white} />
              <Text style={modalStyles.submitActionBtnText}>Dispatch University Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statGrid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  statCardHalf: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  statCardHalfValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary
  },
  statCardHalfLabel: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '700'
  },
  programRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  programCourse: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  programYears: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  // Student Roster styles
  filterLabel: {
    fontSize: 10, fontWeight: '800', color: COLORS.textMuted,
    letterSpacing: 0.5, marginBottom: 6, marginTop: 8
  },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  pill: {
    backgroundColor: '#EFF6FF', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#BFDBFE',
    marginRight: 6, marginBottom: 6
  },
  pillActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  pillText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  pillTextActive: { color: '#FFFFFF' },
  deptName: { fontSize: 11.5, color: '#1E40AF', fontWeight: '600', marginBottom: 8 },
  batchBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#D1FAE5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10
  },
  batchBannerText: { fontSize: 11, color: '#065F46', fontWeight: '700', marginLeft: 5, flex: 1 },
  studentListWrap: {
    backgroundColor: '#FFFFFF', borderRadius: 10,
    borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden'
  },
  studentListHead: {
    backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0'
  },
  studentListHeadText: { fontSize: 12, fontWeight: '800', color: '#1E293B' },
  studentRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  studentIdx: { fontSize: 11, fontWeight: '800', color: '#1D4ED8', width: 24 },
  studentName: { fontSize: 12.5, fontWeight: '700', color: '#1E293B' },
  studentId: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 12, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' }
});
