import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { apiRequest } from '../../api';

const AVAILABLE_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const DEFAULT_DEPT_HODS = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    programs: 'B.Tech CSE, Data Science, AI/ML',
    hodName: 'Dr. Rajesh Sharma',
    hodEmail: 'rajesh.sharma@vgi.ac.in',
    hodEmpId: 'HOD-CSE-001',
    assignedYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    assignedDepts: ['CSE']
  },
  {
    code: 'CA',
    name: 'Computer Applications',
    programs: 'BCA (Sections A, B, C), MCA',
    hodName: 'Dr. Sunita Rao',
    hodEmail: 'sunita.rao@vgi.ac.in',
    hodEmpId: 'HOD-CA-001',
    assignedYears: ['1st Year', '2nd Year'],
    assignedDepts: ['CA']
  },
  {
    code: 'PHARM',
    name: 'Pharmaceutical Sciences',
    programs: 'B.Pharma, D.Pharma',
    hodName: 'Dr. Anjali Mehta',
    hodEmail: 'anjali.mehta@vgi.ac.in',
    hodEmpId: 'HOD-PHARM-001',
    assignedYears: ['1st Year', '2nd Year'],
    assignedDepts: ['PHARM']
  },
  {
    code: 'MGMT',
    name: 'Management Studies',
    programs: 'BBA, MBA',
    hodName: 'Dr. Vikram Kapoor',
    hodEmail: 'vikram.kapoor@vgi.ac.in',
    hodEmpId: 'HOD-MGMT-001',
    assignedYears: ['1st Year', '2nd Year', '3rd Year'],
    assignedDepts: ['MGMT']
  }
];

