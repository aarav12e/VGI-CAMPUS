import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropdownSelect from '../components/DropdownSelect';

export default function RmsScreen({ currentUser }) {
    const userRole = currentUser?.role || 'STUDENT';
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    const currentUserId = (
        currentUser?.email ||
        currentUser?.rollNumber ||
        currentUser?.userId ||
        currentUser?.id ||
        ''
    ).toLowerCase();

    const currentUserName = currentUser?.fullName || currentUser?.name || 'Authorized User';

    // Comprehensive initial grievance registry with entries from different roles
    const [allTickets, setAllTickets] = useState([
        // Student Complaint (Aarav Patel)
        {
            id: 'RMS-STU-8821',
            title: 'WiFi router signal weak in Aryabhata Hostel Room 204',
            description: 'The router on the 2nd floor drops connection frequently after 8:00 PM, affecting online lab work.',
            category: 'Hostel & Mess',
            status: 'In Progress',
            date: '21 Sep 2026',
            userId: '24ds001',
            userEmail: 'aarav.patel@vgi.ac.in',
            userName: 'Aarav Patel',
            userRole: 'STUDENT',
            userIdentifier: 'Roll: 24DS001',
            response: 'Assigned to IT technician Mr. Ramesh for line check and signal repeater installation.'
        },
        // Another Student Complaint (Rahul Kumar) - Only visible to Rahul or Admin
        {
            id: 'RMS-STU-3310',
            title: 'Library late fee waiver request due to medical hospitalization',
            description: 'I was admitted with viral fever for 10 days and could not return the AICTE textbook on time.',
            category: 'Fee & Accounts',
            status: 'Under Review',
            date: '22 Sep 2026',
            userId: '24cs099',
            userEmail: 'rahul.kumar@vgi.ac.in',
            userName: 'Rahul Kumar',
            userRole: 'STUDENT',
            userIdentifier: 'Roll: 24CS099',
            response: 'Under verification by the head librarian and medical cell.'
        },
        // Teacher Grievance (Prof. Priya Verma) - Only visible to Teacher or Admin
        {
            id: 'RMS-FAC-4402',
            title: 'Smartboard HDMI connectivity flickering in Computing Lab 302',
            description: 'The display drops every 5 minutes during practical sessions for B.Tech Semester 5.',
            category: 'Infrastructure & Labs',
            status: 'Resolved',
            date: '19 Sep 2026',
            userId: 'priya.verma@vgi.ac.in',
            userEmail: 'priya.verma@vgi.ac.in',
            userName: 'Prof. Priya Verma',
            userRole: 'TEACHER',
            userIdentifier: 'Emp: EMP002 (Assistant Professor)',
            response: 'High-speed 4K HDMI cable and port switch replaced by campus hardware team.'
        },
        // HOD Grievance / Requisition (Dr. Rajesh Sharma) - Only visible to HOD or Admin
        {
            id: 'RMS-HOD-1109',
            title: 'Requisition for 30 high-compute GPU workstations in AI Research Lab',
            description: 'Existing machines cannot handle Deep Learning models for major final-year capstone projects.',
            category: 'Department Equipment',
            status: 'Under Review',
            date: '18 Sep 2026',
            userId: 'rajesh.sharma@vgi.ac.in',
            userEmail: 'rajesh.sharma@vgi.ac.in',
            userName: 'Dr. Rajesh Sharma',
            userRole: 'HOD',
            userIdentifier: 'Emp: EMP001 (Head of Department - CSE)',
            response: 'Forwarded to Dean of Academics and Purchase Committee for budget sign-off.'
        },
        // Parent Grievance (Suresh Patel) - Only visible to Parent or Admin
        {
            id: 'RMS-PAR-9041',
            title: 'Hostel mess dinner hygiene feedback regarding ward Aarav Patel',
            description: 'Requested quality check on vegetable fresh supplies served in the south dining hall.',
            category: 'Hostel & Welfare',
            status: 'Resolved',
            date: '15 Sep 2026',
            userId: 'suresh.patel@gmail.com',
            userEmail: 'suresh.patel@gmail.com',
            userName: 'Suresh Patel (Parent)',
            userRole: 'PARENT',
            userIdentifier: 'Guardian • Ward: Aarav Patel (24DS001)',
            response: 'Hostel Committee visited kitchen; head cook issued warning for freshness protocol.'
        }
    ]);

    // Admin filter state
    const [adminFilterRole, setAdminFilterRole] = useState('ALL');
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedTicketForAdmin, setSelectedTicketForAdmin] = useState(null);
    const [adminResponseText, setAdminResponseText] = useState('');

    // Dynamic role-based categories
    let roleCategories = ['Hostel & Mess', 'Academics', 'Transport', 'IT & Labs', 'Fee & Accounts'];
    if (userRole === 'TEACHER') {
        roleCategories = ['Infrastructure & Labs', 'LMS & Portal', 'Duty & Leave', 'Classroom Equipment', 'Administration'];
    } else if (userRole === 'HOD') {
        roleCategories = ['Department Equipment', 'Lab Infrastructure', 'Faculty Matters', 'Curriculum & Exams', 'Administration'];
    } else if (userRole === 'PARENT') {
        roleCategories = ['Hostel & Welfare', 'Ward Academics', 'Fee & Accounts', 'Mentor Consultation', 'Transportation'];
    }

    const [selectedCategory, setSelectedCategory] = useState(roleCategories[0]);
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketDesc, setTicketDesc] = useState('');
    const [successBanner, setSuccessBanner] = useState(false);

    // =========================================================================
    // STRICT PRIVACY FILTERING
    // - Admin: Sees EVERYONE'S complaints
    // - Student / Teacher / HOD / Parent: Sees ONLY THEIR OWN complaints!
    // =========================================================================
    const visibleTickets = allTickets.filter((ticket) => {
        if (isAdmin) {
            if (adminFilterRole === 'ALL') return true;
            return ticket.userRole === adminFilterRole;
        }

        // Regular users: match by email, userId, or name
        const tUserId = (ticket.userId || '').toLowerCase();
        const tUserEmail = (ticket.userEmail || '').toLowerCase();
        const tUserName = (ticket.userName || '').toLowerCase();

        return (
            tUserId === currentUserId ||
            (currentUser?.email && tUserEmail === currentUser.email.toLowerCase()) ||
            (currentUserId.includes('suresh') && (tUserId.includes('suresh') || tUserEmail.includes('suresh'))) ||
            (currentUserId.includes('24ds001') && (tUserId.includes('24ds001') || tUserEmail.includes('aarav'))) ||
            (currentUserId.includes('priya') && (tUserId.includes('priya') || tUserEmail.includes('priya'))) ||
            (currentUserId.includes('rajesh') && (tUserId.includes('rajesh') || tUserEmail.includes('rajesh'))) ||
            (currentUser?.name && tUserName.includes(currentUser.name.toLowerCase()))
        );
    });

    const handleCreateTicket = () => {
        if (!ticketSubject.trim() || !ticketDesc.trim()) {
            Alert.alert('Required Fields', 'Please enter both the subject and description of your issue.');
            return;
        }

        const rolePrefix = userRole === 'STUDENT' ? 'STU' :
                           userRole === 'TEACHER' ? 'FAC' :
                           userRole === 'HOD' ? 'HOD' :
                           userRole === 'PARENT' ? 'PAR' : 'ADM';

        const newId = `RMS-${rolePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

        let identifier = `User: ${currentUserName}`;
        if (userRole === 'STUDENT') identifier = `Roll: ${currentUser?.rollNumber || '24DS001'}`;
        if (userRole === 'TEACHER' || userRole === 'HOD') identifier = `Emp: ${currentUser?.employeeId || 'EMP001'}`;
        if (userRole === 'PARENT') identifier = `Guardian • Ward: ${currentUser?.ward?.name || 'Aarav Patel'}`;

        const newTicket = {
            id: newId,
            title: ticketSubject.trim(),
            description: ticketDesc.trim(),
            category: selectedCategory,
            status: 'Under Review',
            date: 'Today',
            userId: currentUserId,
            userEmail: currentUser?.email || '',
            userName: currentUserName,
            userRole: userRole,
            userIdentifier: identifier,
            response: 'Ticket logged securely. Acknowledgment sent to your registered contact.'
        };

        setAllTickets([newTicket, ...allTickets]);
        setTicketSubject('');
        setTicketDesc('');
        setSuccessBanner(true);
        setTimeout(() => setSuccessBanner(false), 4500);
    };

    // Admin status update handler
    const handleAdminUpdateStatus = (newStatus) => {
        if (!selectedTicketForAdmin) return;

        setAllTickets((prev) =>
            prev.map((t) => {
                if (t.id === selectedTicketForAdmin.id) {
                    return {
                        ...t,
                        status: newStatus,
                        response: adminResponseText.trim() || t.response
                    };
                }
                return t;
            })
        );

        setStatusModalVisible(false);
        setSelectedTicketForAdmin(null);
        setAdminResponseText('');
        Alert.alert('Status Updated', 'Ticket status and administrator response remark updated successfully.');
    };

    // Role counts for Admin
    const stuCount = allTickets.filter((t) => t.userRole === 'STUDENT').length;
    const facCount = allTickets.filter((t) => t.userRole === 'TEACHER').length;
    const hodCount = allTickets.filter((t) => t.userRole === 'HOD').length;
    const parCount = allTickets.filter((t) => t.userRole === 'PARENT').length;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Banner */}
            <View style={[styles.headerBanner, isAdmin ? styles.adminBanner : styles.confidentialBanner]}>
                <View style={[styles.headerIconCircle, isAdmin ? styles.adminIconCircle : styles.confidentialIconCircle]}>
                    <Ionicons
                        name={isAdmin ? "shield-checkmark" : "lock-closed"}
                        size={20}
                        color={isAdmin ? "#7C3AED" : "#2563EB"}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, isAdmin ? { color: '#5B21B6' } : { color: '#1E40AF' }]}>
                        {isAdmin ? 'Central Grievance Redressal Registry' : 'Confidential Support & Grievance Desk'}
                    </Text>
                    <Text style={[styles.headerSubtitle, isAdmin ? { color: '#6D28D9' } : { color: '#1E3A8A' }]}>
                        {isAdmin
                            ? 'Administrator Master Access: Monitor and resolve complaints from all students, faculty, HODs, and parents.'
                            : 'Strictly Private: Only you and the central administration can see your complaints.'}
                    </Text>
                </View>
            </View>

            {/* Admin Filter Tabs (Only shown to Admin) */}
            {isAdmin && (
                <View style={styles.adminFilterCard}>
                    <DropdownSelect
                        label="FILTER COMPLAINTS BY ROLE"
                        value={adminFilterRole}
                        options={[
                            { value: 'ALL', label: `All Roles (${allTickets.length} tickets)` },
                            { value: 'STUDENT', label: `Students (${stuCount} tickets)` },
                            { value: 'TEACHER', label: `Faculty (${facCount} tickets)` },
                            { value: 'HOD', label: `HODs (${hodCount} tickets)` },
                            { value: 'PARENT', label: `Parents (${parCount} tickets)` }
                        ]}
                        onSelect={(val) => setAdminFilterRole(val)}
                        icon="funnel-outline"
                    />
                </View>
            )}

            {/* Success Toast Banner */}
            {successBanner && (
                <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={18} color="#059669" />
                    <Text style={styles.successText}>
                        Grievance ticket logged privately! Tracking code assigned to your profile.
                    </Text>
                </View>
            )}

            {/* Lodge New Ticket Card (Available for Students, Teachers, HODs, Parents, Admin) */}
            <View style={styles.lodgeCard}>
                <View style={styles.lodgeCardHeaderRow}>
                    <Ionicons name="create-outline" size={18} color="#2563EB" />
                    <Text style={styles.cardHeader}>
                        {userRole === 'STUDENT' ? 'Log Student Grievance' :
                         userRole === 'TEACHER' ? 'Log Faculty Request / Grievance' :
                         userRole === 'HOD' ? 'Log Department Requisition / Issue' :
                         userRole === 'PARENT' ? 'Submit Parent Inquiry / Complaint' : 'Log Administrative Ticket'}
                    </Text>
                </View>

                {/* Submitter Privacy Tag */}
                <View style={styles.privacyTag}>
                    <Ionicons name="shield-checkmark-outline" size={13} color="#059669" />
                    <Text style={styles.privacyTagText}>
                        Logged as: <Text style={{ fontWeight: '800' }}>{currentUserName}</Text> ({userRole}) • Strictly confidential
                    </Text>
                </View>

                {/* Category Dropdown */}
                <DropdownSelect
                    label="SELECT ISSUE CATEGORY"
                    value={selectedCategory}
                    options={roleCategories.map(cat => ({ label: cat, value: cat }))}
                    onSelect={(val) => setSelectedCategory(val)}
                    icon="pricetag-outline"
                />

                {/* Subject Input */}
                <Text style={styles.fieldLabel}>ISSUE SUBJECT</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Brief summary of your grievance..."
                    placeholderTextColor="#94A3B8"
                    value={ticketSubject}
                    onChangeText={setTicketSubject}
                />

                {/* Description Input */}
                <Text style={styles.fieldLabel}>DETAILED DESCRIPTION</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={
                        userRole === 'PARENT'
                            ? "Describe your concern or feedback regarding your ward..."
                            : "Describe your issue with room number, course details, or lab..."
                    }
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
                    <Text style={styles.submitBtnText}>SUBMIT PRIVATE COMPLAINT</Text>
                </TouchableOpacity>
            </View>

            {/* Complaints List Section */}
            <View style={styles.ticketsSection}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>
                        {isAdmin
                            ? `Institution Complaints Registry (${visibleTickets.length})`
                            : `Your Private Complaints (${visibleTickets.length})`}
                    </Text>
                    {!isAdmin && (
                        <View style={styles.myOnlyBadge}>
                            <Ionicons name="lock-closed" size={11} color="#059669" />
                            <Text style={styles.myOnlyBadgeText}>Only visible to you</Text>
                        </View>
                    )}
                </View>

                {visibleTickets.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="checkmark-done-circle-outline" size={44} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No Complaints Logged</Text>
                        <Text style={styles.emptySubtitle}>
                            {isAdmin
                                ? 'No complaints found for the selected role filter.'
                                : 'You currently have no active or historical complaints logged.'}
                        </Text>
                    </View>
                ) : (
                    visibleTickets.map(ticket => {
                        const isResolved = ticket.status === 'Resolved';
                        const isInProgress = ticket.status === 'In Progress';
                        const badgeBg = isResolved ? '#DCFCE7' : isInProgress ? '#DBEAFE' : '#FEF3C7';
                        const badgeColor = isResolved ? '#15803D' : isInProgress ? '#1D4ED8' : '#B45309';

                        return (
                            <View key={ticket.id} style={styles.ticketCard}>
                                <View style={styles.ticketTopRow}>
                                    <View style={styles.ticketIdBadge}>
                                        <Text style={styles.ticketIdText}>{ticket.id}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                                        <Text style={[styles.statusText, { color: badgeColor }]}>
                                            {ticket.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Admin Submitter Info Badge (Crucial for Admin visibility) */}
                                {isAdmin && (
                                    <View style={styles.submitterBar}>
                                        <Ionicons
                                            name={
                                                ticket.userRole === 'STUDENT' ? 'person' :
                                                ticket.userRole === 'TEACHER' ? 'school' :
                                                ticket.userRole === 'HOD' ? 'briefcase' : 'people'
                                            }
                                            size={14}
                                            color="#6D28D9"
                                        />
                                        <Text style={styles.submitterText}>
                                            Submitted by: <Text style={{ fontWeight: '800' }}>{ticket.userName}</Text> • {ticket.userIdentifier}
                                        </Text>
                                    </View>
                                )}

                                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                                {ticket.description ? (
                                    <Text style={styles.ticketDescText}>{ticket.description}</Text>
                                ) : null}

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

                                {/* Admin Action Bar to Update Status */}
                                {isAdmin && (
                                    <TouchableOpacity
                                        style={styles.adminActionBtn}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setSelectedTicketForAdmin(ticket);
                                            setAdminResponseText(ticket.response || '');
                                            setStatusModalVisible(true);
                                        }}
                                    >
                                        <Ionicons name="construct-outline" size={14} color="#7C3AED" />
                                        <Text style={styles.adminActionBtnText}>Update Status & Administrative Remark</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </View>

            {/* Admin Status Update Modal */}
            {isAdmin && (
                <Modal
                    visible={statusModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setStatusModalVisible(false)}
                >
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalDialog}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Update Complaint Status</Text>
                                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                                    <Ionicons name="close-circle" size={24} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>

                            {selectedTicketForAdmin && (
                                <View>
                                    <Text style={styles.modalTicketSubject}>{selectedTicketForAdmin.title}</Text>
                                    <Text style={styles.modalSubmitterText}>
                                        By: {selectedTicketForAdmin.userName} ({selectedTicketForAdmin.userRole})
                                    </Text>

                                    <Text style={styles.fieldLabel}>ADMINISTRATIVE RESOLUTION REMARK</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea, { marginBottom: 16 }]}
                                        placeholder="Enter official resolution or update..."
                                        placeholderTextColor="#94A3B8"
                                        value={adminResponseText}
                                        onChangeText={setAdminResponseText}
                                        multiline
                                    />

                                    <Text style={styles.fieldLabel}>CHANGE STATUS TO:</Text>
                                    <View style={styles.statusButtonsRow}>
                                        <TouchableOpacity
                                            style={[styles.statusOptionBtn, { backgroundColor: '#FEF3C7' }]}
                                            onPress={() => handleAdminUpdateStatus('Under Review')}
                                        >
                                            <Text style={{ color: '#B45309', fontWeight: '800', fontSize: 12 }}>Under Review</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.statusOptionBtn, { backgroundColor: '#DBEAFE' }]}
                                            onPress={() => handleAdminUpdateStatus('In Progress')}
                                        >
                                            <Text style={{ color: '#1D4ED8', fontWeight: '800', fontSize: 12 }}>In Progress</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.statusOptionBtn, { backgroundColor: '#DCFCE7' }]}
                                            onPress={() => handleAdminUpdateStatus('Resolved')}
                                        >
                                            <Text style={{ color: '#15803D', fontWeight: '800', fontSize: 12 }}>Resolved</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
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
        paddingBottom: 40
    },
    headerBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        marginBottom: 14
    },
    confidentialBanner: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE'
    },
    adminBanner: {
        backgroundColor: '#F5F3FF',
        borderColor: '#DDD6FE'
    },
    headerIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    confidentialIconCircle: {
        backgroundColor: '#DBEAFE'
    },
    adminIconCircle: {
        backgroundColor: '#EDE9FE'
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2
    },
    headerSubtitle: {
        fontSize: 11,
        lineHeight: 16
    },
    adminFilterCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14
    },
    filterSectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 8
    },
    filterPillsRow: {
        flexDirection: 'row',
        gap: 6
    },
    filterPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CBD5E1'
    },
    filterPillActive: {
        backgroundColor: '#7C3AED',
        borderColor: '#7C3AED'
    },
    filterPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569'
    },
    filterPillTextActive: {
        color: '#FFFFFF'
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ECFDF5',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#A7F3D0',
        marginBottom: 14
    },
    successText: {
        fontSize: 12,
        color: '#065F46',
        fontWeight: '600',
        flex: 1
    },
    lodgeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2
    },
    lodgeCardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
    },
    cardHeader: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B'
    },
    privacyTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BBF7D0',
        marginBottom: 12
    },
    privacyTagText: {
        fontSize: 11,
        color: '#166534'
    },
    fieldLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 6
    },
    categoryRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8
    },
    categoryChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    categoryChipActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB'
    },
    categoryChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569'
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
        fontWeight: '700'
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: '#1E293B',
        marginBottom: 6
    },
    textArea: {
        height: 75,
        textAlignVertical: 'top'
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 6
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    ticketsSection: {
        marginBottom: 20
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B'
    },
    myOnlyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    myOnlyBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#15803D'
    },
    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 30,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 6
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#475569',
        marginTop: 8
    },
    emptySubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 2
    },
    ticketCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1
    },
    ticketTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
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
    statusText: {
        fontSize: 10,
        fontWeight: '800'
    },
    submitterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6
    },
    submitterText: {
        fontSize: 11,
        color: '#5B21B6'
    },
    ticketTitle: {
        fontSize: 13.5,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4
    },
    ticketDescText: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
        marginBottom: 8
    },
    ticketMetaRow: {
        flexDirection: 'row',
        gap: 20,
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC'
    },
    metaCol: {
        gap: 1
    },
    metaLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    metaValue: {
        fontSize: 11.5,
        color: '#334155',
        fontWeight: '600'
    },
    responseBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#F0F9FF',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BAE6FD',
        marginTop: 8
    },
    responseText: {
        flex: 1,
        fontSize: 11.5,
        color: '#0369A1',
        lineHeight: 16
    },
    adminActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#F5F3FF',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD6FE',
        marginTop: 10
    },
    adminActionBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6D28D9'
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    modalDialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B'
    },
    modalTicketSubject: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2
    },
    modalSubmitterText: {
        fontSize: 11,
        color: '#64748B',
        marginBottom: 12
    },
    statusButtonsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4
    },
    statusOptionBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8
    }
});
