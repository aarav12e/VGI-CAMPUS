import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function HodAnalyticsTab({ analytics }) {
  return (
    <View style={styles.contentCard}>
      {/* Big Combined Average Banner */}
      <View style={styles.combinedAverageBanner}>
        <View>
          <Text style={styles.combinedAverageLabel}>DEPARTMENT TOTAL COMBINED AVERAGE</Text>
          <Text style={styles.combinedAverageSub}>Across all sections & subjects combined</Text>
        </View>
        <View style={styles.combinedAverageBadge}>
          <Text style={styles.combinedAverageValue}>{analytics.combinedTotalAverage}%</Text>
        </View>
      </View>

      {/* Section Breakdown Pills */}
      <Text style={styles.sectionSubHeading}>SECTION-WISE COMBINED ATTENDANCE</Text>
      <View style={styles.sectionRow}>
        {analytics.sections.map((sec, idx) => (
          <View key={idx} style={styles.sectionItemBox}>
            <Text style={styles.sectionItemName}>{sec.name}</Text>
            <Text style={styles.sectionItemSem}>{sec.semester}</Text>
            <Text style={styles.sectionItemPct}>{sec.pct}%</Text>
          </View>
        ))}
      </View>

      {/* Per-Subject Attendance Breakdown */}
      <Text style={[styles.sectionSubHeading, { marginTop: 14 }]}>
        SUBJECT-WISE ATTENDANCE BREAKDOWN
      </Text>
      <View style={styles.subjectList}>
        {analytics.subjects.map((sub, i) => (
          <View key={i} style={styles.subjectCard}>
            <View style={styles.subjectHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subjectTitle}>{sub.name}</Text>
                <Text style={styles.subjectFaculty}>
                  Faculty: <Text style={{ fontWeight: '700' }}>{sub.teacher}</Text> • Code: {sub.code}
                </Text>
              </View>
              <View
                style={[
                  styles.subjectPctBadge,
                  sub.isWarning ? styles.subjectPctBadgeWarning : styles.subjectPctBadgeGood
                ]}
              >
                <Text
                  style={[
                    styles.subjectPctText,
                    sub.isWarning ? styles.subjectPctTextWarning : styles.subjectPctTextGood
                  ]}
                >
                  {sub.pct}%
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${sub.pct}%` },
                  sub.isWarning ? { backgroundColor: COLORS.danger } : { backgroundColor: COLORS.success }
                ]}
              />
            </View>

            {sub.isWarning && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="alert-circle" size={13} color={COLORS.danger} />
                <Text style={styles.warningNote}>
                  Attendance below 75% mandatory threshold. HOD notice issued to students.
                </Text>
              </View>
            )}
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
  combinedAverageBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 12
  },
  combinedAverageLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5
  },
  combinedAverageSub: {
    fontSize: 11,
    color: '#059669',
    marginTop: 2
  },
  combinedAverageBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  combinedAverageValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900'
  },
  sectionSubHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 8
  },
  sectionItemBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  sectionItemName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  sectionItemSem: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginVertical: 2
  },
  sectionItemPct: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.success
  },
  subjectList: {
    gap: 8
  },
  subjectCard: {
    backgroundColor: COLORS.cardBg,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  subjectTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  subjectFaculty: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  subjectPctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  subjectPctBadgeGood: {
    backgroundColor: '#DCFCE7'
  },
  subjectPctBadgeWarning: {
    backgroundColor: '#FEE2E2'
  },
  subjectPctText: {
    fontSize: 12,
    fontWeight: '800'
  },
  subjectPctTextGood: {
    color: COLORS.success
  },
  subjectPctTextWarning: {
    color: COLORS.danger
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  warningNote: {
    fontSize: 10.5,
    color: COLORS.danger,
    marginTop: 6,
    fontWeight: '600'
  }
});
