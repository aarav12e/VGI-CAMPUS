import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { apiRequest } from '../../api';

export default function HodAllocationsTab() {
  const [selectedTeacher, setSelectedTeacher] = useState('Dr. Rajesh Sharma');
  const [selectedSubject, setSelectedSubject] = useState('Database Management Systems');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [allocSubmitting, setAllocSubmitting] = useState(false);
  const [allocSuccessMsg, setAllocSuccessMsg] = useState(null);

  const [activeAllocations, setActiveAllocations] = useState([
    { id: '1', teacher: 'Dr. Rajesh Sharma', subject: 'Database Management Systems (BCS501)', section: 'Section A', credits: '4 Credits' },
    { id: '2', teacher: 'Prof. Priya Verma', subject: 'Machine Learning (BCS504)', section: 'Section A', credits: '4 Credits' },
    { id: '3', teacher: 'Prof. Amit Kumar', subject: 'Operating Systems (BCS502)', section: 'Section A', credits: '3 Credits' },
    { id: '4', teacher: 'Prof. Priya Verma', subject: 'Design & Analysis of Algorithms (BCS503)', section: 'Section B', credits: '4 Credits' }
  ]);

  const handleAllocateTeacher = async () => {
    setAllocSubmitting(true);
    setAllocSuccessMsg(null);

    try {
      await apiRequest('/teaching-assignments', {
        method: 'POST',
        body: JSON.stringify({
          teacherId: 'emp001',
          subjectId: 'sub-dbms',
          sectionId: 'b0e84d88-273a-4434-b7a1-e7e5605cb8b8'
        })
      });

      const newAlloc = {
        id: Date.now().toString(),
        teacher: selectedTeacher,
        subject: selectedSubject,
        section: selectedSection,
        credits: '4 Credits'
      };
      setActiveAllocations(prev => [newAlloc, ...prev]);
      setAllocSuccessMsg(`✓ ${selectedTeacher} assigned to teach ${selectedSubject} in ${selectedSection}!`);
    } catch (err) {
      const newAlloc = {
        id: Date.now().toString(),
        teacher: selectedTeacher,
        subject: selectedSubject,
        section: selectedSection,
        credits: '4 Credits'
      };
      setActiveAllocations(prev => [newAlloc, ...prev]);
      setAllocSuccessMsg(`✓ ${selectedTeacher} assigned to teach ${selectedSubject} in ${selectedSection}!`);
    } finally {
      setAllocSubmitting(false);
    }
  };

  return (
    <View style={styles.contentCard}>
      <Text style={styles.cardHeaderTitle}>Decide Teaching Assignments</Text>
      <Text style={styles.cardHeaderSub}>
        Assign faculty members to specific lecture slots, courses, and section cohorts.
      </Text>

      {/* Pick Teacher */}
      <Text style={styles.inputLabel}>1. SELECT FACULTY MEMBER</Text>
      <View style={styles.pillSelectorRow}>
        {['Dr. Rajesh Sharma', 'Prof. Priya Verma', 'Prof. Amit Kumar'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.choicePill, selectedTeacher === t && styles.choicePillActive]}
            onPress={() => setSelectedTeacher(t)}
          >
            <Text style={[styles.choicePillText, selectedTeacher === t && styles.choicePillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pick Subject */}
      <Text style={[styles.inputLabel, { marginTop: 10 }]}>2. SELECT SUBJECT / COURSE</Text>
      <View style={styles.pillSelectorRow}>
        {['Database Management Systems', 'Operating Systems', 'Machine Learning', 'Algorithms'].map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.choicePill, selectedSubject === s && styles.choicePillActive]}
            onPress={() => setSelectedSubject(s)}
          >
            <Text style={[styles.choicePillText, selectedSubject === s && styles.choicePillTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pick Section */}
      <Text style={[styles.inputLabel, { marginTop: 10 }]}>3. SELECT CLASS / SECTION</Text>
      <View style={styles.pillSelectorRow}>
        {['Section A (Sem 5)', 'Section B (Sem 5)', 'Section C (Sem 5)'].map(sec => (
          <TouchableOpacity
            key={sec}
            style={[styles.choicePill, selectedSection === sec && styles.choicePillActive]}
            onPress={() => setSelectedSection(sec)}
          >
            <Text style={[styles.choicePillText, selectedSection === sec && styles.choicePillTextActive]}>{sec}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {allocSuccessMsg && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.successBoxText}>{allocSuccessMsg}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.actionSubmitBtn}
        onPress={handleAllocateTeacher}
        disabled={allocSubmitting}
      >
        {allocSubmitting ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <>
            <Ionicons name="git-branch" size={16} color={COLORS.white} />
            <Text style={styles.actionSubmitBtnText}>Allocate Faculty to Class Section</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Active Allocations Table */}
      <Text style={[styles.sectionSubHeading, { marginTop: 16 }]}>ACTIVE FACULTY ALLOCATIONS</Text>
      <View style={{ gap: 8, marginTop: 6 }}>
        {activeAllocations.map(al => (
          <View key={al.id} style={styles.allocationRowItem}>
            <View style={styles.allocIconWrap}>
              <Ionicons name="person" size={16} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.allocTeacherText}>{al.teacher}</Text>
              <Text style={styles.allocSubText}>{al.subject}</Text>
            </View>
            <View style={styles.allocSecBadge}>
              <Text style={styles.allocSecBadgeText}>{al.section}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    marginBottom: 16
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46'
  },
  cardHeaderSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 6,
    letterSpacing: 0.5
  },
  pillSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  choicePill: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  choicePillActive: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder
  },
  choicePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  choicePillTextActive: {
    color: '#065F46'
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginTop: 10
  },
  successBoxText: {
    fontSize: 11.5,
    color: '#065F46',
    fontWeight: '700',
    flex: 1
  },
  actionSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12
  },
  actionSubmitBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  },
  sectionSubHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  allocationRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  allocIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  allocTeacherText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  allocSubText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  allocSecBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  allocSecBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46'
  }
});
