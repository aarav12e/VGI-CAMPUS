import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import TilesGrid from '../components/TilesGrid';
import { ALL_TEACHER_TILES, DEFAULT_TEACHER_TILE_IDS } from '../constants/tilesData';

export default function TeacherDashboardScreen({
  currentUser,
  onTilePress,
  onSelectTab,
  activeTileIds = DEFAULT_TEACHER_TILE_IDS,
  onAddTilesPress,
  editTilesMode = false,
  onToggleEditTiles,
  onRemoveTile
}) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Teacher Profile Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PR'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.teacherName}>{currentUser?.name || 'Prof. Priya Verma'}</Text>
              <View style={styles.badgeTeacher}>
                <Text style={styles.badgeTeacherText}>FACULTY</Text>
              </View>
            </View>
            <Text style={styles.teacherDept}>
              {currentUser?.department || 'Dept of Computer Science & Engineering'} • VGI
            </Text>
          </View>
        </View>

        {/* Quick Teaching Indicators */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>3</Text>
            <Text style={styles.statLabel}>TODAY'S LECTURES</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>91.4%</Text>
            <Text style={styles.statLabel}>CLASS ATTENDANCE</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#7C3AED' }]}>2</Text>
            <Text style={styles.statLabel}>SECTIONS</Text>
          </View>
        </View>
      </View>

      {/* 3-Column Teacher Tab Icons Grid */}
      <TilesGrid
        activeTileIds={activeTileIds}
        catalog={ALL_TEACHER_TILES}
        isEditing={editTilesMode}
        onToggleEdit={onToggleEditTiles}
        onRemoveTile={onRemoveTile}
        onAddTilesPress={onAddTilesPress}
        heading="Faculty Teaching Hub"
        subheading="Tap any tab icon to open that dedicated page."
        accentColor="#059669"
        pillBgColor="#ECFDF5"
        onTilePress={(tileId) => {
          const tabMap = {
            'teacher_rollcall': 'attendance_portal',
            'teacher_schedule': 'schedule',
            'teacher_students': 'attendance_portal',
            'teacher_history': 'history',
            'teacher_campus': 'happenings',
            'teacher_support': 'rms'
          };
          if (onSelectTab && tabMap[tileId]) {
            onSelectTab(tabMap[tileId]);
          } else if (onTilePress) {
            onTilePress(tileId);
          }
        }}
      />

      {/* Quick Roll Call CTA */}
      <View style={styles.quickBarCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Ionicons name="checkbox-outline" size={18} color="#065F46" />
          <Text style={styles.quickBarTitle}>Class Attendance Roll-Call</Text>
        </View>
        <Text style={styles.quickBarSub}>
          Take roll-call attendance for today's assigned lecture slots.
        </Text>
        <TouchableOpacity
          style={styles.rollCallBtn}
          onPress={() => onSelectTab ? onSelectTab('attendance_portal') : null}
          activeOpacity={0.85}
        >
          <Ionicons name="clipboard-outline" size={16} color={COLORS.white} />
          <Text style={styles.rollCallBtnText}>Launch Live Roll-Call</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40
  },
  headerCard: {
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 16
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  badgeTeacher: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeTeacherText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D'
  },
  teacherDept: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900'
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2
  },
  quickBarCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10
  },
  quickBarTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#065F46'
  },
  quickBarSub: {
    fontSize: 11,
    color: '#047857',
    marginBottom: 10,
    lineHeight: 16
  },
  rollCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8
  },
  rollCallBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.white
  }
});
