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

export default function DashboardScreen({
    currentUser,
    activeTileIds,
    onTilePress,
    onAddTilesPress,
    editTilesMode,
    onToggleEditTiles,
    onRemoveTile
}) {
    return (
        <ScrollView
            style={styles.dashboardContainer}
            contentContainerStyle={styles.dashboardScrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Campus Notice Highlight Banner */}
            <View style={styles.alertBanner}>
                <View style={styles.alertIconCircle}>
                    <Ionicons name="notifications-outline" size={16} color="#EA580C" />
                </View>
                <View style={styles.alertTextWrap}>
                    <Text style={styles.alertTitle}>End-Sem Exam Registrations Live</Text>
                    <Text style={styles.alertSubtitle}>
                        Odd Semester 2026 examination forms portal is now open. Verify syllabus & fees.
                    </Text>
                </View>
            </View>

            {/* Quick Student Mini Overview Card */}
            <View style={styles.miniStatsRow}>
                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('attendance')}
                >
                    <Text style={styles.miniStatValue}>84%</Text>
                    <Text style={styles.miniStatLabel}>ATTENDANCE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('results')}
                >
                    <Text style={[styles.miniStatValue, { color: '#059669' }]}>7.78</Text>
                    <Text style={styles.miniStatLabel}>LATEST CGPA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.miniStatItem}
                    activeOpacity={0.8}
                    onPress={() => onTilePress('exams')}
                >
                    <Text style={[styles.miniStatValue, { color: '#D97706' }]}>14</Text>
                    <Text style={styles.miniStatLabel}>DAYS TO EXAM</Text>
                </TouchableOpacity>
            </View>

            {/* 3-Column Customizable Grid matching Inspiration Image 1 */}
            <TilesGrid
                activeTileIds={activeTileIds}
                onTilePress={onTilePress}
                onAddTilesPress={onAddTilesPress}
                editTilesMode={editTilesMode}
                onToggleEditTiles={onToggleEditTiles}
                onRemoveTile={onRemoveTile}
            />

            {/* Bottom Quick Help Card */}
            <View style={styles.helpCard}>
                <Ionicons name="chatbubbles-outline" size={24} color="#EA580C" />
                <View style={{ flex: 1 }}>
                    <Text style={styles.helpTitle}>Need Assistance?</Text>
                    <Text style={styles.helpText}>
                        Reach student grievance cell via RMS or connect with your academic mentor.
                    </Text>
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
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FED7AA',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
        gap: 10
    },
    alertIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFEDD5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertTextWrap: {
        flex: 1
    },
    alertTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#9A3412',
        marginBottom: 2
    },
    alertSubtitle: {
        fontSize: 11,
        color: '#7C2D12',
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
        paddingHorizontal: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    miniStatValue: {
        fontSize: 16,
        fontWeight: '900',
        color: '#2563EB',
        marginBottom: 2
    },
    miniStatLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5
    },
    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFF7ED',
        padding: 14,
        borderRadius: 14,
        marginTop: 18,
        borderWidth: 1,
        borderColor: '#FED7AA'
    },
    helpTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#9A3412',
        marginBottom: 2
    },
    helpText: {
        fontSize: 11,
        color: '#7C2D12',
        lineHeight: 15
    }
});
