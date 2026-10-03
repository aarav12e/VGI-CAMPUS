import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import DropdownSelect from '../components/DropdownSelect';
import { apiRequest } from '../api';

const DEFAULT_EVENTS = [
    {
        id: '1',
        title: 'VGI Innovate Hackathon 2026',
        category: 'Hackathons',
        date: '28-29 Sep 2026',
        time: '36 Hours Non-stop',
        venue: 'Auditorium Hall B',
        prize: '₹ 1,50,000 Cash Pool',
        tagColor: '#EA580C',
        tagBg: '#FFEDD5',
        registered: false,
        registrations: [
            {
                id: 'r1',
                studentName: 'Aarav Patel',
                rollNo: '24DS001',
                department: 'CSE',
                course: 'B.Tech Data Science (3rd Year)',
                email: 'aarav.patel@vgi.ac.in',
                phone: '+91 98765 43210',
                registeredAt: '24 Sep 2026, 11:30 AM'
            },
            {
                id: 'r2',
                studentName: 'Sneha Gupta',
                rollNo: '24DS002',
                department: 'CSE',
                course: 'B.Tech CSE (3rd Year)',
                email: 'sneha.gupta@vgi.ac.in',
                phone: '+91 98111 22334',
                registeredAt: '24 Sep 2026, 01:15 PM'
            },
            {
                id: 'r3',
                studentName: 'Rohan Singh',
                rollNo: '24DS003',
                department: 'CA',
                course: 'BCA (2nd Year)',
                email: 'rohan.singh@vgi.ac.in',
                phone: '+91 98222 33445',
                registeredAt: '24 Sep 2026, 04:45 PM'
            },
            {
                id: 'r4',
                studentName: 'Ananya Sharma',
                rollNo: '24DS004',
                department: 'CSE',
                course: 'B.Tech AI/ML (3rd Year)',
                email: 'ananya.sharma@vgi.ac.in',
                phone: '+91 98333 44556',
                registeredAt: '25 Sep 2026, 09:20 AM'
            }
        ]
    },
    {
        id: '2',
        title: 'Yuva Annual Tech & Cultural Fest',
        category: 'Fests',
        date: '10-12 Oct 2026',
        time: '10:00 AM - 08:00 PM',
        venue: 'Main Campus Grounds',
        prize: 'Battle of Bands & Robo-Wars',
        tagColor: '#7C3AED',
        tagBg: '#FAF5FF',
        registered: true,
        registrations: [
            {
                id: 'r5',
                studentName: 'Aarav Patel',
                rollNo: '24DS001',
                department: 'CSE',
                course: 'B.Tech Data Science (3rd Year)',
                email: 'aarav.patel@vgi.ac.in',
                phone: '+91 98765 43210',
                registeredAt: '22 Sep 2026, 10:00 AM'
            },
            {
                id: 'r6',
                studentName: 'Vikram Mehta',
                rollNo: '24DS005',
                department: 'MGMT',
                course: 'BBA (2nd Year)',
                email: 'vikram.mehta@vgi.ac.in',
                phone: '+91 98444 55667',
                registeredAt: '23 Sep 2026, 03:30 PM'
            },
            {
                id: 'r7',
                studentName: 'Pooja Verma',
                rollNo: '24DS006',
                department: 'PHARM',
                course: 'B.Pharma (3rd Year)',
                email: 'pooja.verma@vgi.ac.in',
                phone: '+91 98555 66778',
                registeredAt: '24 Sep 2026, 11:10 AM'
            }
        ]
    },
    {
        id: '3',
        title: 'TCS & Infosys Campus Placement Drive',
        category: 'Placements',
        date: '03 Oct 2026',
        time: '09:00 AM Sharp',
        venue: 'VGI Placement Cell Block-C',
        prize: 'CTC: ₹ 7.5 - 12.0 LPA',
        tagColor: '#059669',
        tagBg: '#ECFDF5',
        registered: false,
        registrations: [
            {
                id: 'r8',
                studentName: 'Sneha Gupta',
                rollNo: '24DS002',
                department: 'CSE',
                course: 'B.Tech CSE (4th Year)',
                email: 'sneha.gupta@vgi.ac.in',
                phone: '+91 98111 22334',
                registeredAt: '20 Sep 2026, 09:15 AM'
            },
            {
                id: 'r9',
                studentName: 'Rohan Singh',
                rollNo: '24DS003',
                department: 'CA',
                course: 'MCA (Final Year)',
                email: 'rohan.singh@vgi.ac.in',
                phone: '+91 98222 33445',
                registeredAt: '21 Sep 2026, 11:00 AM'
            }
        ]
    },
    {
        id: '4',
        title: 'Inter-College Badminton & Cricket Championship',
        category: 'Sports',
        date: '15-18 Oct 2026',
        time: '04:00 PM Daily',
        venue: 'Sports Arena Court 1 & 2',
        prize: 'Championship Trophy & Medals',
        tagColor: '#2563EB',
        tagBg: '#EFF6FF',
        registered: false,
        registrations: [
            {
                id: 'r10',
                studentName: 'Aarav Patel',
                rollNo: '24DS001',
                department: 'CSE',
                course: 'B.Tech (3rd Year)',
                email: 'aarav.patel@vgi.ac.in',
                phone: '+91 98765 43210',
                registeredAt: '23 Sep 2026, 05:00 PM'
            }
        ]
    }
];

