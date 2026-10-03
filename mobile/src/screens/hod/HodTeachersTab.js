import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { apiRequest } from '../../api';
import DropdownSelect from '../../components/DropdownSelect';

const DEPARTMENTS = [
  { code: 'CA', name: 'Computer Applications', course: 'BCA & MCA', hod: 'Dr. Sunita Rao' },
  { code: 'CSE', name: 'Computer Science & Engineering', course: 'B.Tech CSE & Data Science', hod: 'Dr. Rajesh Sharma' },
  { code: 'PHARM', name: 'Pharmaceutical Sciences', course: 'B.Pharma & D.Pharma', hod: 'Dr. Anjali Mehta' },
  { code: 'MGMT', name: 'Management Studies', course: 'BBA & MBA', hod: 'Dr. Vikram Kapoor' }
];

const DEFAULT_FACULTY_ROSTER = {
  'CA': [
    { id: 't-ca-1', name: 'Dr. Sunita Rao', empId: 'HOD-CA-001', desig: 'Head of Department & Professor', qual: 'Ph.D. in Computer Science', email: 'sunita.rao@vgi.ac.in', sections: 'BCA (Sem 3 & 5)', isHod: true },
    { id: 't-ca-2', name: 'Prof. Neha Gupta', empId: 'EMP-CA-012', desig: 'Assistant Professor', qual: 'M.Tech (Software Engg)', email: 'neha.gupta@vgi.ac.in', sections: 'BCA (Sem 3 Sec C)', isHod: false },
    { id: 't-ca-3', name: 'Prof. Rohit Singhania', empId: 'EMP-CA-015', desig: 'Assistant Professor', qual: 'M.C.A., Ph.D.', email: 'rohit.s@vgi.ac.in', sections: 'BCA (Sem 3 Sec A & C)', isHod: false }
  ],
  'CSE': [
    { id: 't-cse-1', name: 'Dr. Rajesh Sharma', empId: 'HOD-CSE-001', desig: 'Head of Department & Professor', qual: 'Ph.D. in Computer Science', email: 'rajesh.sharma@vgi.ac.in', sections: 'B.Tech (Sem 5 Sec A)', isHod: true },
    { id: 't-cse-2', name: 'Prof. Priya Verma', empId: 'EMP002', desig: 'Associate Professor', qual: 'Ph.D. in Machine Learning', email: 'priya.verma@vgi.ac.in', sections: 'B.Tech (Sem 5 Sec A & B)', isHod: false },
    { id: 't-cse-3', name: 'Prof. Amit Kumar', empId: 'EMP003', desig: 'Assistant Professor', qual: 'M.Tech in Data Systems', email: 'amit.kumar@vgi.ac.in', sections: 'B.Tech (Sem 5 Sec B)', isHod: false }
  ],
  'PHARM': [
    { id: 't-ph-1', name: 'Dr. Anjali Mehta', empId: 'HOD-PHARM-001', desig: 'Head of Department & Professor', qual: 'Ph.D. in Pharmaceutics', email: 'anjali.mehta@vgi.ac.in', sections: 'B.Pharma (Sem 3 Sec A)', isHod: true },
    { id: 't-ph-2', name: 'Prof. Rakesh Bansal', empId: 'EMP-PH-004', desig: 'Assistant Professor', qual: 'M.Pharm (Pharmacology)', email: 'rakesh.b@vgi.ac.in', sections: 'B.Pharma (Sem 3 Sec A)', isHod: false }
  ],
  'MGMT': [
    { id: 't-mg-1', name: 'Dr. Vikram Kapoor', empId: 'HOD-MGMT-001', desig: 'Head of Department & Professor', qual: 'Ph.D. in Business Mgmt', email: 'vikram.kapoor@vgi.ac.in', sections: 'BBA (Sem 3 Sec A)', isHod: true },
    { id: 't-mg-2', name: 'Prof. Shweta Rastogi', empId: 'EMP-MG-008', desig: 'Assistant Professor', qual: 'MBA (Finance), Ph.D.', email: 'shweta.r@vgi.ac.in', sections: 'BBA (Sem 3 Sec A)', isHod: false }
  ]
};

