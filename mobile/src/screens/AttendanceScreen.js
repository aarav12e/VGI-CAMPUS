import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLiveSessions, subscribeToAttendance } from '../services/attendanceSync';
import { getTimetableForSection, subscribeToTimetable } from '../services/academicSync';
import { COLORS } from '../theme/colors';

// ─── Pure-RN Circular Progress Gauge ──────────────────────────────────────────
function CirclePercent({ percent, size }) {
  size = size || 72;
  const color = percent >= 85 ? '#16A34A' : percent >= 75 ? '#D97706' : '#DC2626';
  return (
    <View
      style={[
        circleStyles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color
        }
      ]}
    >
      <Text style={[circleStyles.pct, { color, fontSize: size < 60 ? 13 : 15 }]}>
        {percent}%
      </Text>
    </View>
  );
}

const circleStyles = StyleSheet.create({
  ring: {
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  pct: { fontWeight: '800' }
});

// ─── Timetable Schedules by Program & Section ─────────────────────────────────
const TIMETABLES = {
  // BCA Semester 3 Section C
  'BCA_Section C': [
    { day: 'Monday', time: '09:00 - 10:00 AM', code: 'BCA301', subject: 'Database Management Systems', faculty: 'Dr. Sunita Rao (HOD)', room: 'Lab 2' },
    { day: 'Monday', time: '10:15 - 11:15 AM', code: 'BCA302', subject: 'Web Technologies & PHP', faculty: 'Prof. Neha Gupta', room: 'LT-201' },
    { day: 'Tuesday', time: '09:00 - 10:00 AM', code: 'BCA303', subject: 'Data Structures using C++', faculty: 'Prof. Rohit Singhania', room: 'LT-201' },
    { day: 'Tuesday', time: '11:30 - 12:30 PM', code: 'BCA304', subject: 'Computer Architecture', faculty: 'Prof. Ankit Verma', room: 'LT-202' },
    { day: 'Wednesday', time: '02:30 - 04:00 PM', code: 'BCA301P', subject: 'DBMS SQL Practical Lab', faculty: 'Dr. Sunita Rao (HOD)', room: 'Software Lab 3' },
    { day: 'Thursday', time: '09:00 - 10:00 AM', code: 'BCA301', subject: 'Database Management Systems', faculty: 'Dr. Sunita Rao (HOD)', room: 'Lab 2' },
    { day: 'Friday', time: '10:15 - 11:15 AM', code: 'BCA302', subject: 'Web Technologies & PHP', faculty: 'Prof. Neha Gupta', room: 'LT-201' }
  ],
  // B.Tech CSE Semester 5 Section A
  'BTECH_Section A': [
    { day: 'Monday', time: '09:00 - 10:00 AM', code: 'BCS501', subject: 'Database Management Systems', faculty: 'Dr. Rajesh Sharma (HOD)', room: 'LT-101' },
    { day: 'Monday', time: '11:15 - 12:15 PM', code: 'BCS502', subject: 'Operating Systems', faculty: 'Prof. Priya Verma', room: 'LT-102' },
    { day: 'Tuesday', time: '09:00 - 10:00 AM', code: 'BCS503', subject: 'Design & Analysis of Algorithms', faculty: 'Prof. Amit Kumar', room: 'LT-101' },
    { day: 'Wednesday', time: '02:00 - 03:30 PM', code: 'BCS504', subject: 'Machine Learning Foundations', faculty: 'Prof. Priya Verma', room: 'AI Lab 3' },
    { day: 'Thursday', time: '10:15 - 11:15 AM', code: 'BCS502', subject: 'Operating Systems', faculty: 'Prof. Priya Verma', room: 'LT-102' },
    { day: 'Friday', time: '09:00 - 10:00 AM', code: 'BCS501', subject: 'Database Management Systems', faculty: 'Dr. Rajesh Sharma (HOD)', room: 'LT-101' }
  ]
};

// ─── Default Subject Profiles ─────────────────────────────────────────────────
const BCA_SUBJECTS = [
  {
    code: 'BCA301',
    title: 'DATABASE MANAGEMENT SYSTEMS',
    faculty: 'Dr. Sunita Rao (HOD)',
    seating: 'Lab 2',
    attended: 32,
    delivered: 36,
    dutyLeaves: 1,
    sessions: [
      { date: 'Today', slot: '09:00 - 10:00 AM', status: 'P', faculty: 'Dr. Sunita Rao', topic: 'Relational Schema & SQL Primary Keys' },
      { date: 'Yesterday', slot: '09:00 - 10:00 AM', status: 'P', faculty: 'Dr. Sunita Rao', topic: 'ER Diagrams to Relational Tables' },
      { date: 'Mon, 21 Sep', slot: '09:00 - 10:00 AM', status: 'A', faculty: 'Dr. Sunita Rao', topic: 'Relational Algebra Operations' }
    ]
  },
  {
    code: 'BCA302',
    title: 'WEB TECHNOLOGIES & PHP',
    faculty: 'Prof. Neha Gupta',
    seating: 'LT-201',
    attended: 28,
    delivered: 30,
    dutyLeaves: 0,
    sessions: [
      { date: 'Mon, 21 Sep', slot: '10:15 - 11:15 AM', status: 'P', faculty: 'Prof. Neha Gupta', topic: 'DOM Manipulation & Event Listeners' }
    ]
  },
  {
    code: 'BCA303',
    title: 'DATA STRUCTURES USING C++',
    faculty: 'Prof. Rohit Singhania',
    seating: 'LT-201',
    attended: 29,
    delivered: 32,
    dutyLeaves: 1,
    sessions: [
      { date: 'Tue, 22 Sep', slot: '09:00 - 10:00 AM', status: 'P', faculty: 'Prof. Rohit Singhania', topic: 'Binary Search Trees & Traversals' }
    ]
  }
];

const BTECH_SUBJECTS = [
  {
    code: 'BCS501',
    title: 'DATABASE MANAGEMENT SYSTEMS',
    faculty: 'Dr. Rajesh Sharma (HOD)',
    seating: 'LT-101',
    attended: 38,
    delivered: 40,
    dutyLeaves: 2,
    sessions: [
      { date: 'Today', slot: '09:00 - 10:00 AM', status: 'P', faculty: 'Dr. Rajesh Sharma', topic: 'Normalization & BCNF Proofs' },
      { date: 'Tue, 22 Sep', slot: '09:00 - 10:00 AM', status: 'P', faculty: 'Dr. Rajesh Sharma', topic: 'Functional Dependencies' }
    ]
  },
  {
    code: 'BCS502',
    title: 'OPERATING SYSTEMS',
    faculty: 'Prof. Priya Verma',
    seating: 'LT-102',
    attended: 33,
    delivered: 35,
    dutyLeaves: 0,
    sessions: [
      { date: 'Mon, 21 Sep', slot: '11:15 - 12:15 PM', status: 'P', faculty: 'Prof. Priya Verma', topic: 'Deadlock Avoidance & Banker Algorithm' }
    ]
  },
  {
    code: 'BCS504',
    title: 'MACHINE LEARNING FOUNDATIONS',
    faculty: 'Prof. Priya Verma',
    seating: 'AI Lab 3',
    attended: 27,
    delivered: 30,
    dutyLeaves: 1,
    sessions: [
      { date: 'Wed, 23 Sep', slot: '02:00 - 03:30 PM', status: 'P', faculty: 'Prof. Priya Verma', topic: 'Logistic Regression & Gradient Descent' }
    ]
  }
];

function getPercent(a, d) {
  return d === 0 ? 0 : Math.round((a / d) * 100);
}

function getAggregate(subs) {
  const tA = subs.reduce((s, x) => s + x.attended, 0);
  const tD = subs.reduce((s, x) => s + x.delivered, 0);
  return getPercent(tA, tD);
}

// ─── Session Log Row ──────────────────────────────────────────────────────────
function SessionRow({ item }) {
  const isPresent = item.status === 'P' || item.isPresent;
  return (
    <View style={[styles.sessionRow, { borderLeftColor: isPresent ? '#16A34A' : '#DC2626' }]}>
      <View style={[styles.sessionBadge, { backgroundColor: isPresent ? '#16A34A' : '#DC2626' }]}>
        <Text style={styles.sessionBadgeText}>{isPresent ? 'P' : 'A'}</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionDate}>
          {item.date}{'  '}
          <Text style={styles.sessionSlot}>{item.slot || item.timeSlot}</Text>
        </Text>
        <Text style={styles.sessionFaculty}>
          Faculty: {item.faculty || item.markedBy || 'Department Teacher'}
        </Text>
        {item.topic && (
          <Text style={styles.sessionTopic}>Topic: {item.topic}</Text>
        )}
      </View>
    </View>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, sectionName, rollNo, onPress }) {
  const pct = getPercent(subject.attended, subject.delivered);
  return (
    <TouchableOpacity style={styles.subjectCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectCode}>{subject.code} - {subject.title}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          <Text style={styles.infoLine}>Faculty: {subject.faculty}</Text>
          <Text style={styles.infoLine}>Room/Seating: {subject.seating}</Text>
          <Text style={styles.infoLine}>
            Attended / Delivered: <Text style={{ fontWeight: '800' }}>{subject.attended} / {subject.delivered}</Text>
          </Text>
          <Text style={styles.infoLine}>Duty Leaves: {subject.dutyLeaves || 0}</Text>
        </View>
        <CirclePercent percent={pct} size={68} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerOrange}>Class: {sectionName}</Text>
        <Text style={styles.footerOrange}>Roll No: <Text style={styles.footerBold}>{rollNo}</Text></Text>
      </View>

      <View style={styles.tapHint}>
        <Ionicons name="chevron-forward" size={12} color="#94A3B8" />
        <Text style={styles.tapHintText}>Tap to view session log</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Session Log Modal View ───────────────────────────────────────────────────
function SessionLogView({ subject, onBack }) {
  const pct = getPercent(subject.attended, subject.delivered);
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.logHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.logHeaderTitle}>Subject Attendance Log</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.logStatsStrip}>
        <Text style={styles.logStatsLabel}>{subject.code} — {subject.title}</Text>
        <View style={styles.logStatsBadge}>
          <Text style={styles.logStatsBadgeText}>{pct}%</Text>
        </View>
      </View>

      <FlatList
        data={subject.sessions}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <SessionRow item={item} />}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 14, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Main Attendance & Timetable Screen ────────────────────────────────────────
