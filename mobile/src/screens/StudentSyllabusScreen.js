import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import DropdownSelect from '../components/DropdownSelect';
import {
  getCourseSubjects,
  getSubjectSyllabus,
  subscribeToSyllabus
} from '../services/academicSync';

export default function StudentSyllabusScreen({ currentUser }) {
  const studentCourse = currentUser?.program || 'B.Tech';
  const studentDept = currentUser?.departmentCode || 'CSE';
  const studentYear = currentUser?.year || '3rd Year';

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCS501');
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedUnitId, setExpandedUnitId] = useState(null);

  useEffect(() => {
    loadSyllabus();
    const unsubscribe = subscribeToSyllabus(() => loadSyllabus());
    return () => unsubscribe();
  }, [studentCourse, selectedSubjectCode]);

  const loadSyllabus = () => {
    const subs = getCourseSubjects(studentCourse);
    setSubjects(subs);

    const targetCode = subs.some(s => s.code === selectedSubjectCode)
      ? selectedSubjectCode
      : (subs[0]?.code || 'BCS501');

    if (targetCode !== selectedSubjectCode) {
      setSelectedSubjectCode(targetCode);
    }

    const currentSub = getSubjectSyllabus(studentCourse, targetCode);
    setActiveSubject(currentSub);
    if (currentSub?.units?.length > 0 && !expandedUnitId) {
      setExpandedUnitId(currentSub.units[0].id);
    }
  };

  const completionPct = activeSubject?.units?.length > 0
    ? Math.round(
        (activeSubject.units.filter(u => u.status === 'Completed').length /
          activeSubject.units.length) *
          100
      )
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Course Banner */}
      <View style={styles.courseBanner}>
        <View style={styles.bannerTop}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="book" size={20} color="#1D4ED8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>COURSE CURRICULUM & SYLLABUS</Text>
            <Text style={styles.bannerCourseTitle}>
              {studentCourse} ({studentDept}) • {studentYear}
            </Text>
            <Text style={styles.bannerSubtitle}>
              Official curriculum published and maintained by Head of Department.
            </Text>
          </View>
        </View>
      </View>

      {/* Subject Dropdown Selector */}
      <View style={styles.selectorCard}>
        <DropdownSelect
          label="SELECT SUBJECT TO VIEW SYLLABUS"
          value={selectedSubjectCode}
          options={subjects.map(s => ({
            label: `${s.code} — ${s.name}`,
            value: s.code
          }))}
          onSelect={(val) => setSelectedSubjectCode(val)}
          icon="library-outline"
        />
      </View>

      {/* Subject Metrics Card */}
      {activeSubject && (
        <View style={styles.metricsCard}>
          <View style={styles.metricsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectCode}>{activeSubject.code}</Text>
              <Text style={styles.subjectName}>{activeSubject.name}</Text>
            </View>
            <View style={styles.creditBadge}>
              <Text style={styles.creditBadgeText}>{activeSubject.credits} Credits</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarRow}>
              <Text style={styles.progressLabel}>Syllabus Covered</Text>
              <Text style={styles.progressPctText}>{completionPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completionPct}%` }]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{activeSubject.units?.length || 0}</Text>
              <Text style={styles.statLbl}>TOTAL UNITS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{activeSubject.totalHours} Hrs</Text>
              <Text style={styles.statLbl}>LECTURE DURATION</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statVal, { color: '#059669' }]}>
                {activeSubject.units?.filter(u => u.status === 'Completed').length || 0}
              </Text>
              <Text style={styles.statLbl}>COMPLETED</Text>
            </View>
          </View>
        </View>
      )}

      {/* Units Accordion */}
      <View style={styles.unitsSection}>
        <View style={styles.unitsHeaderRow}>
          <Text style={styles.unitsHeading}>UNITS & TOPICS BREAKDOWN</Text>
          <TouchableOpacity
            style={styles.downloadSyllabusBtn}
            onPress={() => Alert.alert('Curriculum Vault', `Downloading official AICTE/University syllabus PDF for ${activeSubject?.name}...`)}
          >
            <Ionicons name="download-outline" size={13} color="#1D4ED8" />
            <Text style={styles.downloadSyllabusBtnText}>Syllabus PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10, marginTop: 8 }}>
          {(!activeSubject?.units || activeSubject.units.length === 0) ? (
            <View style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={38} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Syllabus Pending</Text>
              <Text style={styles.emptySub}>Department HOD is currently finalizing units for this subject.</Text>
            </View>
          ) : (
            activeSubject.units.map(unit => {
              const isExpanded = expandedUnitId === unit.id;
              const isDone = unit.status === 'Completed';
              const inProgress = unit.status === 'In Progress';

              return (
                <View key={unit.id} style={styles.unitCard}>
                  <TouchableOpacity
                    style={styles.unitCardHeader}
                    onPress={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.unitNumberBox}>
                      <Text style={styles.unitNumberText}>U{unit.unitNumber}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.unitTitleText}>
                        Unit {unit.unitNumber}: {unit.title}
                      </Text>
                      <View style={styles.unitMetaRow}>
                        <View style={[
                          styles.statusBadge,
                          isDone ? styles.badgeSuccess : inProgress ? styles.badgeWarning : styles.badgeMuted
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            isDone ? styles.textSuccess : inProgress ? styles.textWarning : styles.textMuted
                          ]}>
                            {unit.status}
                          </Text>
                        </View>
                        <Text style={styles.hoursText}>{unit.hours} Hours</Text>
                      </View>
                    </View>

                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.unitBody}>
                      <Text style={styles.topicsTitle}>KEY TOPICS TO STUDY:</Text>
                      <View style={styles.topicsWrap}>
                        {unit.topics.map((t, idx) => (
                          <View key={idx} style={styles.topicRow}>
                            <Ionicons name="bookmark" size={13} color="#2563EB" />
                            <Text style={styles.topicText}>{t}</Text>
                          </View>
                        ))}
                      </View>

                      {unit.references && (
                        <View style={styles.referenceBox}>
                          <Ionicons name="book-outline" size={13} color="#1D4ED8" />
                          <Text style={styles.referenceText}>
                            Recommended Book: <Text style={{ fontStyle: 'italic', fontWeight: '600' }}>{unit.references}</Text>
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40
  },
  courseBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: 12
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  bannerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5
  },
  bannerCourseTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15
  },
  selectorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  metricsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  subjectCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  creditBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  creditBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6D28D9'
  },
  progressSection: {
    marginTop: 12,
    marginBottom: 10
  },
  progressBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    gap: 8
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B'
  },
  statLbl: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  unitsSection: {
    gap: 4
  },
  unitsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  unitsHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5
  },
  downloadSyllabusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  downloadSyllabusBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 6
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B'
  },
  emptySub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  unitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  unitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10
  },
  unitNumberBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unitNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  unitTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B'
  },
  unitMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  badgeSuccess: {
    backgroundColor: '#ECFDF5'
  },
  badgeWarning: {
    backgroundColor: '#FFFBEB'
  },
  badgeMuted: {
    backgroundColor: '#F1F5F9'
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '700'
  },
  textSuccess: {
    color: '#047857'
  },
  textWarning: {
    color: '#D97706'
  },
  textMuted: {
    color: '#64748B'
  },
  hoursText: {
    fontSize: 10.5,
    color: '#64748B'
  },
  unitBody: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  topicsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  topicsWrap: {
    gap: 5
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6
  },
  topicText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 16
  },
  referenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 6,
    marginTop: 8
  },
  referenceText: {
    fontSize: 10.5,
    color: '#1E40AF',
    flex: 1
  }
});
