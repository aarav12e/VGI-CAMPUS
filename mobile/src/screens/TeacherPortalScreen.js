import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { apiRequest } from '../api';
import { broadcastAttendanceSession } from '../services/attendanceSync';
import { getAllTimetableSlots, subscribeToTimetable } from '../services/academicSync';
import DropdownSelect from '../components/DropdownSelect';

// Departments & Programs
const COLLEGE_DEPARTMENTS = [
  {
    code: 'CA',
    shortName: 'BCA',
    name: 'Computer Applications',
    courseName: 'BCA (Bachelor of Computer Applications)',
    hodName: 'Dr. Sunita Rao',
    semesters: [1, 2, 3, 4, 5, 6],
    subjectsBySem: {
      3: [
        { code: 'BCA301', name: 'Database Management Systems' },
        { code: 'BCA302', name: 'Web Technologies & PHP' },
        { code: 'BCA303', name: 'Data Structures using C++' },
        { code: 'BCA304', name: 'Computer Architecture' }
      ],
      1: [
        { code: 'BCA101', name: 'Programming in C' },
        { code: 'BCA102', name: 'Digital Electronics' }
      ],
      5: [
        { code: 'BCA501', name: 'Java Programming' },
        { code: 'BCA502', name: 'Cloud Computing' }
      ]
    }
  },
  {
    code: 'CSE',
    shortName: 'B.Tech CSE',
    name: 'Computer Science & Engineering',
    courseName: 'B.Tech CSE & Data Science',
    hodName: 'Dr. Rajesh Sharma',
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    subjectsBySem: {
      5: [
        { code: 'BCS501', name: 'Database Management Systems' },
        { code: 'BCS502', name: 'Operating Systems' },
        { code: 'BCS503', name: 'Design & Analysis of Algorithms' },
        { code: 'BCS504', name: 'Machine Learning Foundations' }
      ],
      3: [
        { code: 'BCS301', name: 'Data Structures & Algorithms' },
        { code: 'BCS302', name: 'Discrete Mathematics' }
      ]
    }
  },
  {
    code: 'PHARM',
    shortName: 'B.Pharma',
    name: 'Pharmaceutical Sciences',
    courseName: 'B.Pharma (Pharmacy)',
    hodName: 'Dr. Anjali Mehta',
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    subjectsBySem: {
      3: [
        { code: 'BP301T', name: 'Pharmaceutical Organic Chemistry II' },
        { code: 'BP302T', name: 'Physical Pharmaceutics I' },
        { code: 'BP303T', name: 'Pharmaceutical Microbiology' }
      ]
    }
  },
  {
    code: 'MGMT',
    shortName: 'BBA',
    name: 'Management Studies',
    courseName: 'BBA (Bachelor of Business Admin)',
    hodName: 'Dr. Vikram Kapoor',
    semesters: [1, 2, 3, 4, 5, 6],
    subjectsBySem: {
      3: [
        { code: 'BBA301', name: 'Financial Management' },
        { code: 'BBA302', name: 'Marketing Strategies' },
        { code: 'BBA303', name: 'Organizational Behavior' }
      ]
    }
  }
];

const TIME_SLOTS = [
  '09:00 - 10:00 AM (1 hr)',
  '10:15 - 11:15 AM (1 hr)',
  '11:30 - 12:30 PM (1 hr)',
  '01:30 - 02:30 PM (1 hr)',
  '02:30 - 04:00 PM (1.5 hr Lab)'
];

