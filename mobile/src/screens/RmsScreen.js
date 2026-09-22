import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RmsScreen() {
    const [tickets, setTickets] = useState([
        {
            id: 'RMS-8821',
            title: 'WiFi router signal weak in Aryabhata Hostel Room 204',
            category: 'Hostel & Network',
            status: 'In Progress',
            date: '21 Sep 2026',
            response: 'Assigned to IT technician Mr. Ramesh for line check.'
        },
        {
            id: 'RMS-7712',
            title: 'Correction in father\'s name spelling on UMS portal',
            category: 'Academic Records',
            status: 'Resolved',
            date: '14 Sep 2026',
            response: 'Verified against 10th marksheet and updated on ERP.'
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState('Hostel & Mess');
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketDesc, setTicketDesc] = useState('');
    const [successBanner, setSuccessBanner] = useState(false);

    const categories = ['Hostel & Mess', 'Academics', 'Transport', 'IT & Network', 'Fee & Accounts'];

    const handleCreateTicket = () => {
        if (!ticketSubject.trim() || !ticketDesc.trim()) {
            Alert.alert('Required Fields', 'Please enter both the subject and description of your grievance.');
            return;
        }

        const newId = `RMS-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTicket = {
            id: newId,
            title: ticketSubject.trim(),
            category: selectedCategory,
            status: 'Under Review',
            date: 'Just Now',
            response: 'Ticket logged. Acknowledgment sent to student email.'
        };

        setTickets([newTicket, ...tickets]);
        setTicketSubject('');
        setTicketDesc('');
        setSuccessBanner(true);
        setTimeout(() => setSuccessBanner(false), 4000);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Banner */}
            <View style={styles.headerBanner}>
                <View style={styles.headerIconCircle}>
                    <Ionicons name="chatbubbles" size={20} color="#EA580C" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Relationship Management System</Text>
                    <Text style={styles.headerSubtitle}>
                        Direct 24/7 student grievance redressal portal. Track resolution in real time.
                    </Text>
                </View>
            </View>

            {/* Success Toast Banner */}
            {successBanner && (
                <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                    <Text style={styles.successText}>
                        Grievance ticket created successfully! Tracking code assigned.
                    </Text>
                </View>
            )}

            {/* Lodge New Ticket Card */}
            <View style={styles.lodgeCard}>
                <Text style={styles.cardHeader}>Log a New Request / Grievance</Text>

                {/* Category Pills */}
                <Text style={styles.fieldLabel}>Select Category</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryChipText,
                                selectedCategory === cat && styles.categoryChipTextActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Subject Input */}
                <Text style={styles.fieldLabel}>Issue Subject</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Brief summary of your grievance..."
                    placeholderTextColor="#94A3B8"
                    value={ticketSubject}
                    onChangeText={setTicketSubject}
                />

                {/* Description Input */}
                <Text style={styles.fieldLabel}>Detailed Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your issue with room number or course details..."
                    placeholderTextColor="#94A3B8"
                    value={ticketDesc}
                    onChangeText={setTicketDesc}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitBtn}
                    activeOpacity={0.88}
                    onPress={handleCreateTicket}
                >
                    <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>SUBMIT GRIEVANCE</Text>
                </TouchableOpacity>
            </View>

            {/* Existing Tickets Section */}
            <View style={styles.ticketsSection}>
                <Text style={styles.sectionTitle}>Your Grievance History ({tickets.length})</Text>

                {tickets.map(ticket => (
                    <View key={ticket.id} style={styles.ticketCard}>
                        <View style={styles.ticketTopRow}>
                            <View style={styles.ticketIdBadge}>
                                <Text style={styles.ticketIdText}>{ticket.id}</Text>
                            </View>
                            <View style={[
                                styles.statusBadge,
                                ticket.status === 'Resolved' ? styles.statusResolved :
                                    ticket.status === 'In Progress' ? styles.statusProgress : styles.statusReview
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    ticket.status === 'Resolved' ? styles.statusTextResolved :
                                        ticket.status === 'In Progress' ? styles.statusTextProgress : styles.statusTextReview
                                ]}>
                                    {ticket.status}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.ticketTitle}>{ticket.title}</Text>

                        <View style={styles.ticketMetaRow}>
                            <View style={styles.metaCol}>
                                <Text style={styles.metaLabel}>Category</Text>
                                <Text style={styles.metaValue}>{ticket.category}</Text>
                            </View>
                            <View style={styles.metaCol}>
                                <Text style={styles.metaLabel}>Logged On</Text>
                                <Text style={styles.metaValue}>{ticket.date}</Text>
                            </View>
                        </View>

                        {ticket.response && (
                            <View style={styles.responseBox}>
                                <Ionicons name="chatbubble-ellipses-outline" size={14} color="#0284C7" />
                                <Text style={styles.responseText}>{ticket.response}</Text>
                            </View>
                        )}
                    </View>
                ))}
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
        paddingTop: 12,
        paddingBottom: 30
    },
    headerBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFF7ED',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#FED7AA',
        marginBottom: 14
    },
    headerIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFEDD5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#9A3412',
        marginBottom: 2
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#7C2D12',
        lineHeight: 15
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14
    },
    successText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: '#065F46'
    },
    lodgeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    cardHeader: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 6,
        marginTop: 6
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    categoryChipActive: {
        backgroundColor: '#FFEDD5',
        borderColor: '#FDBA74'
    },
    categoryChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B'
    },
    categoryChipTextActive: {
        color: '#EA580C',
        fontWeight: '800'
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 42,
        fontSize: 13,
        color: '#1E293B',
        marginBottom: 8
    },
    textArea: {
        height: 80,
        paddingTop: 10
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EA580C',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 8
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    ticketsSection: {
        gap: 12
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4
    },
    ticketCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 8
    },
    ticketTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    ticketIdBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    ticketIdText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#475569'
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    statusResolved: {
        backgroundColor: '#ECFDF5'
    },
    statusProgress: {
        backgroundColor: '#FEF3C7'
    },
    statusReview: {
        backgroundColor: '#EFF6FF'
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800'
    },
    statusTextResolved: {
        color: '#059669'
    },
    statusTextProgress: {
        color: '#D97706'
    },
    statusTextReview: {
        color: '#2563EB'
    },
    ticketTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        lineHeight: 18
    },
    ticketMetaRow: {
        flexDirection: 'row',
        gap: 16
    },
    metaCol: {
        gap: 2
    },
    metaLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '600'
    },
    metaValue: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '600'
    },
    responseBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#F0F9FF',
        padding: 8,
        borderRadius: 8,
        marginTop: 4
    },
    responseText: {
        flex: 1,
        fontSize: 11,
        color: '#0369A1',
        lineHeight: 15
    }
});
