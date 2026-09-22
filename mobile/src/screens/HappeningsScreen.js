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

const CAMPUS_EVENTS = [
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
        registered: false
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
        registered: true
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
        registered: false
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
        registered: false
    }
];

export default function HappeningsScreen() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [eventsList, setEventsList] = useState(CAMPUS_EVENTS);

    const categories = ['All', 'Hackathons', 'Fests', 'Placements', 'Sports'];

    const filteredEvents = eventsList.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.venue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleRegister = (id) => {
        setEventsList(prev => prev.map(ev => {
            if (ev.id === id) {
                const nextStatus = !ev.registered;
                Alert.alert(
                    nextStatus ? 'Registration Confirmed!' : 'Registration Cancelled',
                    nextStatus ? `You are registered for "${ev.title}". E-Pass added to your passbook.` : `Registration removed.`
                );
                return { ...ev, registered: nextStatus };
            }
            return ev;
        }));
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Info */}
            <View style={styles.headerBanner}>
                <Text style={styles.headerTitle}>Happenings @ VGI</Text>
                <Text style={styles.headerSubtitle}>
                    Explore upcoming fests, hackathons, sports tournaments, and placement drives.
                </Text>
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

            {/* Category Filter Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
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

            {/* Events List */}
            <View style={styles.eventsWrapper}>
                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyWrap}>
                        <Ionicons name="calendar-outline" size={42} color="#CBD5E1" />
                        <Text style={styles.emptyText}>No events found in this category.</Text>
                    </View>
                ) : (
                    filteredEvents.map(event => (
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

                            {/* Registration Button */}
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
                        </View>
                    ))
                )}
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
        backgroundColor: '#FFF7ED',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FED7AA',
        marginBottom: 14
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
    categoryScroll: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 12
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    categoryChipActive: {
        backgroundColor: '#FFEDD5',
        borderColor: '#FDBA74'
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B'
    },
    categoryChipTextActive: {
        color: '#EA580C',
        fontWeight: '800'
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
    }
});
