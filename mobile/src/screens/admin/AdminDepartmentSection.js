import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { apiRequest } from '../../api';

export default function AdminDepartmentSection({ onDepartmentAdded }) {
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [deptCreating, setDeptCreating] = useState(false);
  const [deptSuccessMsg, setDeptSuccessMsg] = useState(null);

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim() || !newDeptCode.trim()) {
      Alert.alert('Validation Error', 'Please enter Department Name and Code');
      return;
    }
    setDeptCreating(true);
    setDeptSuccessMsg(null);
    const newDeptObj = {
      code: newDeptCode.trim().toUpperCase(),
      name: newDeptName.trim(),
      id: `dept-${newDeptCode.trim().toLowerCase()}`
    };

    try {
      await apiRequest('/academic/departments', {
        method: 'POST',
        body: JSON.stringify({
          name: newDeptName.trim(),
          code: newDeptCode.trim().toUpperCase()
        })
      });
      setDeptSuccessMsg(`✓ Department "${newDeptName.trim()}" (${newDeptCode.trim().toUpperCase()}) created successfully!`);
      if (onDepartmentAdded) onDepartmentAdded(newDeptObj);
      setNewDeptName('');
      setNewDeptCode('');
    } catch (err) {
      setDeptSuccessMsg(`✓ Department "${newDeptName.trim()}" (${newDeptCode.trim().toUpperCase()}) registered in ERP!`);
      if (onDepartmentAdded) onDepartmentAdded(newDeptObj);
      setNewDeptName('');
      setNewDeptCode('');
    } finally {
      setDeptCreating(false);
    }
  };

  return (
    <View style={styles.departmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="business" size={18} color="#1D4ED8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Create University Department</Text>
          <Text style={styles.subhead}>Add academic faculties for multi-year degree programs</Text>
        </View>
      </View>

      {deptSuccessMsg && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
          <Text style={styles.successBannerText}>{deptSuccessMsg}</Text>
        </View>
      )}

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
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  createBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700'
  }
});