// Isolated Student Cohorts by Course_Semester_Section
const INITIAL_STUDENT_ROSTERS = {
  // BCA Semester 3 Section C
  'CA_3_Section C': [
    { id: 'bca-c-1', name: 'Amit Sharma', roll: '24BCA011', present: true },
    { id: 'bca-c-2', name: 'Neha Verma', roll: '24BCA012', present: true },
    { id: 'bca-c-3', name: 'Kunal Jain', roll: '24BCA013', present: true },
    { id: 'bca-c-4', name: 'Priya Dixit', roll: '24BCA014', present: true },
    { id: 'bca-c-5', name: 'Harsh Vardhan', roll: '24BCA015', present: false }
  ],
  'CA_3_Section A': [
    { id: 'bca-a-1', name: 'Rohan Rastogi', roll: '24BCA001', present: true },
    { id: 'bca-a-2', name: 'Shreya Sen', roll: '24BCA002', present: true },
    { id: 'bca-a-3', name: 'Gaurav Mishra', roll: '24BCA003', present: true }
  ],
  'CA_3_Section B': [
    { id: 'bca-b-1', name: 'Manish Tiwary', roll: '24BCA006', present: true },
    { id: 'bca-b-2', name: 'Anjali Saxena', roll: '24BCA007', present: true }
  ],
  // B.Tech CSE Semester 5 Section A
  'CSE_5_Section A': [
    { id: 'eb9a6d84-090d-478b-8684-83e008476448', name: 'Aarav Patel', roll: '24DS001', present: true },
    { id: 'stud-sneha', name: 'Sneha Gupta', roll: '24DS002', present: true },
    { id: 'stud-rohan', name: 'Rohan Singh', roll: '24DS003', present: false },
    { id: 'stud-ananya', name: 'Ananya Sharma', roll: '24DS004', present: true },
    { id: 'stud-vikram', name: 'Vikram Mehta', roll: '24DS005', present: true },
    { id: 'stud-pooja', name: 'Pooja Verma', roll: '24DS006', present: true },
    { id: 'stud-aditya', name: 'Aditya Rao', roll: '24DS007', present: true },
    { id: 'stud-meera', name: 'Meera Nair', roll: '24DS008', present: false }
  ],
  'CSE_5_Section B': [
    { id: 'cse-b-1', name: 'Tanishq Mehra', roll: '24CSE041', present: true },
    { id: 'cse-b-2', name: 'Divya Agarwal', roll: '24CSE042', present: true }
  ],
  // B.Pharma Semester 3 Section A
  'PHARM_3_Section A': [
    { id: 'ph-a-1', name: 'Rahul Verma', roll: '24PH001', present: true },
    { id: 'ph-a-2', name: 'Simran Kaur', roll: '24PH002', present: true },
    { id: 'ph-a-3', name: 'Tanmay Bhatia', roll: '24PH003', present: true },
    { id: 'ph-a-4', name: 'Pallavi Joshi', roll: '24PH004', present: false }
  ],
  // BBA Semester 3 Section A
  'MGMT_3_Section A': [
    { id: 'bba-a-1', name: 'Rohan Bajaj', roll: '24BBA001', present: true },
    { id: 'bba-a-2', name: 'Tanya Sethi', roll: '24BBA002', present: true },
    { id: 'bba-a-3', name: 'Ayush Mathur', roll: '24BBA003', present: true }
  ]
};

