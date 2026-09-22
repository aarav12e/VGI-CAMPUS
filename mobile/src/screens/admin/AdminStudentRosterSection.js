import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import {
  DEFAULT_DEPARTMENTS,
  ACADEMIC_SECTIONS,
  ACADEMIC_YEARS,
  UNIVERSITY_COURSES
} from '../../constants/academicData';

// ─── Static batch year generator ─────────────────────────────────────────────
function getBatchRange(year) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const map = { '1st Year': 0, '2nd Year': 1, '3rd Year': 2, '4th Year': 3 };
  const offset = map[year] || 0;
  const start = currentYear - offset;
  // Duration: most programs are 4yr (B.Tech/BBA/BFD/B.Pharma), some 3yr (BCA/LLB), 2yr (MCA/MBA/M.Tech)
  const end = start + 4;
  return `${start}–${end}`;
}

// ─── Static demo student data per dept-section-year ──────────────────────────
const DEMO_STUDENTS = {
  'CSE-A-1st Year':  [{ name: 'Aarav Patel',    id: '24CS001' }, { name: 'Riya Sharma',    id: '24CS002' }, { name: 'Arjun Verma',   id: '24CS003' }, { name: 'Priya Mehta',   id: '24CS004' }],
  'CSE-A-2nd Year': [{ name: 'Rohit Singh',     id: '23CS001' }, { name: 'Anjali Gupta',  id: '23CS002' }, { name: 'Vikram Nair',   id: '23CS003' }],
  'CSE-B-1st Year': [{ name: 'Sneha Kapoor',    id: '24CS005' }, { name: 'Mohit Yadav',   id: '24CS006' }, { name: 'Divya Pandey',  id: '24CS007' }],
  'CSE-B-2nd Year': [{ name: 'Rahul Joshi',     id: '23CS004' }, { name: 'Neha Srivastava', id: '23CS005' }],
  'CA-A-1st Year':  [{ name: 'Aditya Kumar',    id: '24CA001' }, { name: 'Pooja Rawat',   id: '24CA002' }, { name: 'Suresh Negi',   id: '24CA003' }],
  'CA-A-2nd Year':  [{ name: 'Kavita Singh',    id: '23CA001' }, { name: 'Manish Tiwari', id: '23CA002' }],
  'MGMT-A-1st Year':[{ name: 'Deepak Aggarwal', id: '24MB001' }, { name: 'Sonia Rao',     id: '24MB002' }, { name: 'Amit Chauhan',  id: '24MB003' }],
  'LAW-A-1st Year': [{ name: 'Ishaan Khanna',   id: '24LW001' }, { name: 'Tanya Malhotra',id: '24LW002' }],
  'PHARM-A-1st Year':[{ name: 'Ravi Sharma',    id: '24PH001' }, { name: 'Priyanka Das',  id: '24PH002' }],
};

function getStudents(dept, section, year) {
  const key = `${dept}-${section.replace('Section ', '')}-${year}`;
  return DEMO_STUDENTS[key] || [];
}

