import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TilesGrid from '../components/TilesGrid';
import { ALL_HOD_TILES } from '../constants/tilesData';
import { COLORS } from '../theme/colors';
import { apiRequest } from '../api';
import HodAnalyticsTab from './hod/HodAnalyticsTab';
import HodAllocationsTab from './hod/HodAllocationsTab';
import HodSectionsTab from './hod/HodSectionsTab';

export default function HodDashboardScreen({
  currentUser,
  activeTileIds,
  onTilePress,
  onAddTilesPress,
  editTilesMode,
  onToggleEditTiles,
  onRemoveTile
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'sections' | 'allocations'

  const [analytics, setAnalytics] = useState({
    combinedTotalAverage: 89.4,
    totalSessions: 148,
    totalStudents: 120,
    subjects: [
      { code: 'BCS501', name: 'Database Management Systems', pct: 92, teacher: 'Dr. Rajesh Sharma', total: 36, isWarning: false },
      { code: 'BCS502', name: 'Operating Systems', pct: 88, teacher: 'Prof. Amit Kumar', total: 34, isWarning: false },
      { code: 'BCS504', name: 'Machine Learning', pct: 94, teacher: 'Prof. Priya Verma', total: 38, isWarning: false },
      { code: 'BCS503', name: 'Design & Analysis of Algorithms', pct: 74, teacher: 'Prof. Priya Verma', total: 40, isWarning: true }
    ],
    sections: [
      { name: 'Section A', semester: 'Semester 5', pct: 91.2, count: 60 },
      { name: 'Section B', semester: 'Semester 5', pct: 87.6, count: 60 }
    ]
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalytics() {
      try {
        const res = await apiRequest('/attendance/analytics/department/cdeea725-c467-4df2-b90d-beedc0624cea');
        if (res.success && res.data && isMounted) {
          setAnalytics(prev => ({
            ...prev,
            combinedTotalAverage: res.data.combinedTotalAverage || 89.4,
            subjects: res.data.subjectAnalytics?.length > 0 ? res.data.subjectAnalytics.map(s => ({
              code: s.code,
              name: s.name,
              pct: s.percentage,
              teacher: s.code === 'BCS501' ? 'Dr. Rajesh Sharma' : 'Prof. Priya Verma',
              total: s.totalMarked,
              isWarning: s.isWarning
            })) : prev.subjects,
            sections: res.data.sectionAnalytics?.length > 0 ? res.data.sectionAnalytics.map(sec => ({
              name: sec.name,
              semester: sec.semester,
              pct: sec.percentage,
              count: 60
            })) : prev.sections
          }));
        }
      } catch (err) {
        // Fallback state retained
      }
    }
    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  return (
    <ScrollView
      style={styles.dashboardContainer}
      contentContainerStyle={styles.dashboardScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* HOD Department Header Alert */}
      <View style={styles.alertBanner}>
        <View style={styles.alertIconCircle}>
          <Ionicons name="school-outline" size={17} color={COLORS.success} />
        </View>
        <View style={styles.alertTextWrap}>
          <Text style={styles.alertTitle}>Dept of CSE • NBA Tier-1 Audit</Text>
          <Text style={styles.alertSubtitle}>
            Faculty meeting at 03:30 PM in Seminar Hall B. Review Course Outcomes (CO-PO) mapping.
          </Text>
        </View>
      </View>

      {/* Mini Performance Indicators */}
      <View style={styles.miniStatsRow}>
        <TouchableOpacity style={styles.miniStatItem} activeOpacity={0.8} onPress={() => onTilePress('hod_timetable')}>
          <Text style={[styles.miniStatValue, { color: COLORS.success }]}>3</Text>
          <Text style={styles.miniStatLabel}>LECTURES TODAY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniStatItem} activeOpacity={0.8} onPress={() => setActiveTab('analytics')}>
          <Text style={[styles.miniStatValue, { color: '#2563EB' }]}>91.4%</Text>
          <Text style={styles.miniStatLabel}>DEPT ATTENDANCE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniStatItem} activeOpacity={0.8} onPress={() => onTilePress('hod_marks')}>
          <Text style={[styles.miniStatValue, { color: COLORS.accentOrange }]}>42</Text>
          <Text style={styles.miniStatLabel}>MARKS PENDING</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniStatItem} activeOpacity={0.8} onPress={() => onTilePress('hod_leaves')}>
          <Text style={[styles.miniStatValue, { color: COLORS.danger }]}>2</Text>
          <Text style={styles.miniStatLabel}>LEAVE REQS</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabNavRow}>
        {[
          { key: 'analytics', label: 'Attendance Analytics', icon: 'bar-chart-outline' },
          { key: 'allocations', label: 'Teacher Allocation', icon: 'people-outline' },
          { key: 'sections', label: 'Create Sections', icon: 'add-circle-outline' }
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabNavBtn, activeTab === t.key && styles.tabNavBtnActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Ionicons
              name={t.icon}
              size={14}
              color={activeTab === t.key ? COLORS.white : COLORS.success}
            />
            <Text style={[styles.tabNavText, activeTab === t.key && styles.tabNavTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Contents */}
      {activeTab === 'analytics' && <HodAnalyticsTab analytics={analytics} />}
      {activeTab === 'allocations' && <HodAllocationsTab />}
      {activeTab === 'sections' && <HodSectionsTab />}

      {/* Department Academic Tiles */}
      <View style={styles.gridsHeaderRow}>
        <View>
          <Text style={styles.gridsSectionTitle}>HOD & Faculty Grids</Text>
          <Text style={styles.gridsSectionSub}>Department academic controls & class workflows.</Text>
        </View>
        <TouchableOpacity style={styles.addGridBtn} onPress={onAddTilesPress}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TilesGrid
        activeTileIds={activeTileIds}
        tilesCatalog={ALL_HOD_TILES}
        onTilePress={onTilePress}
        onAddTilesPress={onAddTilesPress}
        editMode={editTilesMode}
        onRemoveTile={onRemoveTile}
      />

      {/* Teaching & Approvals Quick Bar */}
      <View style={styles.quickBarCard}>
        <View style={styles.quickBarHeader}>
          <Ionicons name="checkbox-outline" size={18} color={COLORS.success} />
          <Text style={styles.quickBarTitle}>Teaching & Approvals Quick Bar</Text>
        </View>
        <View style={styles.quickBarRow}>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => onTilePress('hod_rollcall')}>
            <Ionicons name="reader-outline" size={16} color={COLORS.success} />
            <Text style={styles.quickActionBtnText}>Launch Roll Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => onTilePress('hod_leaves')}>
            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
            <Text style={styles.quickActionBtnText}>Approve Leaves</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  dashboardScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10
  },
  alertIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertTextWrap: {
    flex: 1
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2
  },
  alertSubtitle: {
    fontSize: 11,
    color: COLORS.success,
    lineHeight: 15
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  miniStatItem: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  miniStatValue: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 2
  },
  miniStatLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  tabNavRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  tabNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder
  },
  tabNavBtnActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success
  },
  tabNavText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46'
  },
  tabNavTextActive: {
    color: COLORS.white
  },
  gridsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10
  },
  gridsSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  gridsSectionSub: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 1
  },
  addGridBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickBarCard: {
    backgroundColor: COLORS.successBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginTop: 12
  },
  quickBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  quickBarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46'
  },
  quickBarRow: {
    flexDirection: 'row',
    gap: 10
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.successBorder
  },
  quickActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#065F46'
  }
});
