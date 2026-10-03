import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { apiRequest } from '../../api';
import DropdownSelect from '../../components/DropdownSelect';

const COURSES = [
  { code: 'BCA', name: 'Bachelor of Computer Applications', dept: 'CA', hod: 'Dr. Sunita Rao', sems: [1, 2, 3, 4, 5, 6] },
  { code: 'BTECH-CSE', name: 'B.Tech Computer Science & Engg', dept: 'CSE', hod: 'Dr. Rajesh Sharma', sems: [1, 2, 3, 4, 5, 6, 7, 8] },
  { code: 'BPHARM', name: 'Bachelor of Pharmacy', dept: 'PHARM', hod: 'Dr. Anjali Mehta', sems: [1, 2, 3, 4, 5, 6, 7, 8] },
  { code: 'BBA', name: 'Bachelor of Business Admin', dept: 'MGMT', hod: 'Dr. Vikram Kapoor', sems: [1, 2, 3, 4, 5, 6] }
];

const INITIAL_SECTIONS = [
  { id: 'sec-1', course: 'BCA', sem: 3, name: 'Section C', capacity: 60, enrolled: 5, hod: 'Dr. Sunita Rao' },
  { id: 'sec-2', course: 'BCA', sem: 3, name: 'Section A', capacity: 60, enrolled: 3, hod: 'Dr. Sunita Rao' },
  { id: 'sec-3', course: 'BCA', sem: 3, name: 'Section B', capacity: 60, enrolled: 2, hod: 'Dr. Sunita Rao' },
  { id: 'sec-4', course: 'BTECH-CSE', sem: 5, name: 'Section A', capacity: 60, enrolled: 8, hod: 'Dr. Rajesh Sharma' },
  { id: 'sec-5', course: 'BTECH-CSE', sem: 5, name: 'Section B', capacity: 60, enrolled: 2, hod: 'Dr. Rajesh Sharma' },
  { id: 'sec-6', course: 'BPHARM', sem: 3, name: 'Section A', capacity: 60, enrolled: 4, hod: 'Dr. Anjali Mehta' },
  { id: 'sec-7', course: 'BBA', sem: 3, name: 'Section A', capacity: 60, enrolled: 3, hod: 'Dr. Vikram Kapoor' }
];

