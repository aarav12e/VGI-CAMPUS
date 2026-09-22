import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Pure-RN Circular Progress (no SVG dependency) ────────────────────────────
function CirclePercent({ percent, size }) {
  size = size || 72;
  const color = percent >= 85 ? '#16A34A' : percent >= 75 ? '#D97706' : '#DC2626';
  const borderColor = color;
  return (
    <View style={[circleStyles.ring, {
      width: size, height: size, borderRadius: size / 2,
      borderColor
    }]}>
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

// ─── Subject Data ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  {
    code: 'CSE202', title: 'OBJECT ORIENTED PROGRAMMING', type: 'CR',
    group: 1, faculty: 'Vijay Kumar', seating: 'NA',
    lastAttended: '9/22/2026', attended: 38, delivered: 40, dutyLeaves: 2,
    section: 'K4P25XS', rollNo: 'RK4P25XSA03',
    sessions: [
      { date: 'Tue,22 Sep, 2026', slot: '[L]-03:10-04:00 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Tue,22 Sep, 2026', slot: '[L]-04:00-04:50 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Fri,18 Sep, 2026', slot: '[P]-01:30-02:20 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Fri,18 Sep, 2026', slot: '[P]-12:40-01:30 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Wed,16 Sep, 2026', slot: '[L]-02:20-03:10 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Wed,16 Sep, 2026', slot: '[L]-03:10-04:00 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Tue,15 Sep, 2026', slot: '[L]-03:10-04:00 PM', status: 'A', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Tue,15 Sep, 2026', slot: '[L]-04:00-04:50 PM', status: 'A', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Fri,11 Sep, 2026', slot: '[P]-01:30-02:20 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Fri,11 Sep, 2026', slot: '[P]-12:40-01:30 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Wed,09 Sep, 2026', slot: '[L]-02:20-03:10 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Wed,09 Sep, 2026', slot: '[L]-03:10-04:00 PM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
    ]
  },
  {
    code: 'CSE205', title: 'DATA STRUCTURES AND ALGORITHMS', type: 'CR1',
    group: 1, faculty: 'Vijay Kumar', seating: 'NA',
    lastAttended: '9/21/2026', attended: 33, delivered: 35, dutyLeaves: 0,
    section: 'K4P25XS', rollNo: 'RK4P25XSA03',
    sessions: [
      { date: 'Mon,21 Sep, 2026', slot: '[L]-09:00-09:50 AM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Mon,21 Sep, 2026', slot: '[L]-09:50-10:40 AM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Thu,17 Sep, 2026', slot: '[L]-10:40-11:30 AM', status: 'P', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Mon,14 Sep, 2026', slot: '[L]-09:00-09:50 AM', status: 'A', faculty: 'Vijay Kumar', uid: 68809 },
      { date: 'Mon,14 Sep, 2026', slot: '[L]-09:50-10:40 AM', status: 'A', faculty: 'Vijay Kumar', uid: 68809 },
    ]
  },
  {
    code: 'CSE306', title: 'COMPUTER NETWORKS', type: 'CR1',
    group: 1, faculty: 'Sagar Choudhary', seating: '25-301-CH24',
    lastAttended: '9/22/2026', attended: 20, delivered: 25, dutyLeaves: 1,
    section: 'K4P25XS', rollNo: 'RK4P25XSA03',
    sessions: [
      { date: 'Tue,22 Sep, 2026', slot: '[L]-01:00-01:50 PM', status: 'P', faculty: 'Sagar Choudhary', uid: 68810 },
      { date: 'Fri,18 Sep, 2026', slot: '[L]-11:30-12:20 PM', status: 'P', faculty: 'Sagar Choudhary', uid: 68810 },
      { date: 'Tue,15 Sep, 2026', slot: '[L]-01:00-01:50 PM', status: 'A', faculty: 'Sagar Choudhary', uid: 68810 },
    ]
  },
  {
    code: 'CSE401', title: 'OPERATING SYSTEMS', type: 'CR',
    group: 2, faculty: 'Priya Mehta', seating: 'NA',
    lastAttended: '9/20/2026', attended: 18, delivered: 28, dutyLeaves: 0,
    section: 'K4P25XS', rollNo: 'RK4P25XSA03',
    sessions: [
      { date: 'Sat,20 Sep, 2026', slot: '[L]-08:10-09:00 AM', status: 'P', faculty: 'Priya Mehta', uid: 68811 },
      { date: 'Sat,20 Sep, 2026', slot: '[L]-09:00-09:50 AM', status: 'A', faculty: 'Priya Mehta', uid: 68811 },
    ]
  },
  {
    code: 'CSE402', title: 'THEORY OF COMPUTATION', type: 'CR',
    group: 2, faculty: 'Ravi Shankar', seating: 'NA',
    lastAttended: '9/19/2026', attended: 24, delivered: 27, dutyLeaves: 0,
    section: 'K4P25XS', rollNo: 'RK4P25XSA03',
    sessions: [
      { date: 'Fri,18 Sep, 2026', slot: '[L]-02:20-03:10 PM', status: 'P', faculty: 'Ravi Shankar', uid: 68812 },
      { date: 'Tue,15 Sep, 2026', slot: '[L]-02:20-03:10 PM', status: 'P', faculty: 'Ravi Shankar', uid: 68812 },
      { date: 'Fri,11 Sep, 2026', slot: '[L]-02:20-03:10 PM', status: 'A', faculty: 'Ravi Shankar', uid: 68812 },
    ]
  },
];

function getPercent(a, d) {
  return d === 0 ? 0 : Math.round((a / d) * 100);
}

function getAggregate(subs) {
  const tA = subs.reduce((s, x) => s + x.attended, 0);
  const tD = subs.reduce((s, x) => s + x.delivered, 0);
  return getPercent(tA, tD);
}

// ─── Session Log Row ─────────────────────────────────────────────────────────
function SessionRow({ item }) {
  const isPresent = item.status === 'P';
  return (
    <View style={[styles.sessionRow, { borderLeftColor: isPresent ? '#16A34A' : '#DC2626' }]}>
      <View style={[styles.sessionBadge, { backgroundColor: isPresent ? '#16A34A' : '#DC2626' }]}>
        <Text style={styles.sessionBadgeText}>{item.status}</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionDate}>
          {item.date}{'  '}
          <Text style={styles.sessionSlot}>{item.slot}</Text>
        </Text>
        <Text style={styles.sessionFaculty}>
          Faculty : {item.faculty} (UID : {item.uid})
        </Text>
      </View>
    </View>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, onPress }) {
  const pct = getPercent(subject.attended, subject.delivered);
  const pctColor = pct >= 85 ? '#16A34A' : pct >= 75 ? '#D97706' : '#DC2626';
  return (
    <TouchableOpacity style={styles.subjectCard} onPress={onPress} activeOpacity={0.85}>
      {/* Top row: title + group badge */}
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectCode}>
            {subject.code} - {subject.title}{' '}
            <Text style={styles.subjectType}>({subject.type})</Text>
          </Text>
        </View>
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeTop}>Group:</Text>
          <Text style={styles.groupBadgeNum}>{subject.group}</Text>
        </View>
      </View>

      {/* Body: info rows + circular percent */}
      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          <Text style={styles.infoLine}>Faculty: {subject.faculty}</Text>
          <Text style={styles.infoLine}>Faculty Seating: {subject.seating}</Text>
          <Text style={styles.infoLine}>Last Attended: {subject.lastAttended}</Text>
          <Text style={styles.infoLine}>
            Attended/Delivered: {subject.attended}/{subject.delivered}
          </Text>
          <Text style={styles.infoLine}>Duty Leaves: {subject.dutyLeaves}</Text>
        </View>
        <CirclePercent percent={pct} size={72} />
      </View>

      {/* Footer: section + roll */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerOrange}>Section:{subject.section}</Text>
        <Text style={styles.footerOrange}>
          Roll No:{'\n'}<Text style={styles.footerBold}>{subject.rollNo}</Text>
        </Text>
      </View>

      {/* Tap hint */}
      <View style={styles.tapHint}>
        <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
        <Text style={styles.tapHintText}>Tap to view session log</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Session Log Screen ───────────────────────────────────────────────────────
function SessionLogView({ subject, onBack }) {
  const pct = getPercent(subject.attended, subject.delivered);
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <View style={styles.logHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.logHeaderTitle}>Attendance</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Stats strip */}
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
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Main Attendance Screen ───────────────────────────────────────────────────
export default function AttendanceScreen() {
  const [detailSubject, setDetailSubject] = useState(null);
  const aggregate = getAggregate(SUBJECTS);
  const aggColor = aggregate >= 85 ? '#16A34A' : aggregate >= 75 ? '#D97706' : '#DC2626';
  const aggBg = aggregate >= 85 ? '#F0FDF4' : aggregate >= 75 ? '#FFFBEB' : '#FEF2F2';

  if (detailSubject) {
    return <SessionLogView subject={detailSubject} onBack={() => setDetailSubject(null)} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Aggregate Banner */}
      <View style={[styles.aggregateBanner, { backgroundColor: aggBg, borderColor: aggColor + '55' }]}>
        <Text style={styles.aggregateLabel}>AGGREGATE ATTENDANCE</Text>
        <View style={[styles.aggregateBadge, { backgroundColor: aggColor }]}>
          <Text style={styles.aggregateBadgeText}>{aggregate}%</Text>
        </View>
      </View>

      {/* Warning if below 75 */}
      {aggregate < 75 && (
        <View style={styles.warningBanner}>
          <Ionicons name="alert-circle-outline" size={15} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.warningText}>
            Attendance critically low. Minimum 75% required for exams.
          </Text>
        </View>
      )}

      {/* Subject Cards */}
      {SUBJECTS.map((sub) => (
        <SubjectCard
          key={sub.code}
          subject={sub}
          onPress={() => setDetailSubject(sub)}
        />
      ))}

      {/* Legend */}
      <View style={styles.legendRow}>
        {[['#16A34A', '≥85% Good'], ['#D97706', '75–84% Average'], ['#DC2626', '<75% Critical']].map(([color, label]) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 24 },

  // Aggregate
  aggregateBanner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5, borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16,
    marginBottom: 12
  },
  aggregateLabel: { fontSize: 13, fontWeight: '900', color: '#1E293B', letterSpacing: 0.5 },
  aggregateBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 8 },
  aggregateBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  // Warning
  warningBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FEF2F2', borderRadius: 8,
    borderWidth: 1, borderColor: '#FECACA',
    paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10
  },
  warningText: { flex: 1, fontSize: 11, color: '#B91C1C', lineHeight: 16, fontWeight: '500' },

  // Subject Card
  subjectCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12,
    paddingTop: 12, paddingHorizontal: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
    borderWidth: 1, borderColor: '#E9EDF2'
  },
  cardTopRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 10
  },
  subjectCode: { fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 19, flex: 1, marginRight: 8 },
  subjectType: { fontSize: 13, fontWeight: '700', color: '#EA580C' },
  groupBadge: {
    backgroundColor: '#FFF3E0',
    borderTopWidth: 3, borderTopColor: '#EA580C',
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 6, alignItems: 'center', minWidth: 58
  },
  groupBadgeTop: { fontSize: 9, color: '#EA580C', fontWeight: '600' },
  groupBadgeNum: { fontSize: 16, fontWeight: '900', color: '#EA580C' },

  cardBody: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10
  },
  cardInfo: { flex: 1, paddingRight: 10 },
  infoLine: { fontSize: 11.5, color: '#374151', lineHeight: 19 },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    paddingVertical: 9
  },
  footerOrange: { fontSize: 11.5, fontWeight: '600', color: '#EA580C' },
  footerBold: { fontWeight: '800' },

  tapHint: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end', paddingBottom: 8
  },
  tapHintText: { fontSize: 10, color: '#94A3B8', marginLeft: 3 },

  // Legend
  legendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendLabel: { fontSize: 10, color: '#64748B', fontWeight: '500' },

  // Session Log
  logHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingTop: 16, paddingBottom: 14, paddingHorizontal: 16
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  logHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },

  logStatsStrip: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0'
  },
  logStatsLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  logStatsBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8
  },
  logStatsBadgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  // Session Row
  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4, borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1
  },
  sessionBadge: {
    width: 34, height: 34, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14
  },
  sessionBadgeText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  sessionInfo: { flex: 1 },
  sessionDate: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  sessionSlot: { fontSize: 12, fontWeight: '500', color: '#475569' },
  sessionFaculty: { fontSize: 11.5, color: '#EA580C', fontWeight: '500' },
});
