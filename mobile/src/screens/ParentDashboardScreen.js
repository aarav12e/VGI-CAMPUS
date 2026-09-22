import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TilesGrid from '../components/TilesGrid';
import { ALL_PARENT_TILES } from '../constants/tilesData';

export default function ParentDashboardScreen({
    currentUser,
    activeTileIds,
    onTilePress,
    onAddTilesPress,
    editTilesMode,
    onToggleEditTiles,
    onRemoveTile
}) {
    const ward = currentUser?.ward || {
        name: 'Aarav Patel',
        rollNumber: '24DS001',
        program: 'B.Tech Data Science (CSE)',
        semester: 5,
        attendance: 84,
        cgpa: '8.65',
        hostelRoom: 'Aryabhata Hostel - Room 204',
        feeStatus: 'PAID',
        feeAmount: '₹ 1,25,000'
    };

    return (
        <ScrollView
            style={styles.dashboardContainer}
            contentContainerStyle={styles.dashboardScrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Ward Snapshot & Parent Notification Banner */}
            <View style={styles.alertBanner}>
                <View style={styles.alertIconCircle}>
                    <Ionicons name="people" size={17} color="#2563EB" />
                </View>
                <View style={styles.alertTextWrap}>
                    <Text style={styles.alertTitle}>Monitoring: {ward.name} ({ward.rollNumber})</Text>
                    <Text style={styles.alertSubtitle}>
                        Semester 5 • B.Tech CSE (Data Science). Parent-Teacher Consultation (PCP) set for 5th Oct 2026.
                    </Text>
                </View>
            </View>

            {/* Ward Performance & Welfare KPIs */}
            <View style={styles.miniStatsRow}>
                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('parent_attendance')}
                >
                    <Text style={[styles.miniStatValue, { color: '#059669' }]}>{ward.attendance}%</Text>
                    <Text style={styles.miniStatLabel}>WARD ATTENDANCE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('parent_marks')}
                >
                    <Text style={[styles.miniStatValue, { color: '#2563EB' }]}>{ward.cgpa}</Text>
                    <Text style={styles.miniStatLabel}>LATEST CGPA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('parent_fee')}
                >
                    <Text style={[styles.miniStatValue, { color: '#16A34A' }]}>PAID</Text>
                    <Text style={styles.miniStatLabel}>FEE STATUS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('parent_hostel')}
                >
                    <Text style={[styles.miniStatValue, { color: '#7C3AED' }]}>RM 204</Text>
                    <Text style={styles.miniStatLabel}>HOSTEL</Text>
                </TouchableOpacity>
            </View>

            {/* 3-Column Customizable Grid matching Inspiration Layout */}
            <TilesGrid
                activeTileIds={activeTileIds}
                catalog={ALL_PARENT_TILES}
                onTilePress={onTilePress}
                onAddTilesPress={onAddTilesPress}
                editTilesMode={editTilesMode}
                onToggleEditTiles={onToggleEditTiles}
                onRemoveTile={onRemoveTile}
                heading="Parent & Ward Grids"
                subheading="Track attendance, grades, fee receipts, & bus."
                accentColor="#2563EB"
                pillBgColor="#DBEAFE"
            />

            {/* Quick Parent Welfare & Action Bar */}
            <View style={styles.parentActionCard}>
                <View style={styles.actionHeader}>
                    <Ionicons name="call-outline" size={20} color="#2563EB" />
                    <Text style={styles.actionTitle}>Mentor & Campus Outpass Direct Connect</Text>
                </View>
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                        style={styles.quickActionBtn}
                        onPress={() => onTilePress('parent_mentor')}
                    >
                        <Ionicons name="person-circle-outline" size={16} color="#2563EB" />
                        <Text style={styles.quickActionBtnText}>Call Faculty Mentor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickActionBtn}
                        onPress={() => onTilePress('parent_outpass')}
                    >
                        <Ionicons name="exit-outline" size={16} color="#2563EB" />
                        <Text style={styles.quickActionBtnText}>Weekend Outpass</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    dashboardScrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 28
    },
    alertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        gap: 10
    },
    alertIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertTextWrap: {
        flex: 1
    },
    alertTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E40AF',
        marginBottom: 2
    },
    alertSubtitle: {
        fontSize: 11,
        color: '#1E3A8A',
        lineHeight: 15
    },
    miniStatsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14
    },
    miniStatItem: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    miniStatValue: {
        fontSize: 15,
        fontWeight: '900',
        marginBottom: 2
    },
    miniStatLabel: {
        fontSize: 8.5,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5
    },
    parentActionCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#BFDBFE',
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
        color: '#1E40AF'
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
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#93C5FD'
    },
    quickActionBtnText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1D4ED8'
    }
});