export default function HodTeachersTab() {
  const [selectedDeptCode, setSelectedDeptCode] = useState('CA');
  const [facultyRosters, setFacultyRosters] = useState(DEFAULT_FACULTY_ROSTER);
  const [loading, setLoading] = useState(false);

  // Add Faculty Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [qualification, setQualification] = useState('Ph.D. / M.Tech');
  const [assignedSections, setAssignedSections] = useState('Section C');
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const activeDept = DEPARTMENTS.find(d => d.code === selectedDeptCode) || DEPARTMENTS[0];
  const currentTeachers = facultyRosters[selectedDeptCode] || [];

  const handleOpenAddModal = () => {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    setEmployeeId(`EMP-${selectedDeptCode}-${randomDigits}`);
    setEmail(`faculty.${randomDigits}@vgi.ac.in`);
    setFullName('');
    setAssignedSections('Section C');
    setSuccessInfo(null);
    setErrorMsg(null);
    setShowAddModal(true);
  };

  const handleCreateTeacher = async () => {
    if (!fullName.trim() || !employeeId.trim() || !email.trim()) {
      setErrorMsg('Please enter Full Name, Employee ID, and College Email.');
      return;
    }

    setSavingTeacher(true);
    setErrorMsg(null);
    setSuccessInfo(null);

    const newFacultyObj = {
      id: 't-dyn-' + Date.now(),
      name: fullName.trim(),
      empId: employeeId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      desig: designation,
      qual: qualification,
      sections: `${activeDept.course.split(' ')[0]} (${assignedSections})`,
      isHod: designation.includes('HOD')
    };

    try {
      await apiRequest('/teachers', {
        method: 'POST',
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          employeeId: employeeId.trim().toUpperCase(),
          phone: phone.trim(),
          designation,
          qualification,
          departmentCode: selectedDeptCode,
          role: 'TEACHER',
          password: 'teacher123'
        })
      });
    } catch (err) {}

    setFacultyRosters(prev => ({
      ...prev,
      [selectedDeptCode]: [...(prev[selectedDeptCode] || []), newFacultyObj]
    }));

    setSuccessInfo({
      name: fullName.trim(),
      empId: employeeId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      designation
    });
    setSavingTeacher(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.actionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionHeading}>College Faculty Directory</Text>
          <Text style={styles.sectionSubtitle}>
            Teachers, professors, and lab instructors by department & assigned sections.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddModal} activeOpacity={0.8}>
          <Ionicons name="person-add" size={14} color={COLORS.white} />
          <Text style={styles.addBtnText}>+ Add Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Department Selector Dropdown */}
      <DropdownSelect
        label="SELECT DEPARTMENT / PROGRAM"
        value={selectedDeptCode}
        options={DEPARTMENTS.map(d => ({
          label: `${d.code} — ${d.name}`,
          value: d.code,
          subtitle: `Courses: ${d.course} • HOD: ${d.hod}`
        }))}
        onSelect={(val) => setSelectedDeptCode(val)}
        icon="business-outline"
      />

      {/* Faculty Cards List */}
      <View style={styles.listContainer}>
        {currentTeachers.map((t, idx) => (
          <View key={t.id || idx} style={[styles.teacherCard, t.isHod && styles.hodHighlightCard]}>
            <View style={[styles.teacherAvatar, t.isHod && { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
              <Text style={[styles.teacherAvatarText, t.isHod && { color: '#6D28D9' }]}>
                {t.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.teacherName}>{t.name}</Text>
                <View style={[styles.empBadge, t.isHod && { backgroundColor: '#EDE9FE' }]}>
                  <Text style={[styles.empBadgeText, t.isHod && { color: '#6D28D9' }]}>{t.empId}</Text>
                </View>
              </View>

              <Text style={styles.teacherDesig}>{t.desig}</Text>
              <Text style={styles.teacherQual}>{t.qual}</Text>

              <View style={styles.metaRow}>
                <Ionicons name="layers-outline" size={12} color="#059669" />
                <Text style={styles.metaText}>Sections: <Text style={{ fontWeight: '700' }}>{t.sections}</Text></Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={11} color={COLORS.textMuted} />
                <Text style={styles.contactText}>{t.email}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* ADD FACULTY MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Add Teacher to Department</Text>
                <Text style={styles.modalSub}>
                  {activeDept.name} ({activeDept.code}) • Assigned HOD: {activeDept.hod}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {successInfo ? (
                <View style={styles.successCard}>
                  <Ionicons name="checkmark-circle" size={38} color="#059669" style={{ marginBottom: 8 }} />
                  <Text style={styles.successHeading}>Teacher Registered!</Text>
                  <Text style={styles.successText}>
                    <Text style={{ fontWeight: '800' }}>{successInfo.name}</Text> added to {activeDept.name}.
                  </Text>

                  <View style={styles.credsBox}>
                    <Text style={styles.credTitle}>Faculty Portal Credentials:</Text>
                    <Text style={styles.credText}>Email: {successInfo.email}</Text>
                    <Text style={styles.credText}>Employee ID: {successInfo.empId}</Text>
                    <Text style={styles.credText}>Default Password: <Text style={{ fontWeight: '800' }}>teacher123</Text></Text>
                  </View>

                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => {
                      setShowAddModal(false);
                      setSuccessInfo(null);
                    }}
                  >
                    <Text style={styles.doneBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  {errorMsg && (
                    <View style={styles.errorBox}>
                      <Ionicons name="alert-circle" size={16} color="#DC2626" />
                      <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                  )}

                  <Text style={styles.inputLabel}>TEACHER FULL NAME</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Prof. Rohit Singhania"
                    placeholderTextColor={COLORS.textLight}
                  />

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>EMPLOYEE ID</Text>
                      <TextInput
                        style={styles.inputBox}
                        value={employeeId}
                        onChangeText={setEmployeeId}
                        placeholder="EMP-CA-015"
                        placeholderTextColor={COLORS.textLight}
                        autoCapitalize="characters"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>ASSIGNED SECTION</Text>
                      <TextInput
                        style={styles.inputBox}
                        value={assignedSections}
                        onChangeText={setAssignedSections}
                        placeholder="e.g. Section C"
                        placeholderTextColor={COLORS.textLight}
                      />
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>OFFICIAL EMAIL</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="rohit.s@vgi.ac.in"
                    placeholderTextColor={COLORS.textLight}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  <Text style={styles.inputLabel}>ACADEMIC DESIGNATION</Text>
                  <View style={styles.pillRow}>
                    {['Assistant Professor', 'Associate Professor', 'Professor', 'Lab Instructor'].map(d => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.smallPill, designation === d && styles.smallPillActive]}
                        onPress={() => setDesignation(d)}
                      >
                        <Text style={[styles.smallPillText, designation === d && styles.smallPillTextActive]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.saveTeacherBtn, savingTeacher && { opacity: 0.7 }]}
                    onPress={handleCreateTeacher}
                    disabled={savingTeacher}
                  >
                    {savingTeacher ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <>
                        <Ionicons name="checkmark-done" size={17} color={COLORS.white} />
                        <Text style={styles.saveTeacherBtnText}>Confirm & Add Teacher</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white
  },
  deptPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  deptPillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  deptPillCode: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  deptPillCodeActive: {
    color: COLORS.white
  },
  deptPillName: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  deptPillNameActive: {
    color: '#D1FAE5'
  },
  deptHodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 10
  },
  deptHodTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#312E81'
  },
  deptHodSub: {
    fontSize: 11,
    color: '#4338CA',
    marginTop: 1
  },
  listContainer: {
    gap: 10,
    paddingBottom: 20
  },
  teacherCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 10
  },
  hodHighlightCard: {
    borderColor: '#DDD6FE',
    backgroundColor: '#FAF5FF'
  },
  teacherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teacherAvatarText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 13
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  empBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  empBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.textMuted
  },
  teacherDesig: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2
  },
  teacherQual: {
    fontSize: 10.5,
    color: COLORS.textMuted
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  metaText: {
    fontSize: 11,
    color: '#047857'
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  contactText: {
    fontSize: 10.5,
    color: COLORS.textMuted
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
    paddingBottom: 36
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  closeModalBtn: {
    padding: 6
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: COLORS.textMain
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  smallPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  smallPillActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  smallPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMain
  },
  smallPillTextActive: {
    color: COLORS.white,
    fontWeight: '700'
  },
  saveTeacherBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8
  },
  saveTeacherBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: 20
  },
  successHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669'
  },
  successText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center'
  },
  credsBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginVertical: 14
  },
  credTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 4
  },
  credText: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2
  },
  doneBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8
  },
  doneBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 6
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600'
  }
});
