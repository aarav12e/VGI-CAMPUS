import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TilesGrid from '../components/TilesGrid';
import { ALL_ADMIN_TILES } from '../constants/tilesData';
import { DEFAULT_DEPARTMENTS } from '../constants/academicData';
import { COLORS } from '../theme/colors';
import AdminEnrollmentSection from './admin/AdminEnrollmentSection';
import AdminDepartmentSection from './admin/AdminDepartmentSection';
import AdminStudentRosterSection from './admin/AdminStudentRosterSection';

export default function AdminDashboardScreen({
  currentUser,
  activeTileIds,
  onTilePress,
  onAddTilesPress,
  editTilesMode,
  onToggleEditTiles,
  onRemoveTile
}) {
  const [departmentsList, setDepartmentsList] = useState(DEFAULT_DEPARTMENTS);

  const handleDepartmentAdded = (newDept) => {
    setDepartmentsList(prev => [...prev, newDept]);
  };

  return (
    <ScrollView
      style={styles.dashboardContainer}
      contentContainerStyle={styles.dashboardScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Dean / Executive Alert Banner */}
      <View style={styles.alertBanner}>
        <View style={styles.alertIconCircle}>
          <Ionicons name="shield-checkmark" size={17} color={COLORS.accentPurple} />
        </View>
        <View style={styles.alertTextWrap}>
          <Text style={styles.alertTitle}>Dean's Office • Central University ERP</Text>
          <Text style={styles.alertSubtitle}>
            Manage faculty appointments, designate HODs by academic year, and register students across 9 degree programs.
          </Text>
        </View>
      </View>

      {/* University Key Performance Indicators (KPIs) */}
      <View style={styles.miniStatsRow}>
        <TouchableOpacity
          style={styles.miniStatItem}
          activeOpacity={0.8}
          onPress={() => onTilePress('admin_admissions')}
        >
          <Text style={[styles.miniStatValue, { color: COLORS.accentPurple }]}>4,280</Text>
          <Text style={styles.miniStatLabel}>ENROLLED</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.miniStatItem}
          activeOpacity={0.8}
          onPress={() => onTilePress('admin_attendance')}
        >
          <Text style={[styles.miniStatValue, { color: COLORS.success }]}>94.2%</Text>
          <Text style={styles.miniStatLabel}>ATTENDANCE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.miniStatItem}
          activeOpacity={0.8}
          onPress={() => onTilePress('admin_fees')}
        >
          <Text style={[styles.miniStatValue, { color: '#2563EB' }]}>₹ 4.2 Cr</Text>
          <Text style={styles.miniStatLabel}>FEE REVENUE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.miniStatItem}
          activeOpacity={0.8}
          onPress={() => onTilePress('admin_rms')}
        >
          <Text style={[styles.miniStatValue, { color: COLORS.danger }]}>3</Text>
          <Text style={styles.miniStatLabel}>OPEN RMS</Text>
        </TouchableOpacity>
      </View>

      {/* Section 1: Academic Member Enrollment Form */}
      <AdminEnrollmentSection
        departmentsList={departmentsList}
      />

      {/* Section 2: Administrative Control Grids */}
      <View style={styles.gridsHeaderRow}>
        <View>
          <Text style={styles.gridsSectionTitle}>Executive Controls</Text>
          <Text style={styles.gridsSectionSub}>University modules & statutory workflows.</Text>
        </View>
        <TouchableOpacity
          style={styles.addGridBtn}
          onPress={onAddTilesPress}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TilesGrid
        activeTileIds={activeTileIds}
        tilesCatalog={ALL_ADMIN_TILES}
        onTilePress={onTilePress}
        onAddTilesPress={onAddTilesPress}
        editMode={editTilesMode}
        onRemoveTile={onRemoveTile}
      />

      {/* Quick Administrative Action Bar */}
      <View style={styles.adminActionCard}>
        <View style={styles.actionHeader}>
          <Ionicons name="flash-outline" size={20} color={COLORS.accentPurple} />
          <Text style={styles.actionTitle}>Administrative Rapid Actions</Text>
        </View>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => onTilePress('admin_broadcast')}
          >
            <Ionicons name="megaphone-outline" size={16} color={COLORS.accentPurple} />
            <Text style={styles.quickActionBtnText}>Broadcast Notice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => onTilePress('admin_exams')}
          >
            <Ionicons name="document-text-outline" size={16} color={COLORS.accentPurple} />
            <Text style={styles.quickActionBtnText}>Exam Seating</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section 3: Add New Department Tool */}
      <AdminDepartmentSection
        onDepartmentAdded={handleDepartmentAdded}
      />

      {/* Section 4: Student Roster & Bulk Import */}
      <AdminStudentRosterSection
        departmentsList={departmentsList}
      />
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
    backgroundColor: COLORS.purpleBg,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10
  },
  alertIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertTextWrap: {
    flex: 1
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#581C87',
    marginBottom: 2
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#6B21A8',
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
  adminActionCard: {
    backgroundColor: COLORS.purpleBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    marginTop: 10
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#581C87'
  },
  actionButtonsRow: {
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
    borderColor: '#D8B4FE'
  },
  quickActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B21A8'
  }
});
