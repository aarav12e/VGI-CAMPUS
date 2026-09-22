import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ParentPortalScreen({
    currentUser,
    onLogout
}) {
    const ward = currentUser?.ward || {
        name: 'Aarav Patel',
        rollNumber: '24DS001',
        program: 'B.Tech Data Science (CSE)',
        semester: 5,
        section: 'Section A',
        attendance: 84,
        cgpa: '8.65',
        hostelRoom: 'Aryabhata Hostel - Room 204',
        feeStatus: 'PAID',
        feeAmount: '₹ 1,25,000'
    };

    const handleCallMentor = () => {
        Alert.alert('Faculty Connect', 'Dialing Faculty Mentor Dr. Rajesh Sharma (+91 98765 43210)...');
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Parent Profile Card */}
            <View style={styles.parentCard}>
                <View style={styles.avatarCircle}>
                    <Ionicons name="people" size={24} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.parentName}>{currentUser?.name || 'Suresh Patel'}</Text>
                    <Text style={styles.parentRole}>Guardian / Parent Portal Access</Text>
                    <Text style={styles.parentContact}>Ward: {ward.name} ({ward.rollNumber})</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Ward Academic Snapshot */}
            <View style={styles.wardCard}>
                <View style={styles.wardHeader}>
                    <Ionicons name="school-outline" size={20} color="#2563EB" />
                    <Text style={styles.wardTitle}>Ward Academic Snapshot</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Student Name:</Text>
                    <Text style={styles.infoValue}>{ward.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Roll Number:</Text>
                    <Text style={styles.infoValue}>{ward.rollNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Program:</Text>
                    <Text style={styles.infoValue}>{ward.program}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Current Term:</Text>
                    <Text style={styles.infoValue}>Semester {ward.semester} ({ward.section})</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Hostel Residence:</Text>
                    <Text style={styles.infoValue}>{ward.hostelRoom}</Text>
                </View>
            </View>

            {/* Attendance & Performance Grid */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: '#059669' }]}>{ward.attendance}%</Text>
                    <Text style={styles.statLabel}>ATTENDANCE</Text>
                    <Text style={styles.statSub}>Above 75% Requirement</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: '#2563EB' }]}>{ward.cgpa}</Text>
                    <Text style={styles.statLabel}>CUMULATIVE CGPA</Text>
                    <Text style={styles.statSub}>First Class Distinction</Text>
                </View>
            </View>

            {/* Fee Clearance Card */}
            <View style={styles.feeCard}>
                <View style={styles.feeHeader}>
                    <View style={styles.feeIconCircle}>
                        <Ionicons name="checkmark-done" size={20} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.feeTitle}>Academic Fee Clearance</Text>
                        <Text style={styles.feeSubtitle}>Odd Semester 2026-27 (Tuition + Hostel)</Text>
                    </View>
                    <View style={styles.paidPill}>
                        <Text style={styles.paidText}>PAID</Text>
                    </View>
                </View>
                <Text style={styles.feeAmountText}>{ward.feeAmount} • Receipt #VGI-FEE-2026-9041</Text>
            </View>

            {/* Mentor Connect Card */}
            <View style={styles.mentorCard}>
                <Text style={styles.mentorHeading}>Faculty Mentor Consultation</Text>
                <Text style={styles.mentorDesc}>
                    Dr. Rajesh Sharma is your assigned academic mentor for continuous progress tracking.
                </Text>
                <TouchableOpacity
                    style={styles.callMentorBtn}
                    activeOpacity={0.88}
                    onPress={handleCallMentor}
                >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                    <Text style={styles.callMentorBtnText}>CALL FACULTY MENTOR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 30
    },
    parentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: 10
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center'
    },
    parentName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E40AF'
    },
    parentRole: {
        fontSize: 11,
        color: '#2563EB',
        marginTop: 1
    },
    parentContact: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1E3A8A',
        marginTop: 2
    },
    logoutBtn: {
        padding: 8
    },
    wardCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
        gap: 8
    },
    wardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4
    },
    wardTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC'
    },
    infoLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600'
    },
    infoValue: {
        fontSize: 12,
        color: '#1E293B',
        fontWeight: '700'
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14
    },
    statBox: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center'
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 2
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 2
    },
    statSub: {
        fontSize: 10,
        color: '#94A3B8'
    },
    feeCard: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#A7F3D0',
        marginBottom: 14
    },
    feeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8
    },
    feeIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    feeTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#065F46'
    },
    feeSubtitle: {
        fontSize: 11,
        color: '#047857'
    },
    paidPill: {
        backgroundColor: '#059669',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    paidText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    feeAmountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#065F46'
    },
    mentorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    mentorHeading: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4
    },
    mentorDesc: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
        marginBottom: 12
    },
    callMentorBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 10
    },
    callMentorBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5
    }
});