export default function HappeningsScreen({ currentUser, role }) {
    const isAdmin = role === 'ADMIN' || currentUser?.role === 'ADMIN';
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsList, setEventsList] = useState(DEFAULT_EVENTS);

    // Admin Create Event Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('Hackathons');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newVenue, setNewVenue] = useState('');
    const [newPrize, setNewPrize] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [creating, setCreating] = useState(false);

    // Admin View Registrations Modal State
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [activeEventForRegistrations, setActiveEventForRegistrations] = useState(null);
    const [regSearchQuery, setRegSearchQuery] = useState('');

    const categories = ['All', 'Hackathons', 'Fests', 'Placements', 'Sports', 'Workshops'];

    useEffect(() => {
        fetchLiveEvents();
    }, []);

    const fetchLiveEvents = async () => {
        try {
            const res = await apiRequest('/campus/events');
            if (res.success && res.data && res.data.length > 0) {
                const mapped = res.data.map(ev => {
                    const matched = DEFAULT_EVENTS.find(d => d.title.toLowerCase() === ev.title.toLowerCase());
                    const categoryColors = getCategoryColors(ev.category);
                    return {
                        id: ev.id,
                        title: ev.title,
                        category: ev.category || 'Hackathons',
                        date: ev.date || 'TBA',
                        time: ev.startTime ? `${ev.startTime} - ${ev.endTime}` : '10:00 AM',
                        venue: ev.venue || 'Campus Auditorium',
                        prize: ev.description?.includes('Prize:') ? ev.description.split('Prize:')[1].trim() : (matched?.prize || 'Certificate & Awards'),
                        tagColor: categoryColors.tagColor,
                        tagBg: categoryColors.tagBg,
                        registered: false,
                        registrations: ev.registrations?.map((r, i) => ({
                            id: r.id || `reg-${i}`,
                            studentName: r.student?.user?.fullName || 'Student Participant',
                            rollNo: r.student?.rollNumber || '24DS000',
                            department: r.student?.department?.code || 'CSE',
                            course: r.student?.program?.name || 'B.Tech',
                            email: r.student?.user?.email || 'student@vgi.ac.in',
                            phone: r.student?.user?.phone || '+91 98765 00000',
                            registeredAt: new Date(r.registeredAt).toLocaleString()
                        })) || matched?.registrations || []
                    };
                });
                setEventsList(mapped);
            }
        } catch (e) {
            // Keep robust default events
        }
    };

    const getCategoryColors = (cat) => {
        switch (cat) {
            case 'Hackathons': return { tagColor: '#EA580C', tagBg: '#FFEDD5' };
            case 'Fests': return { tagColor: '#7C3AED', tagBg: '#FAF5FF' };
            case 'Placements': return { tagColor: '#059669', tagBg: '#ECFDF5' };
            case 'Sports': return { tagColor: '#2563EB', tagBg: '#EFF6FF' };
            case 'Workshops': return { tagColor: '#0284C7', tagBg: '#F0F9FF' };
            default: return { tagColor: '#6D28D9', tagBg: '#EDE9FE' };
        }
    };

    const filteredEvents = eventsList.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.venue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Student Toggle Registration
    const toggleRegister = async (id) => {
        const ev = eventsList.find(e => e.id === id);
        if (!ev) return;

        const nextStatus = !ev.registered;

        try {
            await apiRequest(`/campus/events/${id}/register`, { method: 'POST' });
        } catch (e) {
            // Keep optimistic update
        }

        const newRegObj = {
            id: 'reg-' + Date.now(),
            studentName: currentUser?.name || currentUser?.fullName || 'Aarav Patel',
            rollNo: currentUser?.rollNumber || currentUser?.enrollmentNumber || '24DS001',
            department: currentUser?.departmentCode || 'CSE',
            course: 'B.Tech Data Science (3rd Year)',
            email: currentUser?.email || 'aarav.patel@vgi.ac.in',
            phone: currentUser?.phone || '+91 98765 43210',
            registeredAt: 'Just Now'
        };

        setEventsList(prev => prev.map(item => {
            if (item.id === id) {
                const updatedRegs = nextStatus
                    ? [newRegObj, ...(item.registrations || [])]
                    : (item.registrations || []).filter(r => r.studentName !== newRegObj.studentName);

                return {
                    ...item,
                    registered: nextStatus,
                    registrations: updatedRegs
                };
            }
            return item;
        }));

        Alert.alert(
            nextStatus ? 'Registration Confirmed!' : 'Registration Cancelled',
            nextStatus ? `You are registered for "${ev.title}". E-Pass added to your passbook.` : `Registration removed.`
        );
    };

    // Admin Create Event
    const handleCreateEvent = async () => {
        if (!newTitle.trim() || !newVenue.trim()) {
            Alert.alert('Validation Error', 'Please enter Event Title and Venue');
            return;
        }

        setCreating(true);
        const colors = getCategoryColors(newCategory);
        const newEventObj = {
            id: 'ev-' + Date.now(),
            title: newTitle.trim(),
            category: newCategory,
            date: newDate.trim() || 'Upcoming 2026',
            time: newTime.trim() || '10:00 AM - 05:00 PM',
            venue: newVenue.trim(),
            prize: newPrize.trim() || 'Certificates & Trophies',
            tagColor: colors.tagColor,
            tagBg: colors.tagBg,
            registered: false,
            registrations: []
        };

        try {
            await apiRequest('/campus/events', {
                method: 'POST',
                body: JSON.stringify({
                    title: newTitle.trim(),
                    description: newDesc.trim() || newTitle.trim(),
                    category: newCategory,
                    venue: newVenue.trim(),
                    date: newDate.trim() || '2026-10-15',
                    startTime: newTime.trim() || '10:00 AM',
                    prize: newPrize.trim()
                })
            });
        } catch (e) {
            // Keep optimistic creation
        }

        setEventsList(prev => [newEventObj, ...prev]);
        setCreating(false);
        setShowCreateModal(false);
        setNewTitle('');
        setNewDate('');
        setNewTime('');
        setNewVenue('');
        setNewPrize('');
        setNewDesc('');
        Alert.alert('Event Published', `"${newEventObj.title}" is now published on the Campus Life feed!`);
    };

    // Admin Delete Event
    const handleDeleteEvent = (event) => {
        Alert.alert(
            'Delete Campus Event',
            `Are you sure you want to permanently delete "${event.title}"?\nAll ${event.registrations?.length || 0} student registrations will be removed.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Event',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiRequest(`/campus/events/${event.id}`, { method: 'DELETE' });
                        } catch (e) {
                            // Keep optimistic delete
                        }
                        setEventsList(prev => prev.filter(e => e.id !== event.id));
                        Alert.alert('Event Deleted', `"${event.title}" has been removed from Campus Life.`);
                    }
                }
            ]
        );
    };

    // Admin Open Registrations
    const handleOpenRegistrations = (event) => {
        setActiveEventForRegistrations(event);
        setRegSearchQuery('');
        setShowRegistrationsModal(true);
    };

    const currentRegistrations = (activeEventForRegistrations?.registrations || []).filter(r => {
        if (!regSearchQuery.trim()) return true;
        const q = regSearchQuery.toLowerCase();
        return r.studentName?.toLowerCase().includes(q) ||
            r.rollNo?.toLowerCase().includes(q) ||
            r.department?.toLowerCase().includes(q);
    });

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Info */}
            <View style={styles.headerBanner}>
                <View style={styles.headerTopRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Happenings @ VGI</Text>
                        <Text style={styles.headerSubtitle}>
                            Explore upcoming fests, hackathons, sports tournaments, and placement drives.
                        </Text>
                    </View>
                    {isAdmin && (
                        <TouchableOpacity
                            style={styles.createEventBtn}
                            onPress={() => setShowCreateModal(true)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle" size={16} color={COLORS.white} />
                            <Text style={styles.createEventBtnText}>+ Create Event</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isAdmin && (
                    <View style={styles.adminControlTag}>
                        <Ionicons name="shield-checkmark" size={12} color="#9A3412" />
                        <Text style={styles.adminControlTagText}>
                            Admin Controls Active: You can create, delete, and view registrations for all events.
                        </Text>
                    </View>
                )}
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarWrap}>
                <Ionicons name="search-outline" size={18} color="#94A3B8" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events, venues, or keywords..."
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filter Dropdown */}
            <View style={{ marginBottom: 10 }}>
                <DropdownSelect
                    label="FILTER EVENTS BY CATEGORY"
                    value={selectedCategory}
                    options={categories.map(cat => ({ label: cat, value: cat }))}
                    onSelect={(val) => setSelectedCategory(val)}
                    icon="filter-outline"
                />
            </View>

            {/* Events List */}
            <View style={styles.eventsWrapper}>
                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Ionicons name="calendar-outline" size={42} color="#CBD5E1" />
                        <Text style={styles.emptyText}>No events found in this category.</Text>
                    </View>
                ) : (
                    filteredEvents.map(event => {
                        const regCount = event.registrations?.length || 0;

                        return (
                            <View key={event.id} style={styles.eventCard}>
                                {/* Card Top: Category Badge & Date */}
                                <View style={styles.cardTopRow}>
                                    <View style={[styles.eventBadge, { backgroundColor: event.tagBg }]}>
                                        <Text style={[styles.eventBadgeText, { color: event.tagColor }]}>
                                            {event.category}
                                        </Text>
                                    </View>
                                    <View style={styles.dateRow}>
                                        <Ionicons name="calendar" size={13} color="#64748B" />
                                        <Text style={styles.dateText}>{event.date}</Text>
                                    </View>
                                </View>

                                {/* Event Title */}
                                <Text style={styles.eventTitle}>{event.title}</Text>

                                {/* Venue & Timing */}
                                <View style={styles.infoMetaRow}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="location-outline" size={14} color="#64748B" />
                                        <Text style={styles.metaText}>{event.venue}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={14} color="#64748B" />
                                        <Text style={styles.metaText}>{event.time}</Text>
                                    </View>
                                </View>

                                {/* Highlight / Prize Pool */}
                                <View style={styles.prizeBox}>
                                    <Ionicons name="trophy-outline" size={14} color="#D97706" />
                                    <Text style={styles.prizeText}>{event.prize}</Text>
                                </View>

                                {/* Admin Action Row (View Registrations & Delete) */}
                                {isAdmin ? (
                                    <View style={styles.adminActionRow}>
                                        <TouchableOpacity
                                            style={styles.viewRegsBtn}
                                            onPress={() => handleOpenRegistrations(event)}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons name="people" size={15} color="#1D4ED8" />
                                            <Text style={styles.viewRegsBtnText}>
                                                Registrations ({regCount})
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.deleteEventBtn}
                                            onPress={() => handleDeleteEvent(event)}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
                                            <Text style={styles.deleteEventBtnText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    /* Student Registration Button */
                                    <TouchableOpacity
                                        style={[
                                            styles.registerBtn,
                                            event.registered && styles.registerBtnActive
                                        ]}
                                        activeOpacity={0.85}
                                        onPress={() => toggleRegister(event.id)}
                                    >
                                        <Ionicons
                                            name={event.registered ? "checkmark-circle" : "ticket-outline"}
                                            size={16}
                                            color={event.registered ? "#059669" : "#FFFFFF"}
                                        />
                                        <Text style={[
                                            styles.registerBtnText,
                                            event.registered && styles.registerBtnTextActive
                                        ]}>
                                            {event.registered ? 'REGISTERED (PASS ACTIVE)' : 'REGISTER NOW'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                )}
            </View>

            {/* ========================================================================= */}
            {/* ADMIN MODAL 1: CREATE NEW EVENT */}
            {/* ========================================================================= */}
            <Modal visible={showCreateModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Create Campus Event</Text>
                                <Text style={styles.modalSubtitle}>
                                    Publish upcoming fest, hackathon, placement drive, or tournament
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => setShowCreateModal(false)}
                            >
                                <Ionicons name="close" size={20} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                            <View style={styles.modalForm}>
                                <Text style={styles.inputLabel}>EVENT TITLE</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="e.g. Smart India Hackathon 2026"
                                    placeholderTextColor={COLORS.textLight}
                                    value={newTitle}
                                    onChangeText={setNewTitle}
                                />

                                <DropdownSelect
                                    label="EVENT CATEGORY"
                                    value={newCategory}
                                    options={[
                                        { label: 'Hackathons', value: 'Hackathons' },
                                        { label: 'Fests', value: 'Fests' },
                                        { label: 'Placements', value: 'Placements' },
                                        { label: 'Sports', value: 'Sports' },
                                        { label: 'Workshops', value: 'Workshops' }
                                    ]}
                                    onSelect={(val) => setNewCategory(val)}
                                    icon="pricetag-outline"
                                />

                                <View style={styles.formRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.inputLabel}>DATES / SCHEDULE</Text>
                                        <TextInput
                                            style={styles.inputBox}
                                            placeholder="e.g. 14-16 Nov 2026"
                                            placeholderTextColor={COLORS.textLight}
                                            value={newDate}
                                            onChangeText={setNewDate}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.inputLabel}>TIMING / DURATION</Text>
                                        <TextInput
                                            style={styles.inputBox}
                                            placeholder="e.g. 36 Hours Non-Stop"
                                            placeholderTextColor={COLORS.textLight}
                                            value={newTime}
                                            onChangeText={setNewTime}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.inputLabel}>CAMPUS VENUE / LOCATION</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="e.g. Main Auditorium Hall B"
                                    placeholderTextColor={COLORS.textLight}
                                    value={newVenue}
                                    onChangeText={setNewVenue}
                                />

                                <Text style={styles.inputLabel}>PRIZE POOL / KEY HIGHLIGHTS</Text>
                                <TextInput
                                    style={styles.inputBox}
                                    placeholder="e.g. ₹ 2,00,000 Cash Pool & Incubation"
                                    placeholderTextColor={COLORS.textLight}
                                    value={newPrize}
                                    onChangeText={setNewPrize}
                                />

                                <Text style={styles.inputLabel}>DESCRIPTION & ELIGIBILITY</Text>
                                <TextInput
                                    style={[styles.inputBox, { height: 60, textAlignVertical: 'top' }]}
                                    placeholder="e.g. Open for all departments and all 4 years..."
                                    placeholderTextColor={COLORS.textLight}
                                    multiline
                                    value={newDesc}
                                    onChangeText={setNewDesc}
                                />

                                <TouchableOpacity
                                    style={[styles.saveEventBtn, creating && { opacity: 0.7 }]}
                                    onPress={handleCreateEvent}
                                    disabled={creating}
                                >
                                    {creating ? (
                                        <ActivityIndicator size="small" color={COLORS.white} />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-done" size={17} color={COLORS.white} />
                                            <Text style={styles.saveEventBtnText}>Publish Event to Campus</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ========================================================================= */}
            {/* ADMIN MODAL 2: VIEW EVENT REGISTRATIONS */}
            {/* ========================================================================= */}
            <Modal visible={showRegistrationsModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={styles.modalTitle}>Student Registrations</Text>
                                    <View style={styles.countBadge}>
                                        <Text style={styles.countBadgeText}>
                                            {activeEventForRegistrations?.registrations?.length || 0} Total
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.modalSubtitle} numberOfLines={1}>
                                    Event: {activeEventForRegistrations?.title}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => setShowRegistrationsModal(false)}
                            >
                                <Ionicons name="close" size={20} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Registered Students */}
                        <View style={styles.regSearchBox}>
                            <Ionicons name="search" size={16} color="#94A3B8" />
                            <TextInput
                                style={styles.regSearchInput}
                                placeholder="Search by student name, roll no, or branch..."
                                placeholderTextColor="#94A3B8"
                                value={regSearchQuery}
                                onChangeText={setRegSearchQuery}
                            />
                            {regSearchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setRegSearchQuery('')}>
                                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                            {currentRegistrations.length === 0 ? (
                                <View style={styles.emptyRegsBox}>
                                    <Ionicons name="people-outline" size={38} color="#CBD5E1" />
                                    <Text style={styles.emptyRegsTitle}>No Registrations Found</Text>
                                    <Text style={styles.emptyRegsSubtitle}>
                                        {activeEventForRegistrations?.registrations?.length === 0
                                            ? 'No students have registered for this event yet.'
                                            : 'No registered student matches your search term.'}
                                    </Text>
                                </View>
                            ) : (
                                currentRegistrations.map((student, idx) => (
                                    <View key={student.id || idx} style={styles.studentRegCard}>
                                        <View style={styles.studentAvatar}>
                                            <Text style={styles.studentAvatarText}>
                                                {student.studentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.studentNameRow}>
                                                <Text style={styles.studentName}>{student.studentName}</Text>
                                                <View style={styles.deptPill}>
                                                    <Text style={styles.deptPillText}>{student.department}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.studentRoll}>
                                                Roll: {student.rollNo} • {student.course}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 2, flexWrap: 'wrap' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Ionicons name="mail-outline" size={12} color="#64748B" />
                                                    <Text style={styles.studentContact}>{student.email}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Ionicons name="call-outline" size={12} color="#64748B" />
                                                    <Text style={styles.studentContact}>{student.phone}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.registeredTime}>
                                                Registered: {student.registeredAt}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>
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
        paddingTop: 12,
        paddingBottom: 30
    },
    headerBanner: {
        backgroundColor: '#FFF7ED',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FED7AA',
        marginBottom: 14
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#9A3412',
        marginBottom: 4
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#7C2D12',
        lineHeight: 16
    },
    createEventBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#EA580C',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8
    },
    createEventBtnText: {
        fontSize: 11.5,
        fontWeight: '700',
        color: COLORS.white
    },
    adminControlTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFEDD5',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 6,
        marginTop: 10
    },
    adminControlTagText: {
        fontSize: 10.5,
        fontWeight: '600',
        color: '#9A3412',
        flex: 1
    },
    searchBarWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
        marginBottom: 12
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: '#1E293B'
    },
    eventsWrapper: {
        gap: 14
    },
    emptyWrap: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 8
    },
    emptyText: {
        fontSize: 13,
        color: '#94A3B8'
    },
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    eventBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
    },
    eventBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    dateText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B'
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8
    },
    infoMetaRow: {
        gap: 6,
        marginBottom: 10
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    metaText: {
        fontSize: 12,
        color: '#64748B'
    },
    prizeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12
    },
    prizeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E'
    },
    adminActionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4
    },
    viewRegsBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#EFF6FF',
        paddingVertical: 10,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#BFDBFE'
    },
    viewRegsBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1D4ED8'
    },
    deleteEventBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#FECACA'
    },
    deleteEventBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.danger
    },
    registerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#EA580C',
        paddingVertical: 11,
        borderRadius: 10
    },
    registerBtnActive: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0'
    },
    registerBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    registerBtnTextActive: {
        color: '#059669',
        fontWeight: '800'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 18,
        paddingBottom: 28,
        maxHeight: '90%'
    },
    modalScroll: {
        maxHeight: 520
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primaryDark
    },
    modalSubtitle: {
        fontSize: 11.5,
        color: COLORS.textMuted,
        marginTop: 2
    },
    modalCloseBtn: {
        padding: 6
    },
    countBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#BFDBFE'
    },
    countBadgeText: {
        fontSize: 10.5,
        fontWeight: '700',
        color: '#1D4ED8'
    },
    modalForm: {
        gap: 4
    },
    formRow: {
        flexDirection: 'row',
        gap: 10
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.textMuted,
        marginBottom: 4,
        letterSpacing: 0.5
    },
    inputBox: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.borderInput,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 13,
        color: COLORS.textMain,
        marginBottom: 10
    },
    saveEventBtn: {
        backgroundColor: '#EA580C',
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 6
    },
    saveEventBtnText: {
        color: COLORS.white,
        fontSize: 13.5,
        fontWeight: '800'
    },
    regSearchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 38,
        gap: 6,
        marginBottom: 12
    },
    regSearchInput: {
        flex: 1,
        fontSize: 12,
        color: '#1E293B'
    },
    emptyRegsBox: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 6
    },
    emptyRegsTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.primaryDark
    },
    emptyRegsSubtitle: {
        fontSize: 11.5,
        color: COLORS.textMuted,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    studentRegCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAF5FF',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#F3E8FF',
        marginBottom: 8,
        gap: 10
    },
    studentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#DDD6FE',
        alignItems: 'center',
        justifyContent: 'center'
    },
    studentAvatarText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#6D28D9'
    },
    studentNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    studentName: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.primaryDark
    },
    deptPill: {
        backgroundColor: '#EDE9FE',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 4
    },
    deptPillText: {
        fontSize: 9.5,
        fontWeight: '700',
        color: '#6D28D9'
    },
    studentRoll: {
        fontSize: 11,
        color: '#475569',
        marginTop: 2
    },
    studentContact: {
        fontSize: 10.5,
        color: COLORS.textMuted,
        marginTop: 2
    },
    registeredTime: {
        fontSize: 9.5,
        color: '#059669',
        fontWeight: '600',
        marginTop: 2
    }
});
