import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function TeacherRosterSheet({
  selectedSection,
  selectedYear,
  selectedDept,
  attendanceList,
  attendancePct,
  presentCount,
  absentCount,
  totalCount,
  markAll,
  toggleStudent,
  handleSubmitAttendance,
  loading,
  submitted,
  submitSuccessMsg
}) {
  return (
    <View style={styles.rosterCard}>
      <View style={styles.rosterHeader}>
        <View>
          <Text style={styles.rosterTitle}>Student Attendance Sheet</Text>
          <Text style={styles.rosterSub}>
            {selectedSection} • {selectedYear} • {selectedDept}
          </Text>
        </View>
        <View style={styles.pctBadge}>
          <Text style={styles.pctBadgeText}>{attendancePct}%</Text>
        </View>
      </View>

      {/* Counters */}
      <View style={styles.counterRow}>
        <View style={[styles.counterBox, { backgroundColor: COLORS.successBg, borderColor: COLORS.successBorder }]}>
          <Text style={[styles.counterVal, { color: COLORS.success }]}>{presentCount}</Text>
          <Text style={styles.counterLbl}>PRESENT</Text>
        </View>
        <View style={[styles.counterBox, { backgroundColor: COLORS.dangerBg, borderColor: COLORS.dangerBorder }]}>
          <Text style={[styles.counterVal, { color: COLORS.danger }]}>{absentCount}</Text>
          <Text style={styles.counterLbl}>ABSENT</Text>
        </View>
        <View style={[styles.counterBox, { backgroundColor: COLORS.cardBg, borderColor: COLORS.border }]}>
          <Text style={[styles.counterVal, { color: COLORS.textSecondary }]}>{totalCount}</Text>
          <Text style={styles.counterLbl}>ENROLLED</Text>
        </View>
      </View>

      {/* Rapid Actions */}
      <View style={styles.rapidButtonsRow}>
        <TouchableOpacity
          style={styles.rapidBtnPresent}
          onPress={() => markAll(true)}
        >
          <Ionicons name="checkmark-done" size={14} color="#15803D" />
          <Text style={styles.rapidBtnPresentText}>Mark All Present</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rapidBtnAbsent}
          onPress={() => markAll(false)}
        >
          <Ionicons name="close" size={14} color={COLORS.danger} />
          <Text style={styles.rapidBtnAbsentText}>Mark All Absent</Text>
        </TouchableOpacity>
      </View>

      {/* Students Checklist */}
      <View style={styles.studentList}>
        {attendanceList.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.studentRow,
              item.present ? styles.studentRowPresent : styles.studentRowAbsent
            ]}
            activeOpacity={0.7}
            onPress={() => toggleStudent(item.id)}
          >
            <View
              style={[
                styles.studentAvatar,
                item.present ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEE2E2' }
              ]}
            >
              <Text
                style={[
                  styles.studentAvatarText,
                  item.present ? { color: '#15803D' } : { color: COLORS.danger }
                ]}
              >
                {index + 1}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentRoll}>Roll No: {item.roll}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.present ? styles.statusBadgePresent : styles.statusBadgeAbsent
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  item.present ? styles.statusTextPresent : styles.statusTextAbsent
                ]}
              >
                {item.present ? 'P' : 'A'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {submitSuccessMsg && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
          <Text style={styles.successBannerText}>{submitSuccessMsg}</Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          loading && { opacity: 0.7 },
          submitted && { backgroundColor: COLORS.success }
        ]}
        onPress={handleSubmitAttendance}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <>
            <Ionicons
              name={submitted ? 'checkmark-circle' : 'cloud-upload'}
              size={18}
              color={COLORS.white}
            />
            <Text style={styles.submitBtnText}>
              {submitted ? 'Attendance Locked & Synced ✓' : 'Submit & Lock Attendance'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  rosterCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    marginBottom: 16
  },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  rosterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46'
  },
  rosterSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  pctBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  pctBadgeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900'
  },
  counterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  counterBox: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1
  },
  counterVal: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 1
  },
  counterLbl: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  rapidButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  rapidBtnPresent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.successBg,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.successBorder
  },
  rapidBtnPresentText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D'
  },
  rapidBtnAbsent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerBg,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder
  },
  rapidBtnAbsentText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.danger
  },
  studentList: {
    gap: 6,
    marginBottom: 14
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10
  },
  studentRowPresent: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  studentRowAbsent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  studentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  studentAvatarText: {
    fontSize: 11,
    fontWeight: '900'
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  studentRoll: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  statusBadgePresent: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC'
  },
  statusBadgeAbsent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5'
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '900'
  },
  statusTextPresent: {
    color: '#15803D'
  },
  statusTextAbsent: {
    color: COLORS.danger
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
    marginBottom: 10
  },
  successBannerText: {
    fontSize: 11.5,
    color: '#065F46',
    fontWeight: '700',
    flex: 1
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 10
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  }
});