export default function AttendanceScreen({ currentUser }) {
  const [activeSubTab, setActiveSubTab] = useState('attendance'); // 'attendance' | 'timetable'
  const [detailSubject, setDetailSubject] = useState(null);

  // Student Context
  const isBca = currentUser?.program?.toLowerCase().includes('bca') || currentUser?.rollNumber?.includes('BCA');
  const studentSection = currentUser?.section || (isBca ? 'Section C' : 'Section A');
  const studentCourse = isBca ? 'BCA' : 'B.Tech CSE';
  const studentSem = currentUser?.semester || (isBca ? 3 : 5);
  const studentRoll = currentUser?.rollNumber || (isBca ? '24BCA011' : '24DS001');
  const assignedHod = isBca ? 'Dr. Sunita Rao (Head of Dept - CA)' : 'Dr. Rajesh Sharma (Head of Dept - CSE)';

  const initialSubjects = isBca ? BCA_SUBJECTS : BTECH_SUBJECTS;
  const [subjectsList, setSubjectsList] = useState(initialSubjects);

  // Subscribe to live teacher/HOD roll-calls
  useEffect(() => {
    const unsubscribe = subscribeToAttendance((allSessions) => {
      // Find sessions relevant to this student's section or roll
      const matched = allSessions.filter(s =>
        (isBca && s.courseCode === 'CA' && s.section === studentSection) ||
        (!isBca && s.courseCode === 'CSE' && s.section === studentSection)
      );

      if (matched.length > 0) {
        const latest = matched[0];
        setSubjectsList(prev => {
          return prev.map(sub => {
            if (sub.code === latest.subjectCode || sub.title.toLowerCase().includes(latest.subjectName?.toLowerCase() || '')) {
              const myRecord = latest.records?.find(r => r.roll === studentRoll) || { isPresent: true };
              const newSessionEntry = {
                date: 'Just Now',
                slot: latest.timeSlot,
                status: myRecord.isPresent ? 'P' : 'A',
                faculty: latest.markedBy,
                topic: latest.topic
              };
              const alreadyHas = sub.sessions.some(s => s.topic === latest.topic);
              if (alreadyHas) return sub;
              return {
                ...sub,
                attended: myRecord.isPresent ? sub.attended + 1 : sub.attended,
                delivered: sub.delivered + 1,
                sessions: [newSessionEntry, ...sub.sessions]
              };
            }
            return sub;
          });
        });
      }
    });

    return () => unsubscribe();
  }, [studentSection, isBca, studentRoll]);

  const aggregate = getAggregate(subjectsList);
  const aggColor = aggregate >= 85 ? '#16A34A' : aggregate >= 75 ? '#D97706' : '#DC2626';
  const aggBg = aggregate >= 85 ? '#F0FDF4' : aggregate >= 75 ? '#FFFBEB' : '#FEF2F2';

  const [selectedTimetableDay, setSelectedTimetableDay] = useState('All');
  const [syncedSlots, setSyncedSlots] = useState(() => {
    return getTimetableForSection(studentSection, 'All');
  });

  useEffect(() => {
    const unsub = subscribeToTimetable(() => {
      setSyncedSlots(getTimetableForSection(studentSection, selectedTimetableDay));
    });
    return () => unsub();
  }, [studentSection, selectedTimetableDay]);

  useEffect(() => {
    setSyncedSlots(getTimetableForSection(studentSection, selectedTimetableDay));
  }, [studentSection, selectedTimetableDay]);

  const timetableKey = isBca ? 'BCA_Section C' : 'BTECH_Section A';
  const defaultSlots = TIMETABLES[timetableKey] || TIMETABLES['BCA_Section C'];
  const timetableSlots = (syncedSlots && syncedSlots.length > 0) ? syncedSlots : defaultSlots;

  if (detailSubject) {
    return <SessionLogView subject={detailSubject} onBack={() => setDetailSubject(null)} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Student Class Badge Banner */}
      <View style={styles.classBanner}>
        <View style={styles.classBannerTop}>
          <View style={styles.classIconWrap}>
            <Ionicons name="school" size={18} color="#4338CA" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.classTitle}>
              {studentCourse} • Semester {studentSem} • {studentSection}
            </Text>
            <Text style={styles.classSub}>
              Assigned HOD: <Text style={{ fontWeight: '800' }}>{assignedHod}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Segmented Sub Tabs: Attendance vs Timetable */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTabBtn, activeSubTab === 'attendance' && styles.subTabBtnActive]}
          onPress={() => setActiveSubTab('attendance')}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={15}
            color={activeSubTab === 'attendance' ? COLORS.white : '#1D4ED8'}
          />
          <Text style={[styles.subTabBtnText, activeSubTab === 'attendance' && styles.subTabBtnTextActive]}>
            Live Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, activeSubTab === 'timetable' && styles.subTabBtnActive]}
          onPress={() => setActiveSubTab('timetable')}
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={activeSubTab === 'timetable' ? COLORS.white : '#1D4ED8'}
          />
          <Text style={[styles.subTabBtnText, activeSubTab === 'timetable' && styles.subTabBtnTextActive]}>
            Class Timetable
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUB-TAB 1: ATTENDANCE */}
      {activeSubTab === 'attendance' && (
        <View>
          {/* Aggregate Attendance Banner */}
          <View style={[styles.aggregateBanner, { backgroundColor: aggBg, borderColor: aggColor + '55' }]}>
            <View>
              <Text style={styles.aggregateLabel}>AGGREGATE ATTENDANCE</Text>
              <Text style={styles.aggregateSub}>Mandatory min. 75% turnout for exams</Text>
            </View>
            <View style={[styles.aggregateBadge, { backgroundColor: aggColor }]}>
              <Text style={styles.aggregateBadgeText}>{aggregate}%</Text>
            </View>
          </View>

          {/* Subject Cards */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {subjectsList.map((sub) => (
              <SubjectCard
                key={sub.code}
                subject={sub}
                sectionName={`${studentCourse} • ${studentSection}`}
                rollNo={studentRoll}
                onPress={() => setDetailSubject(sub)}
              />
            ))}
          </View>
        </View>
      )}

      {/* SUB-TAB 2: CLASS TIMETABLE (SYNCHRONIZED WITH HOD) */}
      {activeSubTab === 'timetable' && (
        <View style={styles.timetableCard}>
          <View style={styles.timetableHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.timetableTitle}>Class Lecture Timetable</Text>
              <Text style={styles.timetableSub}>
                Set & updated daily / a day before by HOD for {studentCourse} ({studentSection})
              </Text>
            </View>
            <View style={styles.timetableBadge}>
              <Text style={styles.timetableBadgeText}>{studentSection}</Text>
            </View>
          </View>

          {/* Day Filter Chips (No horizontal scroll, wrap cleanly) */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 6 }}>
            {['All', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'].map(d => {
              const isSel = selectedTimetableDay === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dayChip,
                    isSel && styles.dayChipActive
                  ]}
                  onPress={() => setSelectedTimetableDay(d)}
                >
                  <Text style={[styles.dayChipText, isSel && styles.dayChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ gap: 8, marginTop: 6 }}>
            {timetableSlots.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10 }}>
                <Ionicons name="calendar-outline" size={28} color="#94A3B8" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 6 }}>No Lectures Scheduled</Text>
                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, textAlign: 'center' }}>
                  HOD has not published classes for {selectedTimetableDay}. Check back after daily update.
                </Text>
              </View>
            ) : (
              timetableSlots.map((slot, idx) => (
                <View key={slot.id || idx} style={styles.timetableRow}>
                  <View style={styles.dayCol}>
                    <Text style={styles.dayName}>{slot.day.substring(0, 3)}</Text>
                    <Text style={styles.slotTime}>{slot.time.split(' - ')[0]}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <Text style={styles.ttSubjectName}>{slot.subject}</Text>
                      {slot.isHodTeaching && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EDE9FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
                          <Ionicons name="shield-checkmark" size={10} color="#6D28D9" />
                          <Text style={{ fontSize: 9.5, fontWeight: '800', color: '#6D28D9' }}>HOD Teaching</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.ttFaculty}>
                      {slot.code} • {slot.faculty}
                    </Text>
                    {slot.dateScheduled ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <Ionicons name="checkmark-circle" size={11} color="#059669" />
                        <Text style={{ fontSize: 10, color: '#059669', fontWeight: '600' }}>
                          {slot.dateScheduled}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.roomCol}>
                    <Text style={styles.roomText}>{slot.room}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40
  },
  classBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 10
  },
  classBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  classIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  classTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#312E81'
  },
  classSub: {
    fontSize: 11,
    color: '#4338CA',
    marginTop: 2
  },
  subTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  subTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  subTabBtnActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1E40AF'
  },
  subTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  subTabBtnTextActive: {
    color: '#FFFFFF'
  },
  aggregateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 10
  },
  aggregateLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.5
  },
  aggregateSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2
  },
  aggregateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  aggregateBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  subjectCode: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B'
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  cardInfo: {
    flex: 1,
    gap: 3
  },
  infoLine: {
    fontSize: 11,
    color: '#64748B'
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8
  },
  footerOrange: {
    fontSize: 10.5,
    color: '#D97706',
    fontWeight: '600'
  },
  footerBold: {
    fontWeight: '800',
    color: '#B45309'
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 6
  },
  tapHintText: {
    fontSize: 10,
    color: '#94A3B8'
  },
  timetableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  timetableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10
  },
  timetableTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B'
  },
  timetableSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  timetableBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  timetableBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  timetableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  dayCol: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    width: 60
  },
  dayName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#312E81'
  },
  slotTime: {
    fontSize: 9,
    color: '#4338CA',
    fontWeight: '700'
  },
  ttSubjectName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B'
  },
  ttFaculty: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2
  },
  roomCol: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4
  },
  roomText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569'
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  backBtn: {
    padding: 6
  },
  logHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B'
  },
  logStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8
  },
  logStatsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1
  },
  logStatsBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  logStatsBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  sessionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sessionBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11
  },
  sessionInfo: {
    flex: 1
  },
  sessionDate: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B'
  },
  sessionSlot: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600'
  },
  sessionFaculty: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2
  },
  sessionTopic: {
    fontSize: 10.5,
    color: '#2563EB',
    marginTop: 1,
    fontStyle: 'italic'
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