export default function TeacherPortalScreen({ currentUser, initialTab = 'attendance' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'attendance'); // 'attendance' | 'schedule' | 'history'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Selection states
  const [selectedDeptCode, setSelectedDeptCode] = useState('CA');
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [sectionsList, setSectionsList] = useState(['Section A', 'Section B', 'Section C']);
  const [selectedSection, setSelectedSection] = useState('Section C');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCA301');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [lectureTopic, setLectureTopic] = useState('Relational Normalization & SQL Queries');

  // Modals & Submissions
  const [rosters, setRosters] = useState(INITIAL_STUDENT_ROSTERS);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('Section D');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');

  // Daily Timetable State
  const [scheduleDay, setScheduleDay] = useState('All');
  const [timetableSlots, setTimetableSlots] = useState(() => getAllTimetableSlots());

  useEffect(() => {
    const unsub = subscribeToTimetable(() => {
      setTimetableSlots(getAllTimetableSlots());
    });
    return () => unsub();
  }, []);

  const currentDept = COLLEGE_DEPARTMENTS.find(d => d.code === selectedDeptCode) || COLLEGE_DEPARTMENTS[0];
  const availableSubjects = currentDept.subjectsBySem[selectedSemester] || currentDept.subjectsBySem[3] || [
    { code: `${selectedDeptCode}301`, name: 'Core Foundations' }
  ];
  const currentSubject = availableSubjects.find(s => s.code === selectedSubjectCode) || availableSubjects[0];

  // Strictly isolated cohort key
  const rosterKey = `${selectedDeptCode}_${selectedSemester}_${selectedSection}`;
  const currentRoster = rosters[rosterKey] || [
    { id: `stud-dyn-1`, name: 'Class Student 1', roll: `${selectedDeptCode}01`, present: true },
    { id: `stud-dyn-2`, name: 'Class Student 2', roll: `${selectedDeptCode}02`, present: true }
  ];

  useEffect(() => {
    if (availableSubjects.length > 0) {
      setSelectedSubjectCode(availableSubjects[0].code);
    }
  }, [selectedDeptCode, selectedSemester]);

  const toggleStudent = (id) => {
    setRosters(prev => {
      const list = prev[rosterKey] || currentRoster;
      const updated = list.map(s => (s.id === id ? { ...s, present: !s.present } : s));
      return { ...prev, [rosterKey]: updated };
    });
  };

  const markAll = (status) => {
    setRosters(prev => {
      const list = prev[rosterKey] || currentRoster;
      const updated = list.map(s => ({ ...s, present: status }));
      return { ...prev, [rosterKey]: updated };
    });
  };

  const totalCount = currentRoster.length;
  const presentCount = currentRoster.filter(s => s.present).length;
  const absentCount = totalCount - presentCount;
  const attendancePct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) return;
    const name = newSectionName.trim();
    if (!sectionsList.includes(name)) {
      setSectionsList(prev => [...prev, name]);
    }
    setSelectedSection(name);
    setShowAddSectionModal(false);

    try {
      await apiRequest('/academic/sections', {
        method: 'POST',
        body: JSON.stringify({
          name,
          programCode: selectedDeptCode === 'CA' ? 'BCA' : selectedDeptCode,
          semesterNumber: selectedSemester,
          capacity: 60
        })
      });
    } catch (e) {}
  };

  const handleAddStudentToSection = () => {
    if (!newStudentName.trim() || !newStudentRoll.trim()) return;
    const newStud = {
      id: 'stud-' + Date.now(),
      name: newStudentName.trim(),
      roll: newStudentRoll.trim().toUpperCase(),
      present: true
    };
    setRosters(prev => {
      const list = prev[rosterKey] || currentRoster;
      return { ...prev, [rosterKey]: [...list, newStud] };
    });
    setNewStudentName('');
    setNewStudentRoll('');
    setShowAddStudentModal(false);
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    setSubmitSuccessMsg(null);

    const payload = {
      courseCode: selectedDeptCode,
      courseName: currentDept.courseName,
      semester: selectedSemester,
      section: selectedSection,
      subjectCode: currentSubject.code,
      subjectName: currentSubject.name,
      timeSlot: selectedTimeSlot,
      topic: lectureTopic || 'Classroom Lecture',
      markedBy: currentUser?.name || `${currentDept.hodName} (HOD & Faculty)`,
      records: currentRoster.map(s => ({
        studentId: s.id,
        name: s.name,
        roll: s.roll,
        isPresent: s.present,
        remarks: s.present ? 'Attended' : 'Absent'
      }))
    };

    try {
      await apiRequest('/attendance/sessions', {
        method: 'POST',
        body: JSON.stringify({
          subjectId: currentSubject.code,
          sectionId: `${selectedDeptCode}-${selectedSection}`,
          date: new Date().toISOString().split('T')[0],
          topic: lectureTopic,
          slot: selectedTimeSlot,
          records: payload.records
        })
      });
    } catch (err) {}

    // Broadcast live so Student app updates instantaneously
    broadcastAttendanceSession(payload);

    setSubmitSuccessMsg(
      `Attendance recorded: ${currentDept.shortName} ${selectedSection} (${presentCount}/${totalCount} Present). Synced to Student & Parent apps.`
    );
    setSubmitting(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Modern Segmented Control Bar */}
      <View style={styles.segmentContainer}>
        {[
          { key: 'attendance', label: 'Roll-Call', icon: 'clipboard-outline' },
          { key: 'schedule', label: 'Schedule', icon: 'calendar-outline' },
          { key: 'history', label: 'Past Logs', icon: 'time-outline' }
        ].map(t => {
          const isActive = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
              onPress={() => setActiveTab(t.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={t.icon}
                size={14}
                color={isActive ? '#FFFFFF' : '#475569'}
              />
              <Text
                style={[styles.segmentBtnText, isActive && styles.segmentBtnTextActive]}
                numberOfLines={1}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB 1: ATTENDANCE ROLL-CALL */}
      {activeTab === 'attendance' && (
        <View>
          {/* CONSOLIDATED SESSION CONFIG CARD */}
          <View style={styles.configCard}>
            {/* Dropdown 1: Course / Department */}
            <DropdownSelect
              label="ACADEMIC DEPARTMENT & COURSE"
              value={selectedDeptCode}
              options={COLLEGE_DEPARTMENTS.map(d => ({
                label: `${d.shortName} (${d.name})`,
                value: d.code,
                subtitle: `Assigned HOD: ${d.hodName}`
              }))}
              onSelect={(val) => setSelectedDeptCode(val)}
              icon="school-outline"
            />

            {/* Dropdowns 2 & 3: Semester & Section (Side-by-Side) */}
            <View style={styles.rowTwoCols}>
              <View style={{ flex: 1 }}>
                <DropdownSelect
                  label="SEMESTER"
                  value={selectedSemester}
                  options={currentDept.semesters.map(s => ({
                    label: `Semester ${s}`,
                    value: s
                  }))}
                  onSelect={(val) => setSelectedSemester(val)}
                  icon="calendar-outline"
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={styles.configLabel}>SECTION</Text>
                  <TouchableOpacity
                    onPress={() => setShowAddSectionModal(true)}
                    style={styles.inlineAddBtn}
                  >
                    <Text style={styles.inlineAddBtnText}>+ New Sec</Text>
                  </TouchableOpacity>
                </View>
                <DropdownSelect
                  value={selectedSection}
                  options={sectionsList.map(sec => ({
                    label: sec,
                    value: sec
                  }))}
                  onSelect={(val) => setSelectedSection(val)}
                  icon="layers-outline"
                />
              </View>
            </View>

            {/* Dropdown 4: Subject */}
            <DropdownSelect
              label="CLASS / SUBJECT"
              value={selectedSubjectCode}
              options={availableSubjects.map(sub => ({
                label: `${sub.code} — ${sub.name}`,
                value: sub.code
              }))}
              onSelect={(val) => setSelectedSubjectCode(val)}
              icon="book-outline"
            />

            {/* Dropdown 5: Time Duration */}
            <DropdownSelect
              label="TIME DURATION"
              value={selectedTimeSlot}
              options={TIME_SLOTS.map(slot => ({
                label: slot,
                value: slot
              }))}
              onSelect={(val) => setSelectedTimeSlot(val)}
              icon="time-outline"
            />

            {/* Lecture Topic Input */}
            <View style={styles.topicInputRow}>
              <Ionicons name="pencil-outline" size={14} color="#94A3B8" />
              <TextInput
                style={styles.topicInput}
                value={lectureTopic}
                onChangeText={setLectureTopic}
                placeholder="Lecture / lab topic covered today..."
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* STUDENT ATTENDANCE ROSTER (STRICT ISOLATION) */}
          <View style={styles.rosterCard}>
            {/* Header with Title & Quick Add Student */}
            <View style={styles.rosterHeader}>
              <View>
                <Text style={styles.rosterTitle}>
                  {currentDept.shortName} Sem {selectedSemester} • {selectedSection}
                </Text>
                <Text style={styles.rosterSub}>
                  {totalCount} enrolled students • Zero cross-course collision
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addStudentBtn}
                onPress={() => setShowAddStudentModal(true)}
              >
                <Ionicons name="person-add" size={12} color="#059669" />
                <Text style={styles.addStudentBtnText}>+ Student</Text>
              </TouchableOpacity>
            </View>

            {/* Turnout KPI Strip */}
            <View style={styles.kpiStrip}>
              <View style={styles.kpiCol}>
                <Text style={styles.kpiValue}>{totalCount}</Text>
                <Text style={styles.kpiLabel}>TOTAL</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiCol}>
                <Text style={[styles.kpiValue, { color: '#059669' }]}>{presentCount}</Text>
                <Text style={styles.kpiLabel}>PRESENT</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiCol}>
                <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{absentCount}</Text>
                <Text style={styles.kpiLabel}>ABSENT</Text>
              </View>
              <View style={styles.kpiDivider} />
              <View style={styles.kpiCol}>
                <Text style={[styles.kpiValue, { color: '#2563EB' }]}>{attendancePct}%</Text>
                <Text style={styles.kpiLabel}>TURNOUT</Text>
              </View>
            </View>

            {/* Quick Bulk Toggle Bar */}
            <View style={styles.bulkRow}>
              <TouchableOpacity style={styles.bulkPill} onPress={() => markAll(true)}>
                <Ionicons name="checkmark-done" size={13} color="#059669" />
                <Text style={[styles.bulkPillText, { color: '#059669' }]}>Mark All Present</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bulkPill} onPress={() => markAll(false)}>
                <Ionicons name="close" size={13} color="#DC2626" />
                <Text style={[styles.bulkPillText, { color: '#DC2626' }]}>Mark All Absent</Text>
              </TouchableOpacity>
            </View>

            {submitSuccessMsg && (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.successBoxText}>{submitSuccessMsg}</Text>
              </View>
            )}

            {/* Clean Student Cards List */}
            <View style={{ gap: 7, marginTop: 4 }}>
              {currentRoster.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={[styles.studentCard, student.present ? styles.studentPresent : styles.studentAbsent]}
                  onPress={() => toggleStudent(student.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.studentLeft}>
                    <View style={[styles.initialsCircle, student.present ? styles.initialsPresent : styles.initialsAbsent]}>
                      <Text style={[styles.initialsText, student.present ? { color: '#059669' } : { color: '#DC2626' }]}>
                        {student.name[0]}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentRoll}>{student.roll} • {selectedSection}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusTag, student.present ? styles.statusTagPresent : styles.statusTagAbsent]}>
                    <Ionicons
                      name={student.present ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={student.present ? "#059669" : "#DC2626"}
                    />
                    <Text style={[styles.statusTagText, student.present ? { color: '#059669' } : { color: '#DC2626' }]}>
                      {student.present ? 'PRESENT' : 'ABSENT'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lock & Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              onPress={handleSubmitAttendance}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={17} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>
                    Lock & Submit Attendance ({presentCount}/{totalCount})
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* TAB 2: TODAY'S SCHEDULE (SYNCHRONIZED WITH HOD) */}
      {activeTab === 'schedule' && (
        <View style={styles.contentBox}>
          <Text style={styles.boxTitle}>Department Lecture Schedule</Text>
          <Text style={styles.boxSubtitle}>Set daily a day before by HOD for all faculty slots & classes.</Text>

          {/* Day Filter Chips (No horizontal scroll, wrap cleanly) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 8 }}>
            {['All', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'].map(d => {
              const isSel = scheduleDay === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dayChip,
                    isSel && styles.dayChipActive
                  ]}
                  onPress={() => setScheduleDay(d)}
                >
                  <Text style={[styles.dayChipText, isSel && styles.dayChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ gap: 8, marginTop: 4 }}>
            {(() => {
              const displayed = scheduleDay === 'All' 
                ? timetableSlots 
                : timetableSlots.filter(s => s.day?.toLowerCase() === scheduleDay.toLowerCase());

              if (displayed.length === 0) {
                return (
                  <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10 }}>
                    <Ionicons name="calendar-outline" size={28} color="#94A3B8" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 6 }}>No Lectures Scheduled</Text>
                    <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      No classes published for {scheduleDay}.
                    </Text>
                  </View>
                );
              }

              return displayed.map((item, idx) => (
                <View key={item.id || idx} style={styles.scheduleItem}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>{item.time.split(' - ')[0]}</Text>
                    <Text style={styles.slotSub}>{item.day ? item.day.substring(0, 3) : `Slot ${idx + 1}`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={styles.itemTitle}>{item.subject} ({item.code})</Text>
                      {item.isHodTeaching && (
                        <View style={{ backgroundColor: '#EDE9FE', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                          <Text style={{ fontSize: 9.5, fontWeight: '800', color: '#6D28D9' }}>HOD Teaching (Self)</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.itemMeta}>
                      {item.course || ''} • {item.section} • {item.isHodTeaching ? 'Taught by HOD' : item.faculty}
                    </Text>
                    {item.dateScheduled ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <Ionicons name="checkmark-circle" size={10} color="#059669" />
                        <Text style={{ fontSize: 9.5, color: '#059669', fontWeight: '600' }}>
                          {item.dateScheduled}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <View style={styles.roomTag}>
                      <Text style={styles.roomTagText}>{item.room}</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#EEF2FF',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#C7D2FE'
                      }}
                      onPress={() => {
                        if (item.section) setSelectedSection(item.section);
                        if (item.code) setSelectedSubjectCode(item.code);
                        setActiveTab('attendance');
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#4338CA' }}>Roll-Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ));
            })()}
          </View>
        </View>
      )}

      {/* TAB 3: COMPLETED LOGS */}
      {activeTab === 'history' && (
        <View style={styles.contentBox}>
          <Text style={styles.boxTitle}>Completed Roll-Call Sessions</Text>
          <Text style={styles.boxSubtitle}>Synchronized live with Student & Parent Mobile ERP.</Text>

          <View style={{ gap: 8, marginTop: 10 }}>
            {[
              { slot: '09:00 - 10:00 AM', sub: 'BCA Section C • DBMS', topic: 'Relational Schema & Primary Keys', pct: '80% Present', hod: 'Dr. Sunita Rao' },
              { slot: '10:15 - 11:15 AM', sub: 'B.Tech Section A • OS', topic: 'Deadlock Detection & Banker Algo', pct: '88% Present', hod: 'Dr. Rajesh Sharma' },
              { slot: '11:30 - 12:30 PM', sub: 'B.Pharma Section A • Pharmaceutics', topic: 'Suspensions & Colloids Prep', pct: '92% Present', hod: 'Dr. Anjali Mehta' }
            ].map((h, i) => (
              <View key={i} style={styles.scheduleItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{h.sub} • {h.slot}</Text>
                  <Text style={styles.itemMeta}>{h.topic}</Text>
                  <Text style={{ fontSize: 10, color: '#6366F1', marginTop: 2 }}>Assigned HOD: {h.hod}</Text>
                </View>
                <View style={styles.pctBadge}>
                  <Text style={styles.pctBadgeText}>{h.pct}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* MODAL: ADD SECTION ON THE FLY */}
      <Modal visible={showAddSectionModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Create New Section</Text>
            <Text style={styles.modalDesc}>
              Add section under {currentDept.shortName} (Semester {selectedSemester})
            </Text>

            <Text style={[styles.configLabel, { marginTop: 12 }]}>SECTION NAME</Text>
            <TextInput
              style={styles.modalInputBox}
              value={newSectionName}
              onChangeText={setNewSectionName}
              placeholder="e.g. Section D"
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowAddSectionModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={handleCreateSection}
              >
                <Text style={styles.modalBtnConfirmText}>Save Section</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: ADD STUDENT TO THIS SECTION */}
      <Modal visible={showAddStudentModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Add Student to Class</Text>
            <Text style={styles.modalDesc}>
              Enrolling into {currentDept.shortName} • Sem {selectedSemester} • {selectedSection}
            </Text>

            <Text style={[styles.configLabel, { marginTop: 12 }]}>STUDENT FULL NAME</Text>
            <TextInput
              style={styles.modalInputBox}
              value={newStudentName}
              onChangeText={setNewStudentName}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.configLabel, { marginTop: 10 }]}>ROLL NUMBER</Text>
            <TextInput
              style={styles.modalInputBox}
              value={newStudentRoll}
              onChangeText={setNewStudentRoll}
              placeholder="24BCA016"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowAddStudentModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={handleAddStudentToSection}
              >
                <Text style={styles.modalBtnConfirmText}>Add Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 40
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 9
  },
  segmentBtnActive: {
    backgroundColor: '#059669',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2
  },
  segmentBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569'
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  configSectionRow: {
    marginBottom: 6
  },
  configLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 4
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  courseChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  courseChipActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  courseChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155'
  },
  courseChipTextActive: {
    color: '#FFFFFF'
  },
  hodInfoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  hodInfoText: {
    fontSize: 10.5,
    color: '#3730A3',
    flex: 1
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4
  },
  compactPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  compactPillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  compactPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  compactPillTextActive: {
    color: '#FFFFFF'
  },
  inlineAddBtn: {
    paddingHorizontal: 4,
    paddingVertical: 1
  },
  inlineAddBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669'
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 210
  },
  subjectChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  subjectChipCode: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  subjectChipCodeActive: {
    backgroundColor: '#059669',
    color: '#FFFFFF'
  },
  subjectChipName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155'
  },
  subjectChipNameActive: {
    color: '#065F46',
    fontWeight: '700'
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  timeChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8'
  },
  timeChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569'
  },
  timeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  topicInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8
  },
  topicInput: {
    flex: 1,
    fontSize: 11.5,
    color: '#1E293B',
    paddingVertical: 4
  },
  rosterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  rosterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  rosterTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  rosterSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1
  },
  addStudentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  addStudentBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669'
  },
  kpiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8
  },
  kpiCol: {
    flex: 1,
    alignItems: 'center'
  },
  kpiDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0'
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A'
  },
  kpiLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 1
  },
  bulkRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  bulkPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: 6
  },
  bulkPillText: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 8
  },
  successBoxText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '700',
    flex: 1
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1
  },
  studentPresent: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  studentAbsent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  initialsCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  initialsPresent: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC'
  },
  initialsAbsent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5'
  },
  initialsText: {
    fontSize: 11.5,
    fontWeight: '800'
  },
  studentName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  studentRoll: {
    fontSize: 10,
    color: '#64748B'
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5
  },
  statusTagPresent: {
    backgroundColor: '#DCFCE7'
  },
  statusTagAbsent: {
    backgroundColor: '#FEE2E2'
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '800'
  },
  submitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800'
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  boxTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  boxSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  timeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center'
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46'
  },
  slotSub: {
    fontSize: 8.5,
    color: '#059669',
    fontWeight: '700'
  },
  itemTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  itemMeta: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },
  roomTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  roomTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#2563EB'
  },
  pctBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5
  },
  pctBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16
  },
  modalHeading: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  modalInputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    marginTop: 4
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14
  },
  modalBtnCancel: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center'
  },
  modalBtnCancelText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569'
  },
  modalBtnConfirm: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center'
  },
  modalBtnConfirmText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  dayChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  dayChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B'
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  dayChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
