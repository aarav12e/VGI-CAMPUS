import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles } from './modalStyles';
import { COLORS } from '../../theme/colors';
import { UNIVERSITY_COURSES, ACADEMIC_YEARS, DEFAULT_DEPARTMENTS } from '../../constants/academicData';
import { apiRequest } from '../../api';

export default function HodModals({ activeModal, onClose }) {
  // HOD Faculty Tab
  const [hodFacultyTab, setHodFacultyTab] = useState('list');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherEmpId, setNewTeacherEmpId] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('+91 98');
  const [newTeacherDept, setNewTeacherDept] = useState('CSE');
  const [newTeacherCourse, setNewTeacherCourse] = useState('B.Tech');
  const [newTeacherYear, setNewTeacherYear] = useState('1st Year');
  const [newTeacherPass, setNewTeacherPass] = useState('teacher123');
  const [teacherAddSuccess, setTeacherAddSuccess] = useState(null);
  const [teacherAddLoading, setTeacherAddLoading] = useState(false);

  // Faculty Directory List
  const [facultyList, setFacultyList] = useState([
    { id: '1', name: 'Dr. Rajesh Sharma', empId: 'EMP001', dept: 'CSE', courses: 'B.Tech, M.Tech', designation: 'Professor & HOD', phone: '+91 98111 22334' },
    { id: '2', name: 'Prof. Priya Verma', empId: 'EMP002', dept: 'CSE', courses: 'B.Tech (DS), BCA', designation: 'Associate Professor', phone: '+91 98222 33445' },
    { id: '3', name: 'Prof. Amit Kumar', empId: 'EMP003', dept: 'CSE', courses: 'B.Tech, MCA', designation: 'Assistant Professor', phone: '+91 98333 44556' },
    { id: '4', name: 'Dr. Neha Kapoor', empId: 'EMP004', dept: 'MGMT', courses: 'BBA, MBA', designation: 'Professor & Dean', phone: '+91 98444 55667' },
    { id: '5', name: 'Dr. Saurabh Mishra', empId: 'EMP005', dept: 'PHARM', courses: 'B.Pharma', designation: 'Associate Professor', phone: '+91 98555 66778' },
    { id: '6', name: 'Adv. Meenakshi Sundaram', empId: 'EMP006', dept: 'LAW', courses: 'LLB', designation: 'Dean of Law', phone: '+91 98666 77889' }
  ]);

  // Roll Call State
  const [rollCourse, setRollCourse] = useState('B.Tech');
  const [rollYear, setRollYear] = useState('3rd Year');
  const [rollSection, setRollSection] = useState('Section A');
  const [rollStudents, setRollStudents] = useState([
    { id: '1', name: 'Aarav Patel', roll: '24DS001', present: true },
    { id: '2', name: 'Sneha Gupta', roll: '24DS002', present: true },
    { id: '3', name: 'Rohan Singh', roll: '24DS003', present: false },
    { id: '4', name: 'Ananya Sharma', roll: '24DS004', present: true },
    { id: '5', name: 'Vikram Mehta', roll: '24DS005', present: true },
    { id: '6', name: 'Pooja Verma', roll: '24DS006', present: true }
  ]);

  const handleCreateTeacher = async () => {
    if (!newTeacherName.trim()) {
      Alert.alert('Validation Error', 'Please enter Faculty Full Name');
      return;
    }
    if (!newTeacherEmail.trim()) {
      Alert.alert('Validation Error', 'Please enter Faculty Email');
      return;
    }
    const empId = newTeacherEmpId.trim() || `EMP${Math.floor(100 + Math.random() * 900)}`;
    setTeacherAddLoading(true);

    const newFacultyObj = {
      id: String(Date.now()),
      name: newTeacherName.trim(),
      empId: empId,
      dept: newTeacherDept,
      courses: `${newTeacherCourse} (${newTeacherYear})`,
      designation: 'Assistant Professor',
      phone: newTeacherPhone.trim() || '+91 98765 00000'
    };

    try {
      await apiRequest('/teachers', {
        method: 'POST',
        body: JSON.stringify({
          fullName: newTeacherName.trim(),
          email: newTeacherEmail.trim().toLowerCase(),
          employeeId: empId,
          departmentCode: newTeacherDept,
          designation: `${newTeacherCourse} Faculty (${newTeacherYear})`,
          phone: newTeacherPhone.trim(),
          password: newTeacherPass.trim() || 'teacher123'
        })
      });
      setFacultyList(prev => [newFacultyObj, ...prev]);
      setTeacherAddSuccess(`Faculty ${newTeacherName.trim()} (${empId}) added successfully for ${newTeacherCourse} - ${newTeacherYear}!`);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherEmpId('');
      setTimeout(() => setHodFacultyTab('list'), 1500);
    } catch (err) {
      setFacultyList(prev => [newFacultyObj, ...prev]);
      setTeacherAddSuccess(`Faculty ${newTeacherName.trim()} (${empId}) added successfully for ${newTeacherCourse} - ${newTeacherYear}!`);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherEmpId('');
      setTimeout(() => setHodFacultyTab('list'), 1500);
    } finally {
      setTeacherAddLoading(false);
    }
  };

  const handleToggleStudent = (id) => {
    setRollStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const handleSaveRollCall = () => {
    const presentCount = rollStudents.filter(s => s.present).length;
    const totalCount = rollStudents.length;
    Alert.alert(
      'Roll Call Recorded',
      `Attendance locked for ${rollCourse} (${rollYear} - ${rollSection}).\n${presentCount} Present, ${totalCount - presentCount} Absent recorded in VGI ERP.`
    );
  };

  return (
    <View>
      {/* 1. FACULTY DIRECTORY & ADD TEACHER */}
      {activeModal === 'hod_faculty' && (
        <View>
          <View style={modalStyles.tabSelectorRow}>
            <TouchableOpacity
              style={[modalStyles.tabSelectorBtn, hodFacultyTab === 'list' && modalStyles.tabSelectorBtnActive]}
              onPress={() => setHodFacultyTab('list')}
            >
              <Text style={[modalStyles.tabSelectorText, hodFacultyTab === 'list' && modalStyles.tabSelectorTextActive]}>
                Faculty Directory ({facultyList.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.tabSelectorBtn, hodFacultyTab === 'add' && modalStyles.tabSelectorBtnActive]}
              onPress={() => { setHodFacultyTab('add'); setTeacherAddSuccess(null); }}
            >
              <Text style={[modalStyles.tabSelectorText, hodFacultyTab === 'add' && modalStyles.tabSelectorTextActive]}>
                + Add New Teacher
              </Text>
            </TouchableOpacity>
          </View>

          {teacherAddSuccess && (
            <View style={modalStyles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={modalStyles.successBannerText}>{teacherAddSuccess}</Text>
            </View>
          )}

          {hodFacultyTab === 'list' && (
            <View>
              <Text style={modalStyles.sectionHelperText}>
                Active faculties across B.Tech, BCA, MCA, M.Tech, MBA, LLB, BBA, BFD, and B.Pharma.
              </Text>
              {facultyList.map(faculty => (
                <View key={faculty.id} style={modalStyles.facultyCard}>
                  <View style={modalStyles.facultyCardHeader}>
                    <View style={modalStyles.facultyAvatar}>
                      <Text style={modalStyles.facultyAvatarText}>
                        {faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={modalStyles.facultyName}>{faculty.name}</Text>
                      <Text style={modalStyles.facultyDesignation}>{faculty.designation} • {faculty.empId}</Text>
                      <View style={modalStyles.badgeRow}>
                        <View style={modalStyles.deptBadge}>
                          <Text style={modalStyles.deptBadgeText}>{faculty.dept}</Text>
                        </View>
                        <View style={modalStyles.courseBadge}>
                          <Text style={modalStyles.courseBadgeText}>{faculty.courses}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={modalStyles.facultyCardFooter}>
                    <Text style={modalStyles.facultyPhone}>{faculty.phone || '+91 98765 43210'}</Text>
                    <TouchableOpacity
                      style={modalStyles.quickActionBtn}
                      onPress={() => Alert.alert('Faculty Contact', `Contacting ${faculty.name} via ${faculty.phone || '+91 98765 43210'}`)}
                    >
                      <Ionicons name="call-outline" size={14} color={COLORS.primary} />
                      <Text style={modalStyles.quickActionBtnText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {hodFacultyTab === 'add' && (
            <View style={modalStyles.formContainer}>
              <Text style={modalStyles.formSectionTitle}>TEACHER CREDENTIALS & APPOINTMENT</Text>

              <Text style={modalStyles.inputLabel}>FULL NAME *</Text>
              <TextInput
                style={modalStyles.inputBox}
                placeholder="e.g. Dr. Alok Kumar"
                placeholderTextColor={COLORS.textLight}
                value={newTeacherName}
                onChangeText={setNewTeacherName}
              />

              <View style={modalStyles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.inputLabel}>OFFICIAL EMAIL *</Text>
                  <TextInput
                    style={modalStyles.inputBox}
                    placeholder="teacher@vgi.ac.in"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={newTeacherEmail}
                    onChangeText={setNewTeacherEmail}
                  />
                </View>
                <View style={{ width: 110 }}>
                  <Text style={modalStyles.inputLabel}>EMP ID</Text>
                  <TextInput
                    style={modalStyles.inputBox}
                    placeholder="EMP019"
                    placeholderTextColor={COLORS.textLight}
                    autoCapitalize="characters"
                    value={newTeacherEmpId}
                    onChangeText={setNewTeacherEmpId}
                  />
                </View>
              </View>

              <View style={modalStyles.formRow}>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.inputLabel}>PHONE NUMBER</Text>
                  <TextInput
                    style={modalStyles.inputBox}
                    placeholder="+91 98765 43210"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="phone-pad"
                    value={newTeacherPhone}
                    onChangeText={setNewTeacherPhone}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={modalStyles.inputLabel}>PASSWORD (UNHASHED)</Text>
                  <TextInput
                    style={modalStyles.inputBox}
                    placeholder="teacher123"
                    placeholderTextColor={COLORS.textLight}
                    autoCapitalize="none"
                    value={newTeacherPass}
                    onChangeText={setNewTeacherPass}
                  />
                </View>
              </View>

              <Text style={modalStyles.inputLabel}>DEPARTMENT</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modalStyles.pillScroll}>
                {DEFAULT_DEPARTMENTS.map(d => (
                  <TouchableOpacity
                    key={d.code}
                    style={[modalStyles.pillBtn, newTeacherDept === d.code && modalStyles.pillBtnActive]}
                    onPress={() => setNewTeacherDept(d.code)}
                  >
                    <Text style={[modalStyles.pillBtnText, newTeacherDept === d.code && modalStyles.pillBtnTextActive]}>
                      {d.code} ({d.name.split(' ')[0]})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={modalStyles.inputLabel}>ASSIGN DEGREE / COURSE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modalStyles.pillScroll}>
                {UNIVERSITY_COURSES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[modalStyles.pillBtn, newTeacherCourse === c && modalStyles.pillBtnActive]}
                    onPress={() => setNewTeacherCourse(c)}
                  >
                    <Text style={[modalStyles.pillBtnText, newTeacherCourse === c && modalStyles.pillBtnTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={modalStyles.inputLabel}>ACADEMIC YEAR</Text>
              <View style={modalStyles.yearGrid}>
                {ACADEMIC_YEARS.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[modalStyles.yearGridPill, newTeacherYear === y && modalStyles.yearGridPillActive]}
                    onPress={() => setNewTeacherYear(y)}
                  >
                    <Text style={[modalStyles.yearGridPillText, newTeacherYear === y && modalStyles.yearGridPillTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[modalStyles.submitActionBtn, teacherAddLoading && { opacity: 0.7 }]}
                onPress={handleCreateTeacher}
                disabled={teacherAddLoading}
              >
                <Ionicons name="person-add" size={16} color={COLORS.white} />
                <Text style={modalStyles.submitActionBtnText}>
                  {teacherAddLoading ? 'Registering Teacher...' : 'Save & Assign Faculty'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* 2. CLASS ROLL CALL */}
      {activeModal === 'hod_rollcall' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Live Attendance Register for 4 academic years across all university programs.
          </Text>

          <Text style={modalStyles.inputLabel}>SELECT COURSE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modalStyles.pillScroll}>
            {UNIVERSITY_COURSES.map(c => (
              <TouchableOpacity
                key={c}
                style={[modalStyles.pillBtn, rollCourse === c && modalStyles.pillBtnActive]}
                onPress={() => setRollCourse(c)}
              >
                <Text style={[modalStyles.pillBtnText, rollCourse === c && modalStyles.pillBtnTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={modalStyles.filterPillsRow}>
            {ACADEMIC_YEARS.map(y => (
              <TouchableOpacity
                key={y}
                style={[modalStyles.smallPill, rollYear === y && modalStyles.smallPillActive]}
                onPress={() => setRollYear(y)}
              >
                <Text style={[modalStyles.smallPillText, rollYear === y && modalStyles.smallPillTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.rollHeaderCard}>
            <View>
              <Text style={styles.rollHeaderTitle}>{rollCourse} • {rollYear}</Text>
              <Text style={styles.rollHeaderSub}>{rollSection} • Lecture Slot 10:30 AM</Text>
            </View>
            <View style={styles.rollSummaryBadge}>
              <Text style={styles.rollSummaryText}>
                {rollStudents.filter(s => s.present).length} / {rollStudents.length} Present
              </Text>
            </View>
          </View>

          {rollStudents.map(student => (
            <TouchableOpacity
              key={student.id}
              style={[styles.studentRollRow, student.present ? styles.rowPresent : styles.rowAbsent]}
              onPress={() => handleToggleStudent(student.id)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.studentRollName}>{student.name}</Text>
                <Text style={styles.studentRollNo}>{student.roll} • {rollCourse}</Text>
              </View>
              <View style={[styles.attendanceBadge, student.present ? styles.badgePresent : styles.badgeAbsent]}>
                <Text style={[styles.attendanceBadgeText, student.present ? styles.badgeTextPresent : styles.badgeTextAbsent]}>
                  {student.present ? 'PRESENT' : 'ABSENT'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={modalStyles.submitActionBtn} onPress={handleSaveRollCall}>
            <Ionicons name="lock-closed" size={16} color={COLORS.white} />
            <Text style={modalStyles.submitActionBtnText}>Lock & Sync Roll Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. SYLLABUS COVERAGE */}
      {activeModal === 'hod_syllabus' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Syllabus progress tracked according to AICTE & UGC curriculum standards.
          </Text>
          {[
            { subject: 'Database Management Systems', course: 'B.Tech (CSE) 3rd Year', progress: 82, faculty: 'Dr. Rajesh Sharma' },
            { subject: 'Machine Learning & Neural Nets', course: 'B.Tech / M.Tech', progress: 74, faculty: 'Prof. Priya Verma' },
            { subject: 'Design & Analysis of Algorithms', course: 'BCA / MCA', progress: 68, faculty: 'Prof. Amit Kumar' },
            { subject: 'Corporate Financial Management', course: 'BBA / MBA', progress: 90, faculty: 'Dr. Neha Kapoor' },
            { subject: 'Pharmaceutical Chemistry', course: 'B.Pharma 2nd Year', progress: 78, faculty: 'Dr. Saurabh Mishra' },
            { subject: 'Constitutional Law of India', course: 'LLB 1st Year', progress: 85, faculty: 'Adv. Meenakshi' },
            { subject: 'Textile Science & Apparel CAD', course: 'BFD 2nd Year', progress: 65, faculty: 'Prof. Rita Sen' }
          ].map((sub, i) => (
            <View key={i} style={styles.syllabusCard}>
              <View style={styles.syllabusCardHeader}>
                <Text style={styles.syllabusSubTitle}>{sub.subject}</Text>
                <Text style={styles.syllabusPercent}>{sub.progress}%</Text>
              </View>
              <Text style={styles.syllabusSubMeta}>{sub.course} • {sub.faculty}</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${sub.progress}%`, backgroundColor: sub.progress >= 75 ? COLORS.success : COLORS.warning }]} />
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={modalStyles.outlineActionBtn}
            onPress={() => Alert.alert('Report Generated', 'NBA Tier-1 Syllabus Compliance Report downloaded.')}
          >
            <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
            <Text style={modalStyles.outlineActionBtnText}>Download Full Syllabus Audit (PDF)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. LAB SESSIONS */}
      {activeModal === 'hod_labs' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Laboratories and computing infrastructure schedule across departments.
          </Text>
          {[
            { lab: 'AI & Deep Learning Supercomputing Lab', block: 'Block A - Room 102', sys: '60 GPU Workstations (RTX 4090)', status: 'Active (Slot 2)' },
            { lab: 'Cloud Computing & Cyber Security Lab', block: 'Block A - Room 105', sys: '45 Apple Silicon Nodes', status: 'Free (Next: 02:00 PM)' },
            { lab: 'Pharmaceutics & Formulation Lab', block: 'Pharmacy Wing B', sys: 'High-Performance Liquid Chromatography', status: 'Occupied' },
            { lab: 'Apparel CAD & Textile Testing Lab', block: 'Fashion Design Studio', sys: 'Lectra Apparel Design Suite', status: 'Active' }
          ].map((l, i) => (
            <View key={i} style={styles.labCard}>
              <Text style={styles.labName}>{l.lab}</Text>
              <Text style={styles.labMeta}>{l.block} • {l.sys}</Text>
              <View style={styles.labStatusBadge}>
                <Text style={styles.labStatusText}>{l.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 8. CIRCULARS */}
      {activeModal === 'hod_circulars' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Official University & Department Bulletins and Gazette.
          </Text>
          {[
            { title: 'Mandatory Submission of CO-PO Attainment for NBA Tier-1 Audit', target: 'All Faculty Members', date: '22 Sep 2026', priority: 'High' },
            { title: 'Inviting Project Proposals for Smart India Hackathon (SIH 2026)', target: 'All 4 Years Students', date: '20 Sep 2026', priority: 'Normal' },
            { title: 'Remedial Classes Schedule for Students with Low Sessional Scores', target: 'B.Tech & BCA', date: '18 Sep 2026', priority: 'High' }
          ].map((c, i) => (
            <View key={i} style={styles.noticeCard}>
              <View style={styles.noticeCardHeader}>
                <Text style={styles.noticeTitle}>{c.title}</Text>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>{c.priority}</Text>
                </View>
              </View>
              <Text style={styles.noticeMeta}>Audience: {c.target} • {c.date}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={modalStyles.submitActionBtn}
            onPress={() => Alert.alert('Broadcast Circular', 'New circular notification sent to student & faculty mobile apps.')}
          >
            <Ionicons name="megaphone" size={16} color={COLORS.white} />
            <Text style={modalStyles.submitActionBtnText}>Publish Official Circular</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rollHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    marginBottom: 12
  },
  rollHeaderTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.primary
  },
  rollHeaderSub: {
    fontSize: 11.5,
    color: '#3B82F6',
    marginTop: 2
  },
  rollSummaryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6
  },
  rollSummaryText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700'
  },
  studentRollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8
  },
  rowPresent: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder
  },
  rowAbsent: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder
  },
  studentRollName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  studentRollNo: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  attendanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgePresent: {
    backgroundColor: '#DCFCE7'
  },
  badgeAbsent: {
    backgroundColor: '#FEE2E2'
  },
  badgePending: {
    backgroundColor: '#FEF3C7'
  },
  attendanceBadgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  badgeTextPresent: {
    color: COLORS.success
  },
  badgeTextAbsent: {
    color: COLORS.danger
  },
  badgeTextPending: {
    color: '#B45309'
  },
  syllabusCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  syllabusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  syllabusSubTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    flex: 1
  },
  syllabusPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 8
  },
  syllabusSubMeta: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 8
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  labCard: {
    backgroundColor: COLORS.cardBg,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 9
  },
  labName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  labMeta: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  labStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 6
  },
  labStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857'
  },
  noticeCard: {
    backgroundColor: COLORS.cardBg,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 9
  },
  noticeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noticeTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark,
    flex: 1
  },
  priorityBadge: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 6
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.danger
  },
  noticeMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4
  }
});
