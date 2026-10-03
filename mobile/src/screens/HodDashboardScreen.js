import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { apiRequest } from '../api';
import HodStudentsTab from './hod/HodStudentsTab';
import HodTeachersTab from './hod/HodTeachersTab';
import HodAllocationsTab from './hod/HodAllocationsTab';
import HodAnalyticsTab from './hod/HodAnalyticsTab';
import HodSectionsTab from './hod/HodSectionsTab';
import HodSyllabusTab from './hod/HodSyllabusTab';
import DropdownSelect from '../components/DropdownSelect';
import TilesGrid from '../components/TilesGrid';
import { ALL_HOD_TILES, DEFAULT_HOD_TILE_IDS } from '../constants/tilesData';

export default function HodDashboardScreen({
  currentUser,
  onTilePress,
  onSelectTab,
  activeTileIds,
  onAddTilesPress,
  editTilesMode,
  onToggleEditTiles,
  onRemoveTile
}) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'rollcall' | 'teachers' | 'allocations' | 'analytics' | 'sections'

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
      {/* 3-Column Executive HOD Tab Icons Grid */}
      <TilesGrid
        activeTileIds={activeTileIds || DEFAULT_HOD_TILE_IDS}
        catalog={ALL_HOD_TILES}
        heading="Department Navigation Hub"
        subheading="Tap any module tab icon to open that dedicated page."
        accentColor="#7C3AED"
        pillBgColor="#EDE9FE"
        onTilePress={(tileId) => {
          const tabMap = {
            'hod_syllabus': 'syllabus',
            'hod_timetable': 'allocations',
            'hod_rollcall': 'attendance_portal',
            'hod_faculty': 'teachers',
            'hod_students': 'students',
            'hod_analytics': 'analytics',
            'hod_sections': 'sections',
            'hod_campus': 'happenings',
            'hod_rms': 'rms'
          };
          if (onSelectTab && tabMap[tileId]) {
            onSelectTab(tabMap[tileId]);
          } else if (onTilePress) {
            onTilePress(tileId);
          } else if (tabMap[tileId]) {
            setActiveTab(tabMap[tileId]);
          }
        }}
        onAddTilesPress={onAddTilesPress}
        editTilesMode={editTilesMode}
        onToggleEditTiles={onToggleEditTiles}
        onRemoveTile={onRemoveTile}
      />

      {/* HOD Module Selector Dropdown (Quick In-Page Switcher) */}
      <View style={{ marginBottom: 10, marginTop: 4 }}>
        <DropdownSelect
          label="SELECT HOD MANAGEMENT MODULE"
          value={activeTab}
          options={[
            { value: 'students', label: 'Students & Sections', subtitle: 'Manage student cohorts by course & section' },
            { value: 'syllabus', label: 'Course Syllabus Manager', subtitle: 'Add & manage course units & topics' },
            { value: 'allocations', label: 'Timetable & Class Allocation', subtitle: 'Daily timetable & self-teaching' },
            { value: 'rollcall', label: 'Take Attendance (Roll-Call)', subtitle: 'Classroom attendance marker' },
            { value: 'teachers', label: 'Faculty Directory', subtitle: 'Department professors & instructors' },
            { value: 'analytics', label: 'Attendance Audit', subtitle: 'Department attendance analytics' },
            { value: 'sections', label: '+ Create Class Section', subtitle: 'Establish new course sections' }
          ]}
          onSelect={(val) => {
            const externalTabs = {
              'syllabus': 'syllabus',
              'allocations': 'allocations',
              'rollcall': 'attendance_portal',
              'teachers': 'teachers'
            };
            if (onSelectTab && externalTabs[val]) {
              onSelectTab(externalTabs[val]);
            } else {
              setActiveTab(val);
            }
          }}
          icon="grid-outline"
        />
      </View>

      {/* Segment Tab Contents */}
      {activeTab === 'students' && <HodStudentsTab />}
      {activeTab === 'syllabus' && <HodSyllabusTab />}
      {activeTab === 'rollcall' && (
        <TeacherPortalScreen
          currentUser={{
            ...currentUser,
            role: 'HOD',
            name: currentUser?.name || 'Dr. Sunita Rao',
            designation: 'HOD & Professor'
          }}
        />
      )}
      {activeTab === 'teachers' && <HodTeachersTab />}
      {activeTab === 'allocations' && <HodAllocationsTab currentUser={currentUser} />}
      {activeTab === 'analytics' && <HodAnalyticsTab analytics={analytics} />}
      {activeTab === 'sections' && <HodSectionsTab />}

      {/* Quick Roll Call Shortcut Card */}
      {activeTab !== 'rollcall' && (
        <View style={styles.quickBarCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Ionicons name="clipboard-outline" size={17} color="#065F46" />
            <Text style={styles.quickBarTitle}>HOD Classroom Roll-Call</Text>
          </View>
          <Text style={styles.quickBarSub}>
            Take roll-call attendance for your classes and sections across all college departments.
          </Text>
          <TouchableOpacity 
            style={styles.rollCallBtn}
            onPress={() => onSelectTab ? onSelectTab('attendance_portal') : setActiveTab('rollcall')}
          >
            <Ionicons name="checkbox-outline" size={16} color={COLORS.white} />
            <Text style={styles.rollCallBtnText}>Launch Classroom Roll-Call</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  dashboardScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40
  },
  hodHeaderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  hodHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F3FF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#6D28D9',
    fontWeight: '800',
    fontSize: 16
  },
  hodName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  badgeHod: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeHodText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6D28D9'
  },
  hodDepartment: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12
  },
  miniStatItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  miniStatValue: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2
  },
  miniStatLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.4
  },
  tabNavRow: {
    marginBottom: 12
  },
  tabNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  tabNavBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  tabNavText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#065F46'
  },
  tabNavTextActive: {
    color: COLORS.white,
    fontWeight: '800'
  },
  quickBarCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 6
  },
  quickBarTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#065F46'
  },
  quickBarSub: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 15,
    marginBottom: 10
  },
  rollCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: 10
  },
  rollCallBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  }
});