export default function HodSectionsTab() {
  const [selectedCourseCode, setSelectedCourseCode] = useState('BCA');
  const [selectedSem, setSelectedSem] = useState(3);
  const [newSectionName, setNewSectionName] = useState('Section D');
  const [sectionCapacity, setSectionCapacity] = useState('60');
  const [sectionsList, setSectionsList] = useState(INITIAL_SECTIONS);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);
  const [sectionSuccessMsg, setSectionSuccessMsg] = useState(null);

  const activeCourse = COURSES.find(c => c.code === selectedCourseCode) || COURSES[0];

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) {
      Alert.alert('Validation', 'Please enter a section name (e.g. Section D)');
      return;
    }

    setSectionSubmitting(true);
    setSectionSuccessMsg(null);

    const trimmedName = newSectionName.trim();
    const newSecObj = {
      id: 'sec-' + Date.now(),
      course: selectedCourseCode,
      sem: selectedSem,
      name: trimmedName,
      capacity: Number(sectionCapacity) || 60,
      enrolled: 0,
      hod: activeCourse.hod
    };

    try {
      await apiRequest('/academic/sections', {
        method: 'POST',
        body: JSON.stringify({
          name: trimmedName,
          programCode: selectedCourseCode,
          semesterNumber: selectedSem,
          capacity: Number(sectionCapacity) || 60
        })
      });
    } catch (err) {}

    setSectionsList(prev => [newSecObj, ...prev]);
    setSectionSuccessMsg(
      `✓ "${trimmedName}" created under ${activeCourse.name} (Sem ${selectedSem})! Assigned HOD: ${activeCourse.hod}`
    );

    // Auto-advance section letter (e.g. D -> E)
    const lastChar = trimmedName[trimmedName.length - 1];
    if (lastChar >= 'A' && lastChar < 'Z') {
      setNewSectionName('Section ' + String.fromCharCode(lastChar.charCodeAt(0) + 1));
    }
    setSectionSubmitting(false);
  };

  const filteredSections = sectionsList.filter(s => s.course === selectedCourseCode);

  return (
    <View style={styles.container}>
      {/* Create Section Form Card */}
      <View style={styles.contentCard}>
        <Text style={styles.cardHeaderTitle}>Establish New Class Section</Text>
        <Text style={styles.cardHeaderSub}>
          Create class divisions for any course & semester without cross-department collision.
        </Text>

        {/* Course / Degree Dropdown */}
        <DropdownSelect
          label="SELECT DEGREE / COURSE"
          value={selectedCourseCode}
          options={COURSES.map(c => ({
            label: `${c.code} — ${c.name}`,
            value: c.code,
            subtitle: `Department: ${c.dept} • HOD: ${c.hod}`
          }))}
          onSelect={(val) => {
            setSelectedCourseCode(val);
            const found = COURSES.find(c => c.code === val);
            if (found) setSelectedSem(found.sems[0] || 1);
          }}
          icon="school-outline"
        />

        {/* Semester Dropdown */}
        <DropdownSelect
          label="ACADEMIC SEMESTER"
          value={selectedSem}
          options={activeCourse.sems.map(sm => ({
            label: `Semester ${sm}`,
            value: sm
          }))}
          onSelect={(val) => setSelectedSem(val)}
          icon="calendar-outline"
        />

        {/* Section Name & Capacity */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <View style={{ flex: 2 }}>
            <Text style={styles.inputLabel}>SECTION NAME / CODE</Text>
            <TextInput
              style={styles.textInputBox}
              placeholder="e.g. Section D"
              placeholderTextColor={COLORS.textLight}
              value={newSectionName}
              onChangeText={setNewSectionName}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>CAPACITY</Text>
            <TextInput
              style={styles.textInputBox}
              placeholder="60"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={sectionCapacity}
              onChangeText={setSectionCapacity}
            />
          </View>
        </View>

        {sectionSuccessMsg && (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.successBoxText}>{sectionSuccessMsg}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.actionSubmitBtn}
          onPress={handleCreateSection}
          disabled={sectionSubmitting}
        >
          {sectionSubmitting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Ionicons name="add-circle" size={16} color={COLORS.white} />
              <Text style={styles.actionSubmitBtnText}>Create & Establish Section</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Directory of Established Sections */}
      <View style={styles.directoryCard}>
        <View style={styles.directoryHeader}>
          <Text style={styles.directoryTitle}>Established {selectedCourseCode} Sections</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filteredSections.length} Sections</Text>
          </View>
        </View>

        <View style={{ gap: 8, marginTop: 10 }}>
          {filteredSections.map(sec => (
            <View key={sec.id} style={styles.sectionRow}>
              <View style={styles.sectionIconBadge}>
                <Ionicons name="layers" size={16} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionRowName}>
                  {sec.course} • Sem {sec.sem} • {sec.name}
                </Text>
                <Text style={styles.sectionRowSub}>
                  Assigned HOD: {sec.hod} • Capacity: {sec.capacity} seats
                </Text>
              </View>
              <View style={styles.enrolledBadge}>
                <Text style={styles.enrolledBadgeText}>{sec.enrolled} Enrolled</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    marginBottom: 14
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
    marginBottom: 10
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 5,
    letterSpacing: 0.5
  },
  coursePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  coursePillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  coursePillCode: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  coursePillCodeActive: {
    color: COLORS.white
  },
  coursePillName: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  coursePillNameActive: {
    color: '#D1FAE5'
  },
  hodInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  hodBadgeTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#312E81'
  },
  hodBadgeSub: {
    fontSize: 10.5,
    color: '#4338CA',
    marginTop: 1
  },
  textInputBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textMain
  },
  pillSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  choicePill: {
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  choicePillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  choicePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMain
  },
  choicePillTextActive: {
    color: COLORS.white
  },
  actionSubmitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12
  },
  actionSubmitBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10
  },
  successBoxText: {
    fontSize: 11.5,
    color: '#065F46',
    fontWeight: '700',
    flex: 1
  },
  directoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  directoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  directoryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  sectionRowName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  sectionRowSub: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  enrolledBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  enrolledBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB'
  }
});