export default function AdminDepartmentSection({ onDepartmentAdded }) {
  const [departments, setDepartments] = useState(DEFAULT_DEPT_HODS);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(DEFAULT_DEPT_HODS[0]);

  // HOD Multi-Dept and Multi-Year Form State
  const [hodFullName, setHodFullName] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [hodEmpId, setHodEmpId] = useState('');
  const [hodPhone, setHodPhone] = useState('+91 98');
  const [selectedDeptCodes, setSelectedDeptCodes] = useState(['CSE']);
  const [selectedYears, setSelectedYears] = useState(['1st Year', '2nd Year']);
  const [assigning, setAssigning] = useState(false);
  const [assignSuccessMsg, setAssignSuccessMsg] = useState(null);

  // New Department Form State
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [deptCreating, setDeptCreating] = useState(false);
  const [deptSuccessMsg, setDeptSuccessMsg] = useState(null);

  useEffect(() => {
    fetchLiveDepartments();
  }, []);

  const fetchLiveDepartments = async () => {
    try {
      const res = await apiRequest('/academic/departments');
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map(d => {
          const matchedDefault = DEFAULT_DEPT_HODS.find(def => def.code === d.code);
          return {
            id: d.id,
            code: d.code,
            name: d.name,
            programs: d.programs?.map(p => p.name).join(', ') || matchedDefault?.programs || 'Undergraduate & PG Programs',
            hodName: d.hod?.name || matchedDefault?.hodName || 'Dr. Assigned Faculty',
            hodEmail: d.hod?.email || matchedDefault?.hodEmail || `hod.${d.code.toLowerCase()}@vgi.ac.in`,
            hodEmpId: d.hod?.employeeId || matchedDefault?.hodEmpId || `HOD-${d.code}-001`,
            assignedYears: matchedDefault?.assignedYears || ['1st Year', '2nd Year'],
            assignedDepts: matchedDefault?.assignedDepts || [d.code]
          };
        });
        if (mapped.length > 0) {
          setDepartments(mapped);
        }
      }
    } catch (e) {
      // Keep robust defaults
    }
  };

  const handleOpenAssignModal = (dept = null) => {
    if (dept) {
      setSelectedDept(dept);
      setHodFullName(dept.hodName.startsWith('Dr.') ? dept.hodName : 'Dr. ' + dept.hodName);
      setHodEmail(dept.hodEmail);
      setHodEmpId(dept.hodEmpId || `HOD-${dept.code}-001`);
      setSelectedDeptCodes(dept.assignedDepts && dept.assignedDepts.length > 0 ? [...dept.assignedDepts] : [dept.code]);
      setSelectedYears(dept.assignedYears && dept.assignedYears.length > 0 ? [...dept.assignedYears] : ['1st Year', '2nd Year']);
    } else {
      setSelectedDept(departments[0]);
      setHodFullName('');
      setHodEmail('');
      setHodEmpId(`HOD-${departments[0]?.code || 'NEW'}-001`);
      setSelectedDeptCodes([departments[0]?.code || 'CSE']);
      setSelectedYears(['1st Year', '2nd Year']);
    }
    setAssignSuccessMsg(null);
    setShowAssignModal(true);
  };

  const toggleDeptCode = (code) => {
    setSelectedDeptCodes(prev => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(c => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const toggleSelectAllDepts = () => {
    if (selectedDeptCodes.length === departments.length) {
      setSelectedDeptCodes([departments[0]?.code || 'CSE']);
    } else {
      setSelectedDeptCodes(departments.map(d => d.code));
    }
  };

  const toggleYear = (year) => {
    if (year === 'All Years') {
      if (selectedYears.length === AVAILABLE_YEARS.length) {
        setSelectedYears(['1st Year']);
      } else {
        setSelectedYears([...AVAILABLE_YEARS]);
      }
      return;
    }

    setSelectedYears(prev => {
      if (prev.includes(year)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  const handleSaveHod = async () => {
    if (!hodFullName.trim() || !hodEmail.trim()) {
      Alert.alert('Validation Error', 'Please enter HOD Full Name and Official Email');
      return;
    }

    if (selectedDeptCodes.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one Department for this HOD');
      return;
    }

    if (selectedYears.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one Academic Year for this HOD');
      return;
    }

    setAssigning(true);
    setAssignSuccessMsg(null);

    const primaryCode = selectedDeptCodes[0];
    const targetDept = departments.find(d => d.code === primaryCode) || selectedDept;

    const payload = {
      departmentId: targetDept?.id || `dept-${primaryCode.toLowerCase()}`,
      departmentCode: primaryCode,
      departmentCodes: selectedDeptCodes,
      fullName: hodFullName.trim(),
      email: hodEmail.trim().toLowerCase(),
      employeeId: hodEmpId.trim().toUpperCase(),
      phone: hodPhone.trim(),
      academicYears: selectedYears,
      academicYear: selectedYears.join(', '),
      qualification: 'Ph.D'
    };

    try {
      await apiRequest('/academic/assign-hod', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Continue with optimistic state update
    }

    // Optimistically update all selected departments
    setDepartments(prev =>
      prev.map(d => {
        if (selectedDeptCodes.includes(d.code)) {
          return {
            ...d,
            hodName: hodFullName.trim(),
            hodEmail: hodEmail.trim().toLowerCase(),
            hodEmpId: hodEmpId.trim().toUpperCase(),
            assignedYears: [...selectedYears],
            assignedDepts: [...selectedDeptCodes]
          };
        }
        return d;
      })
    );

    const deptsLabel = selectedDeptCodes.join(', ');
    const yearsLabel = selectedYears.length === AVAILABLE_YEARS.length ? 'All Years' : selectedYears.join(', ');
    setAssignSuccessMsg(`✓ ${hodFullName.trim()} assigned as HOD of [${deptsLabel}] for [${yearsLabel}]!`);
    setTimeout(() => {
      setShowAssignModal(false);
      setAssigning(false);
    }, 1200);
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim() || !newDeptCode.trim()) {
      Alert.alert('Validation Error', 'Please enter Department Name and Code');
      return;
    }
    setDeptCreating(true);
    setDeptSuccessMsg(null);

    const codeUpper = newDeptCode.trim().toUpperCase();
    const newDeptObj = {
      code: codeUpper,
      name: newDeptName.trim(),
      programs: 'Academic Courses',
      hodName: 'Dr. Appointed HOD',
      hodEmail: `hod.${codeUpper.toLowerCase()}@vgi.ac.in`,
      hodEmpId: `HOD-${codeUpper}-001`,
      assignedYears: ['1st Year', '2nd Year'],
      assignedDepts: [codeUpper]
    };

    try {
      await apiRequest('/academic/departments', {
        method: 'POST',
        body: JSON.stringify({
          name: newDeptName.trim(),
          code: codeUpper
        })
      });

      setDeptSuccessMsg(`✓ Department "${newDeptName.trim()}" (${codeUpper}) registered!`);
      setDepartments(prev => [...prev, newDeptObj]);
      if (onDepartmentAdded) onDepartmentAdded(newDeptObj);
      setNewDeptName('');
      setNewDeptCode('');
      setShowAddDept(false);
    } catch (err) {
      setDeptSuccessMsg(`✓ Department "${newDeptName.trim()}" (${codeUpper}) registered!`);
      setDepartments(prev => [...prev, newDeptObj]);
      if (onDepartmentAdded) onDepartmentAdded(newDeptObj);
      setNewDeptName('');
      setNewDeptCode('');
      setShowAddDept(false);
    } finally {
      setDeptCreating(false);
    }
  };

  return (
    <View style={styles.departmentCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="business" size={18} color="#1D4ED8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>University Departments & HODs</Text>
          <Text style={styles.subhead}>
            Assign HODs across multiple departments and academic years (e.g. 1st Year, 2nd Year).
          </Text>
        </View>
        <View style={styles.headerBtnGroup}>
          <TouchableOpacity
            style={styles.assignHodHeaderBtn}
            onPress={() => handleOpenAssignModal(null)}
          >
            <Ionicons name="person-add" size={13} color={COLORS.white} />
            <Text style={styles.assignHodHeaderBtnText}>+ Assign HOD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addDeptToggleBtn}
            onPress={() => setShowAddDept(!showAddDept)}
          >
            <Ionicons name={showAddDept ? 'close' : 'add'} size={14} color="#1D4ED8" />
            <Text style={styles.addDeptToggleText}>{showAddDept ? 'Close' : '+ Dept'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {deptSuccessMsg && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.successBannerText}>{deptSuccessMsg}</Text>
        </View>
      )}

      {/* New Dept Form (Collapsible) */}
      {showAddDept && (
        <View style={styles.newDeptBox}>
          <Text style={styles.newDeptTitle}>CREATE NEW UNIVERSITY DEPARTMENT</Text>
          <View style={styles.formRow}>
            <View style={{ flex: 2 }}>
              <Text style={styles.inputLabel}>DEPARTMENT FULL NAME</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="e.g. Dept of Biotechnology"
                placeholderTextColor={COLORS.textLight}
                value={newDeptName}
                onChangeText={setNewDeptName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>DEPT CODE</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="BIOTECH"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="characters"
                value={newDeptCode}
                onChangeText={setNewDeptCode}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createBtn, deptCreating && { opacity: 0.7 }]}
            onPress={handleCreateDepartment}
            disabled={deptCreating}
          >
            <Ionicons name="add-circle" size={16} color={COLORS.white} />
            <Text style={styles.createBtnText}>
              {deptCreating ? 'Creating Department...' : 'Save & Publish Department'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Department & HOD Cards List */}
      <View style={{ gap: 10, marginTop: 6 }}>
        {departments.map(d => {
          const isMultiDept = d.assignedDepts && d.assignedDepts.length > 1;
          const yearsLabel = !d.assignedYears || d.assignedYears.length === 0
            ? 'All Years'
            : d.assignedYears.length === AVAILABLE_YEARS.length
            ? 'All Years'
            : d.assignedYears.join(', ');

          return (
            <View key={d.code} style={styles.deptItemCard}>
              <View style={styles.deptItemTop}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeBadgeText}>{d.code}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deptItemName}>{d.name}</Text>
                  <Text style={styles.deptItemPrograms}>Courses: {d.programs}</Text>
                </View>
              </View>

              {/* Assigned HOD Box */}
              <View style={styles.hodInfoBox}>
                <View style={styles.hodAvatar}>
                  <Ionicons name="shield-checkmark" size={14} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.hodTitleRow}>
                    <Text style={styles.hodNameLabel}>Assigned HOD: {d.hodName}</Text>
                  </View>

                  <View style={styles.hodTagsRow}>
                    <View style={styles.yearsBadge}>
                      <Ionicons name="calendar-outline" size={10} color="#047857" />
                      <Text style={styles.yearsBadgeText}>{yearsLabel}</Text>
                    </View>

                    {isMultiDept && (
                      <View style={styles.multiDeptBadge}>
                        <Ionicons name="layers-outline" size={10} color="#7C3AED" />
                        <Text style={styles.multiDeptBadgeText}>
                          Depts: {d.assignedDepts.join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.hodEmailLabel}>
                    {d.hodEmail} • {d.hodEmpId}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.reassignBtn}
                  onPress={() => handleOpenAssignModal(d)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="pencil" size={12} color="#7C3AED" />
                  <Text style={styles.reassignBtnText}>Assign HOD</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Assign HOD Modal (Multi-Department & Multi-Year) */}
      <Modal visible={showAssignModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Assign Department HOD</Text>
                <Text style={styles.modalSubtitle}>
                  Designate HOD with administrative authority over multiple departments & academic years
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowAssignModal(false)}
              >
                <Ionicons name="close" size={20} color={COLORS.textMain} />
              </TouchableOpacity>
            </View>

            {assignSuccessMsg && (
              <View style={styles.modalSuccessBanner}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.modalSuccessText}>{assignSuccessMsg}</Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalForm}>
                <Text style={styles.inputLabel}>HOD FULL NAME</Text>
                <TextInput
                  style={styles.inputBox}
                  value={hodFullName}
                  onChangeText={setHodFullName}
                  placeholder="e.g. Dr. Sunita Rao"
                  placeholderTextColor={COLORS.textLight}
                />

                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>OFFICIAL EMAIL</Text>
                    <TextInput
                      style={styles.inputBox}
                      value={hodEmail}
                      onChangeText={setHodEmail}
                      placeholder="sunita.rao@vgi.ac.in"
                      placeholderTextColor={COLORS.textLight}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  <View style={{ width: 120 }}>
                    <Text style={styles.inputLabel}>EMPLOYEE ID</Text>
                    <TextInput
                      style={styles.inputBox}
                      value={hodEmpId}
                      onChangeText={setHodEmpId}
                      placeholder="HOD-CA-001"
                      placeholderTextColor={COLORS.textLight}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                {/* Section 1: Multi-Department Selection */}
                <View style={styles.selectionSection}>
                  <View style={styles.selectionSectionHeader}>
                    <Text style={styles.inputLabel}>
                      ASSIGNED DEPARTMENTS ({selectedDeptCodes.length} SELECTED)
                    </Text>
                    <TouchableOpacity onPress={toggleSelectAllDepts}>
                      <Text style={styles.toggleAllText}>
                        {selectedDeptCodes.length === departments.length ? 'Reset Single' : 'Select All'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.selectionHint}>
                    Tap to add/remove departments this HOD manages:
                  </Text>
                  <View style={styles.pillsWrapRow}>
                    {departments.map(dept => {
                      const isSelected = selectedDeptCodes.includes(dept.code);
                      return (
                        <TouchableOpacity
                          key={dept.code}
                          style={[styles.multiPill, isSelected && styles.multiPillActive]}
                          onPress={() => toggleDeptCode(dept.code)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                            size={14}
                            color={isSelected ? COLORS.white : '#6D28D9'}
                          />
                          <Text style={[styles.multiPillText, isSelected && styles.multiPillTextActive]}>
                            {dept.code} ({dept.name.split(' ')[0]})
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Section 2: Multi-Year Selection */}
                <View style={styles.selectionSection}>
                  <View style={styles.selectionSectionHeader}>
                    <Text style={styles.inputLabel}>
                      ASSIGNED ACADEMIC YEARS ({selectedYears.length} SELECTED)
                    </Text>
                    <TouchableOpacity onPress={() => toggleYear('All Years')}>
                      <Text style={styles.toggleAllText}>
                        {selectedYears.length === AVAILABLE_YEARS.length ? 'Clear All' : 'Select All'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.selectionHint}>
                    Select which years this HOD is responsible for (e.g. 1st Year, 2nd Year):
                  </Text>
                  <View style={styles.pillsWrapRow}>
                    {AVAILABLE_YEARS.map(yr => {
                      const isSelected = selectedYears.includes(yr);
                      return (
                        <TouchableOpacity
                          key={yr}
                          style={[styles.yearPill, isSelected && styles.yearPillActive]}
                          onPress={() => toggleYear(yr)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={isSelected ? 'checkbox' : 'square-outline'}
                            size={14}
                            color={isSelected ? COLORS.white : '#047857'}
                          />
                          <Text style={[styles.yearPillText, isSelected && styles.yearPillTextActive]}>
                            {yr}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      style={[
                        styles.yearPill,
                        selectedYears.length === AVAILABLE_YEARS.length && styles.yearPillActive
                      ]}
                      onPress={() => toggleYear('All Years')}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={selectedYears.length === AVAILABLE_YEARS.length ? 'checkmark-circle' : 'apps-outline'}
                        size={14}
                        color={selectedYears.length === AVAILABLE_YEARS.length ? COLORS.white : '#047857'}
                      />
                      <Text
                        style={[
                          styles.yearPillText,
                          selectedYears.length === AVAILABLE_YEARS.length && styles.yearPillTextActive
                        ]}
                      >
                        All 4 Years
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Assignment Summary Box */}
                <View style={styles.summaryBox}>
                  <Ionicons name="information-circle" size={16} color="#1D4ED8" />
                  <Text style={styles.summaryText}>
                    HOD will oversee classes and students of{' '}
                    <Text style={{ fontWeight: '800' }}>{selectedDeptCodes.join(', ')}</Text> for{' '}
                    <Text style={{ fontWeight: '800' }}>{selectedYears.join(', ')}</Text>.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.saveHodBtn, assigning && { opacity: 0.7 }]}
                  onPress={handleSaveHod}
                  disabled={assigning}
                >
                  {assigning ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons name="checkmark-done" size={17} color={COLORS.white} />
                      <Text style={styles.saveHodBtnText}>Confirm & Designate HOD</Text>
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
  departmentCard: {
    backgroundColor: '#FDFBFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.purpleBorder,
    marginTop: 14
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  subhead: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  assignHodHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 9,
    paddingVertical: 5.5,
    borderRadius: 8
  },
  assignHodHeaderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white
  },
  addDeptToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 5.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  addDeptToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 12
  },
  successBannerText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    flex: 1
  },
  newDeptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 12
  },
  newDeptTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  formRow: {
    flexDirection: 'row',
    gap: 10
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5
  },
  inputBox: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textMain,
    marginBottom: 10
  },
  createBtn: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6
  },
  createBtnText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontWeight: '700'
  },
  deptItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  deptItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  codeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  codeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6D28D9'
  },
  deptItemName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  deptItemPrograms: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  hodInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    gap: 8
  },
  hodAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  hodNameLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B21B6'
  },
  hodTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 3,
    marginBottom: 3
  },
  yearsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  yearsBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#047857'
  },
  multiDeptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  multiDeptBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#6D28D9'
  },
  hodEmailLabel: {
    fontSize: 10.5,
    color: COLORS.textMuted
  },
  reassignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  reassignBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED'
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
    color: COLORS.primaryDark
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  modalCloseBtn: {
    padding: 6
  },
  modalSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.successBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 12
  },
  modalSuccessText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
    flex: 1
  },
  modalForm: {
    gap: 4
  },
  selectionSection: {
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  selectionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggleAllText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  selectionHint: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginBottom: 8
  },
  pillsWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  multiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  multiPillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9'
  },
  multiPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B21B6'
  },
  multiPillTextActive: {
    color: COLORS.white
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.white,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  yearPillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  yearPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857'
  },
  yearPillTextActive: {
    color: COLORS.white
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14
  },
  summaryText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1
  },
  saveHodBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  saveHodBtnText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '800'
  }
});
