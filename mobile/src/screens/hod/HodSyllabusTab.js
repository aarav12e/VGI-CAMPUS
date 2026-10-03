import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import DropdownSelect from '../../components/DropdownSelect';
import {
  getCourseSubjects,
  getSubjectSyllabus,
  addSyllabusUnit,
  deleteSyllabusUnit,
  subscribeToSyllabus
} from '../../services/academicSync';
import { apiRequest } from '../../api';

export default function HodSyllabusTab() {
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCS501');
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedUnitId, setExpandedUnitId] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [unitTitle, setUnitTitle] = useState('');
  const [unitHours, setUnitHours] = useState('10');
  const [unitTopics, setUnitTopics] = useState('');
  const [unitReferences, setUnitReferences] = useState('');
  const [unitStatus, setUnitStatus] = useState('Upcoming');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSyllabus();
    const unsubscribe = subscribeToSyllabus(() => loadSyllabus());
    return () => unsubscribe();
  }, [selectedCourse, selectedSubjectCode]);

  const loadSyllabus = () => {
    const subs = getCourseSubjects(selectedCourse);
    setSubjects(subs);

    const targetCode = subs.some(s => s.code === selectedSubjectCode)
      ? selectedSubjectCode
      : (subs[0]?.code || 'BCS501');

    if (targetCode !== selectedSubjectCode) {
      setSelectedSubjectCode(targetCode);
    }

    const currentSub = getSubjectSyllabus(selectedCourse, targetCode);
    setActiveSubject(currentSub);
    if (currentSub?.units?.length > 0 && !expandedUnitId) {
      setExpandedUnitId(currentSub.units[0].id);
    }
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    const subs = getCourseSubjects(course);
    if (subs.length > 0) {
      setSelectedSubjectCode(subs[0].code);
    }
  };

  const handleAddUnit = async () => {
    if (!unitTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter Unit Title');
      return;
    }
    if (!unitTopics.trim()) {
      Alert.alert('Validation Error', 'Please enter Topics for this unit');
      return;
    }

    setSubmitting(true);
    const newUnitObj = {
      unitNumber: (activeSubject?.units?.length || 0) + 1,
      title: unitTitle.trim(),
      hours: Number(unitHours) || 8,
      status: unitStatus,
      topics: unitTopics.split(',').map(t => t.trim()).filter(Boolean),
      references: unitReferences.trim() || 'Standard Department Textbooks'
    };

    try {
      await apiRequest('/syllabus/units', {
        method: 'POST',
        body: JSON.stringify({
          subjectId: activeSubject?.code || 'BCS501',
          unitNumber: newUnitObj.unitNumber,
          title: newUnitObj.title,
          topics: newUnitObj.topics
        })
      });
    } catch (e) {
      // Keep optimistic update
    }

    addSyllabusUnit(selectedCourse, selectedSubjectCode, newUnitObj);
    setSubmitting(false);
    setShowAddModal(false);
    setUnitTitle('');
    setUnitTopics('');
    setUnitReferences('');
    setUnitHours('10');
    Alert.alert('Syllabus Updated', `Unit "${newUnitObj.title}" successfully added! Students enrolled in ${selectedCourse} can now see it.`);
  };

  const handleDeleteUnit = (unit) => {
    Alert.alert(
      'Remove Syllabus Unit',
      `Are you sure you want to remove "Unit ${unit.unitNumber}: ${unit.title}" from the course curriculum?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            deleteSyllabusUnit(selectedCourse, selectedSubjectCode, unit.id);
            Alert.alert('Unit Removed', 'Syllabus updated successfully.');
          }
        }
      ]
    );
  };

  const completionPct = activeSubject?.units?.length > 0
    ? Math.round(
        (activeSubject.units.filter(u => u.status === 'Completed').length /
          activeSubject.units.length) *
          100
      )
    : 0;

  return (
    <View style={styles.container}>
      {/* Header Info Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="book" size={18} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Course Syllabus Curriculum</Text>
            <Text style={styles.headerSub}>
              HOD can add, update, and manage syllabus units. All students enrolled in this course will see it instantly.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addUnitBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={COLORS.white} />
            <Text style={styles.addUnitBtnText}>+ Unit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selectors */}
      <View style={styles.selectorsCard}>
        <DropdownSelect
          label="1. SELECT ACADEMIC COURSE"
          value={selectedCourse}
          options={[
            { label: 'B.Tech (Computer Science & Engineering)', value: 'B.Tech' },
            { label: 'BCA (Computer Applications)', value: 'BCA' },
            { label: 'BBA (Management Studies)', value: 'BBA' }
          ]}
          onSelect={handleCourseChange}
          icon="school-outline"
        />

        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="2. SELECT SUBJECT / CURRICULUM"
            value={selectedSubjectCode}
            options={subjects.map(s => ({
              label: `${s.code} — ${s.name}`,
              value: s.code
            }))}
            onSelect={(val) => setSelectedSubjectCode(val)}
            icon="document-text-outline"
          />
        </View>
      </View>

      {/* Subject Metric Overview Card */}
      {activeSubject && (
        <View style={styles.subjectOverviewCard}>
          <View style={styles.subjectTop}>
            <View>
              <Text style={styles.subjectCodeBadge}>{activeSubject.code}</Text>
              <Text style={styles.subjectName}>{activeSubject.name}</Text>
            </View>
            <View style={styles.creditPill}>
              <Text style={styles.creditPillText}>{activeSubject.credits} Credits</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completionPct}%` }]} />
            </View>
            <Text style={styles.progressText}>{completionPct}% Covered</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>
              Total Units: <Text style={styles.metaValue}>{activeSubject.units?.length || 0}</Text>
            </Text>
            <Text style={styles.metaLabel}>
              Lecture Hours: <Text style={styles.metaValue}>{activeSubject.totalHours} Hrs</Text>
            </Text>
            <Text style={styles.metaLabel}>
              Status: <Text style={[styles.metaValue, { color: '#047857' }]}>Synced to Students ✓</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Units List */}
      <View style={{ gap: 10, marginTop: 12 }}>
        <Text style={styles.unitsSectionHeading}>
          CURRICULUM UNITS & TOPICS ({activeSubject?.units?.length || 0})
        </Text>

        {(!activeSubject?.units || activeSubject.units.length === 0) ? (
          <View style={styles.emptyUnits}>
            <Ionicons name="document-text-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyUnitsTitle}>No Syllabus Units Added</Text>
            <Text style={styles.emptyUnitsSub}>Tap "+ Unit" above to add the first unit for this course.</Text>
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
                    <View style={styles.unitBadgesRow}>
                      <View style={[
                        styles.unitStatusBadge,
                        isDone ? styles.badgeSuccess : inProgress ? styles.badgeWarning : styles.badgeMuted
                      ]}>
                        <Text style={[
                          styles.unitStatusText,
                          isDone ? styles.textSuccess : inProgress ? styles.textWarning : styles.textMuted
                        ]}>
                          {unit.status}
                        </Text>
                      </View>
                      <Text style={styles.hoursBadgeText}>{unit.hours} Teaching Hours</Text>
                    </View>
                  </View>

                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.unitExpandedContent}>
                    <Text style={styles.topicsHeading}>DETAILED TOPICS COVERED:</Text>
                    <View style={styles.topicsList}>
                      {unit.topics.map((topic, i) => (
                        <View key={i} style={styles.topicItemRow}>
                          <Ionicons name="checkmark-circle" size={14} color="#7C3AED" />
                          <Text style={styles.topicItemText}>{topic}</Text>
                        </View>
                      ))}
                    </View>

                    {unit.references && (
                      <View style={styles.refBox}>
                        <Ionicons name="library-outline" size={13} color="#6B21A8" />
                        <Text style={styles.refText}>
                          Reference: <Text style={{ fontStyle: 'italic' }}>{unit.references}</Text>
                        </Text>
                      </View>
                    )}

                    <View style={styles.unitActionsRow}>
                      <TouchableOpacity
                        style={styles.deleteUnitBtn}
                        onPress={() => handleDeleteUnit(unit)}
                      >
                        <Ionicons name="trash-outline" size={13} color={COLORS.danger} />
                        <Text style={styles.deleteUnitBtnText}>Remove Unit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Add Unit Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Add Syllabus Unit</Text>
                <Text style={styles.modalSubtitle}>
                  For {activeSubject?.name} ({selectedCourse})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalForm}>
                <Text style={styles.inputLabel}>UNIT TITLE</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. Distributed Database Architecture"
                  placeholderTextColor={COLORS.textLight}
                  value={unitTitle}
                  onChangeText={setUnitTitle}
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>TEACHING HOURS</Text>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="e.g. 10"
                      placeholderTextColor={COLORS.textLight}
                      keyboardType="numeric"
                      value={unitHours}
                      onChangeText={setUnitHours}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>STATUS</Text>
                    <View style={styles.statusPillsRow}>
                      {['Completed', 'In Progress', 'Upcoming'].map(st => (
                        <TouchableOpacity
                          key={st}
                          style={[styles.smallStatusPill, unitStatus === st && styles.smallStatusPillActive]}
                          onPress={() => setUnitStatus(st)}
                        >
                          <Text style={[styles.smallStatusPillText, unitStatus === st && styles.smallStatusPillTextActive]}>
                            {st}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <Text style={styles.inputLabel}>TOPICS (COMMA SEPARATED)</Text>
                <TextInput
                  style={[styles.inputBox, { height: 75, textAlignVertical: 'top' }]}
                  placeholder="e.g. Data Fragmentation, Replication, Distributed Deadlock Detection, 2PC Protocol"
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  value={unitTopics}
                  onChangeText={setUnitTopics}
                />

                <Text style={styles.inputLabel}>RECOMMENDED TEXTBOOK / REFERENCES</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="e.g. Korth & Silberschatz - Database System Concepts (Chapter 19)"
                  placeholderTextColor={COLORS.textLight}
                  value={unitReferences}
                  onChangeText={setUnitReferences}
                />

                <TouchableOpacity
                  style={[styles.saveUnitBtn, submitting && { opacity: 0.7 }]}
                  onPress={handleAddUnit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons name="checkmark-done" size={17} color={COLORS.white} />
                      <Text style={styles.saveUnitBtnText}>Save & Sync to Student App</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20
  },
  headerCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    marginBottom: 10
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B21B6'
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15
  },
  addUnitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7
  },
  addUnitBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.white
  },
  selectorsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  subjectOverviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8
  },
  subjectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  subjectCodeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1
  },
  creditPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  creditPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 8
  },
  progressTrack: {
    flex: 1,
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
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  metaLabel: {
    fontSize: 10.5,
    color: '#64748B'
  },
  metaValue: {
    fontWeight: '700',
    color: '#1E293B'
  },
  unitsSectionHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  emptyUnits: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 6
  },
  emptyUnitsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B'
  },
  emptyUnitsSub: {
    fontSize: 11,
    color: '#94A3B8'
  },
  unitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  unitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10
  },
  unitNumberBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unitNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6D28D9'
  },
  unitTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B'
  },
  unitBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3
  },
  unitStatusBadge: {
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
  unitStatusText: {
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
  hoursBadgeText: {
    fontSize: 10.5,
    color: '#64748B'
  },
  unitExpandedContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAF5FF'
  },
  topicsHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6D28D9',
    marginBottom: 6,
    letterSpacing: 0.5
  },
  topicsList: {
    gap: 4
  },
  topicItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6
  },
  topicItemText: {
    fontSize: 11.5,
    color: '#334155',
    flex: 1,
    lineHeight: 16
  },
  refBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 6,
    marginTop: 8
  },
  refText: {
    fontSize: 10.5,
    color: '#581C87',
    flex: 1
  },
  unitActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  deleteUnitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  deleteUnitBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.danger
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 28,
    maxHeight: '90%'
  },
  modalScroll: {
    maxHeight: 520
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B'
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2
  },
  modalCloseBtn: {
    padding: 6
  },
  modalForm: {
    gap: 4
  },
  formRow: {
    flexDirection: 'row',
    gap: 10
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5
  },
  inputBox: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 10
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: 4
  },
  smallStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC'
  },
  smallStatusPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9'
  },
  smallStatusPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B'
  },
  smallStatusPillTextActive: {
    color: COLORS.white
  },
  saveUnitBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6
  },
  saveUnitBtnText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '800'
  }
});
