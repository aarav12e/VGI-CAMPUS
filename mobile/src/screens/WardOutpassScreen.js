import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WardOutpassScreen({ currentUser }) {
    const rawWard = currentUser?.ward;
    const wardName = rawWard?.user?.fullName || rawWard?.name || 'Aarav Patel';
    const wardRoll = rawWard?.rollNumber || '24DS001';
    const hostelRoom = rawWard?.hostelRoom || 'Aryabhata Hostel - Room 204';

    const [outpassList, setOutpassList] = useState([
        {
            id: 'VGI-OP-2026-9041',
            type: 'Weekend Home Visit',
            destination: 'Sector 62, Noida (Home)',
            departureDate: '27 Sep 2026, 05:00 PM',
            returnDate: '29 Sep 2026, 08:00 PM',
            status: 'APPROVED',
            appliedOn: '24 Sep 2026',
            wardenName: 'Col. R.K. Yadav (Chief Warden)',
            remarks: 'Parent consent verified via registered Gmail.'
        },
        {
            id: 'VGI-OP-2026-8812',
            type: 'Medical Consultation',
            destination: 'Jaypee Hospital, Sector 128',
            departureDate: '12 Sep 2026, 09:30 AM',
            returnDate: '12 Sep 2026, 04:00 PM',
            status: 'COMPLETED',
            appliedOn: '11 Sep 2026',
            wardenName: 'Col. R.K. Yadav',
            remarks: 'Returned safely before curfew.'
        }
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedPass, setSelectedPass] = useState(null);

    // Form State
    const [leaveType, setLeaveType] = useState('Weekend Home Visit');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [transportMode, setTransportMode] = useState('Parent Personal Vehicle');
    const [parentConsent, setParentConsent] = useState(true);

    const handleApplyOutpass = () => {
        if (!destination.trim() || !departureDate.trim() || !returnDate.trim()) {
            Alert.alert('Required Fields', 'Please specify destination address, departure time, and return date.');
            return;
        }

        const newPassId = 'VGI-OP-2026-' + Math.floor(1000 + Math.random() * 9000);
        const newPass = {
            id: newPassId,
            type: leaveType,
            destination: destination.trim(),
            departureDate: departureDate.trim(),
            returnDate: returnDate.trim(),
            status: 'APPROVED',
            appliedOn: 'Today',
            wardenName: 'Col. R.K. Yadav (Automated Parent Consent)',
            remarks: 'Parent digital authorization active. Ready for gate scan.'
        };

        setOutpassList([newPass, ...outpassList]);
        setModalVisible(false);
        setDestination('');
        setDepartureDate('');
        setReturnDate('');
        Alert.alert(
            'Outpass Approved!',
            `Outpass ${newPassId} has been successfully generated with parent consent. Your ward can show this digital pass at the campus security gate.`
        );
    };

    const handleViewQR = (pass) => {
        setSelectedPass(pass);
        setQrModalVisible(true);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Ward Hostel Residence Info Card */}
            <View style={styles.wardResidenceCard}>
                <View style={styles.hostelIconCircle}>
                    <Ionicons name="bed" size={24} color="#1E40AF" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.wardNameText}>{wardName} ({wardRoll})</Text>
                    <Text style={styles.hostelRoomText}>{hostelRoom}</Text>
                    <Text style={styles.wardenContactText}>Chief Warden: Col. R.K. Yadav • +91 98765 22001</Text>
                </View>
            </View>

            {/* Quick Action & Header */}
            <View style={styles.actionHeaderRow}>
                <View>
                    <Text style={styles.sectionTitle}>Hostel Outpass & Gatepass</Text>
                    <Text style={styles.sectionSub}>Authorize and track your child's hostel departures</Text>
                </View>
                <TouchableOpacity
                    style={styles.applyBtn}
                    activeOpacity={0.85}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add-circle" size={17} color="#FFFFFF" />
                    <Text style={styles.applyBtnText}>APPLY OUTPASS</Text>
                </TouchableOpacity>
            </View>

            {/* Outpass History / Active Passes List */}
            {outpassList.map((pass) => {
                const isApproved = pass.status === 'APPROVED';
                const isCompleted = pass.status === 'COMPLETED';
                const badgeBg = isApproved ? '#DCFCE7' : isCompleted ? '#F1F5F9' : '#FEF3C7';
                const badgeColor = isApproved ? '#15803D' : isCompleted ? '#475569' : '#B45309';

                return (
                    <View key={pass.id} style={styles.outpassCard}>
                        <View style={styles.cardTopRow}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={styles.passIdText}>{pass.id}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                                        <Text style={[styles.statusBadgeText, { color: badgeColor }]}>
                                            {pass.status}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.passTypeText}>{pass.type}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.qrIconBtn}
                                activeOpacity={0.8}
                                onPress={() => handleViewQR(pass)}
                            >
                                <Ionicons name="qr-code" size={20} color="#2563EB" />
                                <Text style={styles.qrIconText}>Gate Pass</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Ionicons name="location-outline" size={15} color="#64748B" />
                            <Text style={styles.detailLabel}>Destination:</Text>
                            <Text style={styles.detailValue}>{pass.destination}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="exit-outline" size={15} color="#059669" />
                            <Text style={styles.detailLabel}>Departure:</Text>
                            <Text style={styles.detailValue}>{pass.departureDate}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="enter-outline" size={15} color="#2563EB" />
                            <Text style={styles.detailLabel}>Expected Return:</Text>
                            <Text style={styles.detailValue}>{pass.returnDate}</Text>
                        </View>

                        <View style={styles.footerNoteRow}>
                            <Ionicons name="shield-checkmark" size={14} color="#059669" />
                            <Text style={styles.footerNoteText}>{pass.remarks}</Text>
                        </View>
                    </View>
                );
            })}

            {/* Information Policy Box */}
            <View style={styles.policyCard}>
                <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
                <View style={{ flex: 1 }}>
                    <Text style={styles.policyTitle}>Campus Security & Gate Protocol</Text>
                    <Text style={styles.policyText}>
                        Students are allowed to exit the main security gates only after matching their digital outpass QR code with biometric facial verification.
                    </Text>
                </View>
            </View>

            {/* Apply Outpass Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="document-text" size={20} color="#2563EB" />
                                <Text style={styles.modalTitle}>Apply Ward Hostel Outpass</Text>
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.formSectionLabel}>WARD DETAILS</Text>
                            <View style={styles.wardPreFillBox}>
                                <Text style={styles.wardPreFillName}>{wardName} • Roll {wardRoll}</Text>
                                <Text style={styles.wardPreFillRoom}>{hostelRoom}</Text>
                            </View>

                            <Text style={styles.formSectionLabel}>OUTPASS PURPOSE</Text>
                            <View style={styles.typeOptionsRow}>
                                {['Weekend Home Visit', 'Medical Leave', 'Family Emergency', 'Official Leave'].map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[styles.typeOptionPill, leaveType === t && styles.typeOptionPillActive]}
                                        onPress={() => setLeaveType(t)}
                                    >
                                        <Text style={[styles.typeOptionText, leaveType === t && styles.typeOptionTextActive]}>
                                            {t}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.formSectionLabel}>DESTINATION ADDRESS</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="e.g. Home - Sector 62, Noida"
                                placeholderTextColor="#94A3B8"
                                value={destination}
                                onChangeText={setDestination}
                            />

                            <Text style={styles.formSectionLabel}>DEPARTURE DATE & TIME</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="e.g. 28-Sep-2026, 05:00 PM"
                                placeholderTextColor="#94A3B8"
                                value={departureDate}
                                onChangeText={setDepartureDate}
                            />

                            <Text style={styles.formSectionLabel}>ESTIMATED RETURN DATE & TIME</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="e.g. 30-Sep-2026, 08:00 PM"
                                placeholderTextColor="#94A3B8"
                                value={returnDate}
                                onChangeText={setReturnDate}
                            />

                            <Text style={styles.formSectionLabel}>MODE OF TRAVEL</Text>
                            <TextInput
                                style={styles.inputBox}
                                placeholder="e.g. Parent Pickup / Metro / Cab"
                                placeholderTextColor="#94A3B8"
                                value={transportMode}
                                onChangeText={setTransportMode}
                            />

                            {/* Parent Consent Checkbox */}
                            <TouchableOpacity
                                style={styles.consentRow}
                                activeOpacity={0.8}
                                onPress={() => setParentConsent(!parentConsent)}
                            >
                                <Ionicons
                                    name={parentConsent ? "checkbox" : "square-outline"}
                                    size={22}
                                    color={parentConsent ? "#2563EB" : "#94A3B8"}
                                />
                                <Text style={styles.consentText}>
                                    I confirm that I am the legal guardian and grant full parental authorization for this hostel leave.
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.submitPassBtn, !parentConsent && { opacity: 0.5 }]}
                                activeOpacity={0.85}
                                disabled={!parentConsent}
                                onPress={handleApplyOutpass}
                            >
                                <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
                                <Text style={styles.submitPassBtnText}>AUTHORIZE & ISSUE OUTPASS</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Digital Gate Pass Modal */}
            <Modal
                visible={qrModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setQrModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.qrModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Security Gate Clearance</Text>
                            <TouchableOpacity onPress={() => setQrModalVisible(false)}>
                                <Ionicons name="close-circle" size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>

                        {selectedPass && (
                            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                                <View style={styles.qrDummyBox}>
                                    <Ionicons name="qr-code-outline" size={140} color="#1E293B" />
                                    <Text style={styles.qrCodeLabel}>{selectedPass.id}</Text>
                                </View>

                                <View style={styles.qrPassInfo}>
                                    <Text style={styles.qrPassStudent}>{wardName}</Text>
                                    <Text style={styles.qrPassSub}>{selectedPass.type} • {hostelRoom}</Text>
                                    <Text style={styles.qrPassTiming}>Departure: {selectedPass.departureDate}</Text>
                                    <Text style={styles.qrPassTiming}>Return by: {selectedPass.returnDate}</Text>
                                </View>

                                <View style={styles.securitySeal}>
                                    <Ionicons name="shield-checkmark" size={16} color="#059669" />
                                    <Text style={styles.securitySealText}>PARENT CONSENT VERIFIED & VALID</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
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
        paddingBottom: 40
    },
    wardResidenceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: 16
    },
    hostelIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center'
    },
    wardNameText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E40AF'
    },
    hostelRoomText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
        marginTop: 1
    },
    wardenContactText: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 2
    },
    actionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B'
    },
    sectionSub: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 1
    },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2
    },
    applyBtnText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    outpassCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    passIdText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B'
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800'
    },
    passTypeText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 2
    },
    qrIconBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BFDBFE'
    },
    qrIconText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2563EB',
        marginTop: 2
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 10
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
    },
    detailLabel: {
        fontSize: 11.5,
        color: '#64748B',
        fontWeight: '600',
        width: 105
    },
    detailValue: {
        flex: 1,
        fontSize: 12,
        color: '#1E293B',
        fontWeight: '700'
    },
    footerNoteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 8,
        marginTop: 6
    },
    footerNoteText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '600'
    },
    policyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F0F9FF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#BAE6FD',
        marginTop: 6
    },
    policyTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0369A1',
        marginBottom: 2
    },
    policyText: {
        fontSize: 11,
        color: '#0C4A6E',
        lineHeight: 15
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '85%'
    },
    qrModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 'auto',
        marginTop: 'auto',
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B'
    },
    formSectionLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
        marginTop: 10,
        marginBottom: 6
    },
    wardPreFillBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: 4
    },
    wardPreFillName: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E40AF'
    },
    wardPreFillRoom: {
        fontSize: 11,
        color: '#2563EB',
        marginTop: 1
    },
    typeOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 4
    },
    typeOptionPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    typeOptionPillActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB'
    },
    typeOptionText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569'
    },
    typeOptionTextActive: {
        color: '#FFFFFF',
        fontWeight: '700'
    },
    inputBox: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: '#1E293B',
        marginBottom: 4
    },
    consentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginVertical: 14,
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    consentText: {
        flex: 1,
        fontSize: 11.5,
        color: '#334155',
        lineHeight: 16
    },
    submitPassBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 6,
        marginBottom: 20
    },
    submitPassBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    qrDummyBox: {
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12
    },
    qrCodeLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E293B',
        marginTop: 4,
        letterSpacing: 1
    },
    qrPassInfo: {
        alignItems: 'center',
        marginBottom: 12
    },
    qrPassStudent: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B'
    },
    qrPassSub: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2
    },
    qrPassTiming: {
        fontSize: 11.5,
        fontWeight: '700',
        color: '#2563EB',
        marginTop: 2
    },
    securitySeal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    securitySealText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#15803D',
        letterSpacing: 0.5
    }
});