// ─── Bulk Import State ────────────────────────────────────────────────────────
function BulkImportSheet({ dept, section, year, batchRange, onClose }) {
  const [csvText, setCsvText] = useState('Aarav Patel,24CS001\nRiya Sharma,24CS002\nArjun Verma,24CS003');
  const [commonPassword, setCommonPassword] = useState('vgi@2024');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleDownloadTemplate = () => {
    Alert.alert(
      'CSV Template',
      'Template Format:\n\nStudent Full Name,College ID\nAarav Patel,24CS001\nRiya Sharma,24CS002\n\n• One student per line\n• Name then ID separated by comma\n• All students will receive the common password you set\n• Students can change it after first login',
      [{ text: 'Got It', style: 'default' }]
    );
  };

  const handleImport = () => {
    const lines = csvText.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) {
      Alert.alert('Empty', 'Please enter student data in the CSV format.');
      return;
    }
    setImporting(true);
    const parsed = lines.map((line, idx) => {
      const parts = line.split(',');
      return { name: (parts[0] || '').trim(), id: (parts[1] || '').trim(), idx };
    }).filter(s => s.name && s.id);

    setTimeout(() => {
      setImporting(false);
      setImportResult({
        total: parsed.length,
        success: parsed.length,
        students: parsed
      });
    }, 1200);
  };

  return (
    <View style={styles.importSheet}>
      <View style={styles.importHeader}>
        <View>
          <Text style={styles.importTitle}>Bulk Import Students</Text>
          <Text style={styles.importSubtitle}>{dept} • {section} • {year} • Batch {batchRange}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.templateBtn} onPress={handleDownloadTemplate}>
        <Ionicons name="document-outline" size={15} color="#1D4ED8" />
        <Text style={styles.templateBtnText}>View CSV Template Format</Text>
      </TouchableOpacity>

      <Text style={styles.inputLabel}>PASTE STUDENT DATA (Name, CollegeID — one per line)</Text>
      <TextInput
        style={styles.csvInput}
        multiline
        numberOfLines={6}
        value={csvText}
        onChangeText={setCsvText}
        placeholder="Aarav Patel,24CS001&#10;Riya Sharma,24CS002"
        placeholderTextColor={COLORS.textLight}
        textAlignVertical="top"
      />

      <Text style={styles.inputLabel}>COMMON PASSWORD (all students)</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.inputBox, { flex: 1, marginBottom: 0 }]}
          value={commonPassword}
          onChangeText={setCommonPassword}
          placeholder="e.g. vgi@2024"
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
        />
        <View style={styles.passwordNote}>
          <Ionicons name="information-circle-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.passwordNoteText}>Students change on first login</Text>
        </View>
      </View>

      {importResult && (
        <View style={styles.importResultCard}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.importResultTitle}>{importResult.success}/{importResult.total} Students Imported</Text>
            <Text style={styles.importResultSub}>
              {dept} → {section} → {year} (Batch {batchRange})
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.importBtn, importing && { opacity: 0.7 }]}
        onPress={handleImport}
        disabled={importing}
      >
        {importing
          ? <ActivityIndicator color={COLORS.white} size="small" />
          : <>
              <Ionicons name="cloud-upload-outline" size={16} color={COLORS.white} />
              <Text style={styles.importBtnText}>Import {csvText.trim().split('\n').filter(l => l.trim()).length} Students</Text>
            </>
        }
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminStudentRosterSection({ departmentsList }) {
  const depts = departmentsList && departmentsList.length > 0 ? departmentsList : DEFAULT_DEPARTMENTS;

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const students = selectedDept && selectedSection && selectedYear
    ? getStudents(selectedDept.code, selectedSection, selectedYear)
    : [];

  const batchRange = selectedYear ? getBatchRange(selectedYear) : '';

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setSelectedSection(null);
    setSelectedYear(null);
    setShowImport(false);
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setSelectedYear(null);
    setShowImport(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowImport(false);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="people" size={18} color="#1D4ED8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Student Roster & Bulk Import</Text>
          <Text style={styles.subhead}>Select Department → Section → Year to view & import students</Text>
        </View>
      </View>

      {/* Step 1: Department */}
      <Text style={styles.stepLabel}>STEP 1 — SELECT DEPARTMENT</Text>
      <View style={styles.pillsRow}>
        {depts.map(d => (
          <TouchableOpacity
            key={d.code}
            style={[styles.pill, selectedDept?.code === d.code && styles.pillActive]}
            onPress={() => handleDeptSelect(d)}
          >
            <Text style={[styles.pillText, selectedDept?.code === d.code && styles.pillTextActive]}>
              {d.code}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dept Info */}
      {selectedDept && (
        <View style={styles.deptInfoBanner}>
          <Ionicons name="business-outline" size={13} color="#1D4ED8" />
          <Text style={styles.deptInfoText}>{selectedDept.name}</Text>
        </View>
      )}

      {/* Step 2: Section */}
      {selectedDept && (
        <>
          <Text style={styles.stepLabel}>STEP 2 — SELECT SECTION</Text>
          <View style={styles.pillsRow}>
            {ACADEMIC_SECTIONS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.pill, selectedSection === s && styles.pillActive]}
                onPress={() => handleSectionSelect(s)}
              >
                <Text style={[styles.pillText, selectedSection === s && styles.pillTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Step 3: Year */}
      {selectedSection && (
        <>
          <Text style={styles.stepLabel}>STEP 3 — SELECT YEAR</Text>
          <View style={styles.pillsRow}>
            {ACADEMIC_YEARS.map(y => (
              <TouchableOpacity
                key={y}
                style={[styles.pill, selectedYear === y && styles.pillActive]}
                onPress={() => handleYearSelect(y)}
              >
                <Text style={[styles.pillText, selectedYear === y && styles.pillTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Batch Range Badge */}
      {selectedYear && (
        <View style={styles.batchBanner}>
          <Ionicons name="calendar-outline" size={13} color="#065F46" />
          <Text style={styles.batchBannerText}>
            Batch {batchRange} • {selectedDept?.name} • {selectedSection} • {selectedYear}
          </Text>
        </View>
      )}

      {/* Student List */}
      {selectedYear && (
        <View style={styles.studentListCard}>
          <View style={styles.studentListHeader}>
            <Text style={styles.studentListTitle}>
              {students.length > 0 ? `${students.length} Students` : 'No Students Found'}
            </Text>
            <TouchableOpacity
              style={styles.bulkImportBtn}
              onPress={() => setShowImport(!showImport)}
            >
              <Ionicons name="cloud-upload-outline" size={14} color={COLORS.white} />
              <Text style={styles.bulkImportBtnText}>Bulk Import</Text>
            </TouchableOpacity>
          </View>

          {students.map((s, idx) => (
            <View key={s.id} style={styles.studentRow}>
              <View style={styles.studentIndexCircle}>
                <Text style={styles.studentIndex}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.studentName}>{s.name}</Text>
                <Text style={styles.studentId}>{s.id}</Text>
              </View>
              <View style={styles.studentBadge}>
                <Text style={styles.studentBadgeText}>{selectedYear}</Text>
              </View>
            </View>
          ))}

          {students.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-outline" size={28} color={COLORS.textLight} />
              <Text style={styles.emptyStateText}>No students yet. Use Bulk Import to add students.</Text>
            </View>
          )}
        </View>
      )}

      {/* Bulk Import Sheet */}
      {showImport && selectedDept && selectedSection && selectedYear && (
        <BulkImportSheet
          dept={selectedDept.name}
          section={selectedSection}
          year={selectedYear}
          batchRange={batchRange}
          onClose={() => setShowImport(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginTop: 14,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  iconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10
  },
  heading: { fontSize: 14, fontWeight: '800', color: '#1E3A5F' },
  subhead: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  stepLabel: {
    fontSize: 10, fontWeight: '800', color: COLORS.textMuted,
    letterSpacing: 0.5, marginBottom: 6, marginTop: 4
  },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  pill: {
    backgroundColor: '#EFF6FF', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#BFDBFE',
    marginRight: 6, marginBottom: 6
  },
  pillActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  pillText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  pillTextActive: { color: COLORS.white },
  deptInfoBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DBEAFE', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    marginBottom: 10
  },
  deptInfoText: { fontSize: 11.5, color: '#1E40AF', fontWeight: '600', marginLeft: 6, flex: 1 },
  batchBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#D1FAE5', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    marginBottom: 10
  },
  batchBannerText: { fontSize: 11.5, color: '#065F46', fontWeight: '700', marginLeft: 6, flex: 1 },
  studentListCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10, borderWidth: 1,
    borderColor: '#E2E8F0', overflow: 'hidden'
  },
  studentListHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12, paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0'
  },
  studentListTitle: { fontSize: 12, fontWeight: '800', color: '#1E293B' },
  bulkImportBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 7
  },
  bulkImportBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.white, marginLeft: 4 },
  studentRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  studentIndexCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10
  },
  studentIndex: { fontSize: 11, fontWeight: '800', color: '#1D4ED8' },
  studentName: { fontSize: 12.5, fontWeight: '700', color: '#1E293B' },
  studentId: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  studentBadge: {
    backgroundColor: '#EFF6FF', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3
  },
  studentBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8' },
  emptyState: {
    alignItems: 'center', paddingVertical: 24
  },
  emptyStateText: { fontSize: 12, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' },

  // ── Bulk Import Sheet ──
  importSheet: {
    backgroundColor: COLORS.white,
    borderRadius: 12, borderWidth: 1.5,
    borderColor: '#BAE6FD', padding: 14,
    marginTop: 10
  },
  importHeader: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 12
  },
  importTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  importSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center'
  },
  templateBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE',
    paddingHorizontal: 12, paddingVertical: 8,
    marginBottom: 12
  },
  templateBtnText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginLeft: 6 },
  inputLabel: {
    fontSize: 10, fontWeight: '800', color: COLORS.textMuted,
    letterSpacing: 0.5, marginBottom: 4
  },
  csvInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 12.5, color: '#1E293B',
    minHeight: 110, marginBottom: 12,
    fontFamily: 'monospace' // for CSV readability
  },
  passwordRow: {
    marginBottom: 12
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1, borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 13, color: '#1E293B',
    marginBottom: 6
  },
  passwordNote: {
    flexDirection: 'row', alignItems: 'center'
  },
  passwordNoteText: { fontSize: 10.5, color: COLORS.textMuted, marginLeft: 4 },
  importResultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 8, borderWidth: 1, borderColor: '#A7F3D0',
    padding: 10, marginBottom: 12
  },
  importResultTitle: { fontSize: 12, fontWeight: '800', color: '#065F46', marginLeft: 8 },
  importResultSub: { fontSize: 10.5, color: '#047857', marginTop: 2, marginLeft: 8 },
  importBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    paddingVertical: 12, borderRadius: 10
  },
  importBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '800', marginLeft: 6 }
});
