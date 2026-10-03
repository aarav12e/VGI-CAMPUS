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
                    <Ionicons name="notifications-outline" size={16} color="#1D4ED8" />
                </View>
                <View style={styles.alertTextWrap}>
                    <Text style={styles.alertTitle}>End-Sem Exam Registrations Live</Text>
                    <Text style={styles.alertSubtitle}>
                        Odd Semester 2026 examination forms portal is now open. Verify syllabus & fees.
                    </Text>
                </View>
            </View>

            {/* 3-Column Customizable Grid matching Inspiration Image 1 */}
            <TilesGrid
                activeTileIds={activeTileIds}
                onTilePress={onTilePress}
                onAddTilesPress={onAddTilesPress}
                editTilesMode={editTilesMode}
                onToggleEditTiles={onToggleEditTiles}
                onRemoveTile={onRemoveTile}
                accentColor="#1E3A8A"
                pillBgColor="#EFF6FF"
            />

            {/* Bottom Quick Help Card */}
            <View style={styles.helpCard}>
                <Ionicons name="chatbubbles-outline" size={24} color="#1E3A8A" />
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
        color: '#1E3A8A',
        marginBottom: 2
    },
    alertSubtitle: {
        fontSize: 11,
        color: '#1D4ED8',
        lineHeight: 15
    },
    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F8FAFC',
        padding: 14,
        borderRadius: 14,
        marginTop: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    helpTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2
    },
    helpText: {
        fontSize: 11,
        color: '#64748B',
        lineHeight: 15
    }
});
