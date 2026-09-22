import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { modalStyles } from './modalStyles';
import { COLORS } from '../../theme/colors';

export default function ParentModals({ activeModal, onClose }) {
  return (
    <View>
      {/* 1. WARD ATTENDANCE */}
      {activeModal === 'parent_attendance' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Ward Daily Attendance Record: 84% Total (Eligible for Exams).
          </Text>
          {[
            { sub: 'Database Management Systems', pct: '92%', status: 'Regular' },
            { sub: 'Machine Learning', pct: '88%', status: 'Regular' },
            { sub: 'Operating Systems', pct: '81%', status: 'Regular' },
            { sub: 'Design & Analysis of Algorithms', pct: '76%', status: 'Warning (<75% risk)' }
          ].map((a, i) => (
            <View key={i} style={styles.marksRowCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.marksStudentName}>{a.sub}</Text>
                <Text style={styles.marksStudentRoll}>{a.status}</Text>
              </View>
              <Text style={[styles.syllabusPercent, { color: a.pct.includes('76') ? COLORS.warning : COLORS.success }]}>
                {a.pct}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* 2. WARD MARKS */}
      {activeModal === 'parent_marks' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Ward Academic Performance & Sessional Grade Card.
          </Text>
          <View style={styles.statGrid2}>
            <View style={styles.statCardHalf}>
              <Text style={styles.statCardHalfValue}>8.65</Text>
              <Text style={styles.statCardHalfLabel}>CURRENT CGPA</Text>
            </View>
            <View style={styles.statCardHalf}>
              <Text style={[styles.statCardHalfValue, { color: COLORS.success }]}>1st Class</Text>
              <Text style={styles.statCardHalfLabel}>WITH DISTINCTION</Text>
            </View>
          </View>
        </View>
      )}

      {/* 3. WARD FEE */}
      {activeModal === 'parent_fee' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Ward Fee Receipts, Installments & Payment Gateway.
          </Text>
          <View style={styles.hostelCard}>
            <Text style={styles.hostelTitle}>Semester 5 Tuition & Hostel Fee: ₹ 1,25,000</Text>
            <Text style={styles.hostelSub}>Status: FULLY PAID (Receipt No: VGI/2026/0942)</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statGrid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  statCardHalf: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  statCardHalfValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary
  },
  statCardHalfLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600'
  },
  marksRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  marksStudentName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  marksStudentRoll: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  syllabusPercent: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8
  },
  hostelCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    marginBottom: 14
  },
  hostelTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E40AF'
  },
  hostelSub: {
    fontSize: 11.5,
    color: '#3B82F6',
    marginTop: 2
  }
});
