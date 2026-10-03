import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { UNIVERSITY_COURSES, ACADEMIC_YEARS, DEFAULT_DEPARTMENTS } from '../../constants/academicData';
import { apiRequest } from '../../api';
import DropdownSelect from '../../components/DropdownSelect';

export default function AdminEnrollmentSection({ departmentsList = DEFAULT_DEPARTMENTS, onEnrollSuccess }) {
  const depts = (Array.isArray(departmentsList) && departmentsList.length > 0) ? departmentsList : DEFAULT_DEPARTMENTS;
  const [enrollType, setEnrollType] = useState('HOD'); // 'HOD' | 'TEACHER' | 'STUDENT'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('HOD' + Math.floor(100 + Math.random() * 900));
  const [phone, setPhone] = useState('+91 98');
  const [password, setPassword] = useState('hod123');
  const [departmentCode, setDepartmentCode] = useState('CSE');
  const [hodAssignedYears, setHodAssignedYears] = useState('1st Year, 2nd Year');
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [studentYear, setStudentYear] = useState('1st Year');
  const [loading, setLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleEnrollTypeSwitch = (type) => {
    setEnrollType(type);
    setErrorMsg(null);
    setSuccessBanner(null);
    if (type === 'HOD') {
      setPassword('hod123');
      setIdentifier('HOD' + Math.floor(100 + Math.random() * 900));
    } else if (type === 'TEACHER') {
      setPassword('teacher123');
      setIdentifier('EMP' + Math.floor(100 + Math.random() * 900));
    } else {
      setPassword('student123');
      setIdentifier('24DS' + Math.floor(100 + Math.random() * 900));
    }
  };

  const handleCreateUser = async () => {
    if (!fullName.trim() || !email.trim() || !identifier.trim()) {
      setErrorMsg('Please enter Full Name, Email, and Employee/Roll ID');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessBanner(null);

    try {
      const dept = depts.find(d => d.code === departmentCode) || depts[0];

      if (enrollType === 'HOD') {
        const res = await apiRequest('/academic/assign-hod', {
          method: 'POST',
          body: JSON.stringify({
            departmentId: dept.id,
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            employeeId: identifier.trim().toUpperCase(),
            phone: phone.trim(),
            qualification: 'Ph.D. in ' + dept.name,
            academicYear: hodAssignedYears,
            academicYears: hodAssignedYears.split(', ')
          })
        });

        setLoading(false);
        if (res.success || res.data) {
          setSuccessBanner({
            type: 'HOD',
            name: fullName,
            id: identifier.toUpperCase(),
            email: email.toLowerCase(),
            password: password || 'hod123',
            year: `${dept.name} (${hodAssignedYears})`
          });
          setFullName('');
          setEmail('');
          if (onEnrollSuccess) onEnrollSuccess();
        } else {
          setErrorMsg(res.error?.message || 'Failed to designate HOD');
        }
      } else if (enrollType === 'TEACHER') {
        const res = await apiRequest('/teachers', {
          method: 'POST',
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            employeeId: identifier.trim().toUpperCase(),
            phone: phone.trim(),
            password: password || 'teacher123',
            departmentId: dept.id,
            departmentCode: dept.code,
            role: 'TEACHER',
            designation: `${selectedCourse} (${studentYear}) Faculty • Assistant Professor`
          })
        });

        setLoading(false);
        if (res.success) {
          setSuccessBanner({
            type: 'TEACHER',
            name: fullName,
            id: identifier.toUpperCase(),
            email: email.toLowerCase(),
            password: password || 'teacher123',
            year: `${selectedCourse} (${studentYear})`
          });
          setFullName('');
          setEmail('');
          if (onEnrollSuccess) onEnrollSuccess();
        } else {
          setErrorMsg(res.error?.message || 'Failed to create faculty member');
        }
      } else {
        const sectionsRes = await apiRequest('/academic/sections');
        const firstSection = sectionsRes.data?.[0];

        const res = await apiRequest('/students', {
          method: 'POST',
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            rollNumber: identifier.trim().toUpperCase(),
            enrollmentNumber: 'ENR' + identifier.trim().toUpperCase(),
            phone: phone.trim(),
            password: password || 'student123',
            departmentId: dept.id,
            departmentCode: dept.code,
            programId: firstSection?.semester?.batch?.programId || '9d1f730e-d62e-423f-9501-e7855bdb3357',
            programName: selectedCourse,
            year: studentYear,
            semesterId: firstSection?.semesterId || 'f295ef5e-9ae0-425c-ac12-3023af8799f2',
            sectionId: firstSection?.id || 'b0e84d88-273a-4434-b7a1-e7e5605cb8b8',
            guardianName: 'Guardian of ' + fullName.trim()
          })
        });

        setLoading(false);
        if (res.success) {
          setSuccessBanner({
            type: 'STUDENT',
            name: fullName,
            id: identifier.toUpperCase(),
            email: email.toLowerCase(),
            password: password || 'student123',
            year: `${selectedCourse} (${studentYear})`
          });
          setFullName('');
          setEmail('');
          if (onEnrollSuccess) onEnrollSuccess();
        } else {
          setErrorMsg(res.error?.message || 'Failed to create student account');
        }
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Error communicating with ERP server');
    }
  };

  return (
    <View style={styles.enrollmentCard}>
      <View style={styles.enrollHeader}>
        <View style={styles.enrollIconCircle}>
          <Ionicons name="person-add" size={18} color={COLORS.accentPurple} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.enrollHeading}>Enroll Academic Member</Text>
          <Text style={styles.enrollSubhead}>Designate HOD by Year, add Faculty, or enroll Students</Text>
        </View>
      </View>

      {/* Role Tabs */}
      <View style={styles.roleTabsRow}>
        {[
          { key: 'HOD', label: 'Add HOD', icon: 'shield-checkmark' },
          { key: 'TEACHER', label: 'Add Faculty', icon: 'person' },
          { key: 'STUDENT', label: 'Add Student', icon: 'school' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.roleTabBtn, enrollType === tab.key && styles.roleTabBtnActive]}
            onPress={() => handleEnrollTypeSwitch(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={14}
              color={enrollType === tab.key ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.roleTabBtnText, enrollType === tab.key && styles.roleTabBtnTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>FULL NAME</Text>
        <TextInput
          style={styles.inputBox}
          placeholder={enrollType === 'HOD' ? 'e.g. Dr. Rajiv Ranjan' : enrollType === 'TEACHER' ? 'e.g. Prof. Kavita Sen' : 'e.g. Rahul Sharma'}
          placeholderTextColor={COLORS.textLight}
          value={fullName}
          onChangeText={setFullName}
        />

        <View style={styles.formRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>OFFICIAL EMAIL</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="name@vgi.ac.in"
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={{ width: 110 }}>
            <Text style={styles.inputLabel}>{enrollType === 'STUDENT' ? 'ROLL NO' : 'EMP ID'}</Text>
            <TextInput
              style={styles.inputBox}
              placeholder={enrollType === 'STUDENT' ? '24DS015' : 'EMP005'}
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="characters"
              value={identifier}
              onChangeText={setIdentifier}
            />
          </View>
        </View>

        {/* Dropdown for HOD Academic Years or Degree Course */}
        {enrollType === 'HOD' ? (
          <DropdownSelect
            label="ASSIGNED ACADEMIC YEARS"
            value={hodAssignedYears}
            options={[
              { label: 'All Years (1st - 4th Year)', value: 'All Years' },
              { label: '1st & 2nd Year (Junior Coordinator)', value: '1st Year, 2nd Year' },
              { label: '3rd & 4th Year (Senior Coordinator)', value: '3rd Year, 4th Year' },
              { label: '1st Year (Freshman HOD)', value: '1st Year' },
              { label: '2nd Year', value: '2nd Year' },
              { label: '3rd Year', value: '3rd Year' },
              { label: '4th Year (Senior HOD)', value: '4th Year' }
            ]}
            onSelect={(val) => setHodAssignedYears(val)}
            icon="calendar-outline"
          />
        ) : (
          <DropdownSelect
            label="SELECT DEGREE / PROGRAM"
            value={selectedCourse}
            options={UNIVERSITY_COURSES.map(c => ({ label: c, value: c }))}
            onSelect={(val) => setSelectedCourse(val)}
            icon="school-outline"
          />
        )}

        {/* Dropdown for Student Academic Year */}
        {enrollType !== 'HOD' && (
          <DropdownSelect
            label="ACADEMIC YEAR"
            value={studentYear}
            options={ACADEMIC_YEARS.map(yr => ({ label: yr, value: yr }))}
            onSelect={(val) => setStudentYear(val)}
            icon="calendar-outline"
          />
        )}

        {/* Dropdown for Academic Department */}
        <DropdownSelect
          label="ACADEMIC DEPARTMENT"
          value={departmentCode}
          options={depts.map(d => ({
            label: `${d.code} — ${d.name}`,
            value: d.code
          }))}
          onSelect={(val) => setDepartmentCode(val)}
          icon="business-outline"
        />

        <View style={styles.formRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>LOGIN PASSWORD (UNHASHED)</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. hod123 or teacher123"
              placeholderTextColor={COLORS.textLight}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {errorMsg && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorCardText}>{errorMsg}</Text>
          </View>
        )}

        {successBanner && (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.successCardTitle}>Account Created Successfully</Text>
              <Text style={styles.successCardBody}>
                {successBanner.name} ({successBanner.id}) enrolled as {successBanner.type}
                {successBanner.year ? ` • ${successBanner.year}` : ''}.
                Password: {successBanner.password}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleCreateUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
              <Text style={styles.submitButtonText}>
                {enrollType === 'HOD' ? 'Enroll & Designate HOD' : enrollType === 'TEACHER' ? 'Enroll University Teacher' : 'Register New Student'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  enrollmentCard: {
    backgroundColor: '#FDFBFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.purpleBorder,
    marginBottom: 16
  },
  enrollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  enrollIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.purpleBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  enrollHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#581C87'
  },
  enrollSubhead: {
    fontSize: 11,
    color: COLORS.textMuted
  },
  roleTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  roleTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D5FF'
  },
  roleTabBtnActive: {
    backgroundColor: COLORS.accentPurple,
    borderColor: COLORS.accentPurple
  },
  roleTabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B21A8'
  },
  roleTabBtnTextActive: {
    color: COLORS.white
  },
  formContainer: {
    marginTop: 2
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
  formRow: {
    flexDirection: 'row',
    gap: 10
  },
  yearSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  yearPill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF'
  },
  yearPillActive: {
    backgroundColor: COLORS.accentPurple,
    borderColor: COLORS.accentPurple
  },
  yearPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B21A8'
  },
  yearPillTextActive: {
    color: COLORS.white
  },
  deptScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  deptPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  deptPillActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder
  },
  deptPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  deptPillTextActive: {
    color: '#1D4ED8'
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    marginBottom: 10
  },
  errorCardText: {
    fontSize: 11.5,
    color: COLORS.danger,
    fontWeight: '700',
    flex: 1
  },
  successCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.successBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 10
  },
  successCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534'
  },
  successCardBody: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 15,
    marginTop: 2
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accentPurple,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  }
});
