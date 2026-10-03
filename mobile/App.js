import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest, setStoredToken, setStoredUser, clearStoredToken } from './src/api';
import {
    DEMO_PARENT,
    DEFAULT_TILE_IDS,
    DEFAULT_ADMIN_TILE_IDS,
    DEFAULT_HOD_TILE_IDS,
    DEFAULT_TEACHER_TILE_IDS,
    DEFAULT_PARENT_TILE_IDS
} from './src/constants/tilesData';

// Modular Screen Imports
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import AdminEnrollmentSection from './src/screens/admin/AdminEnrollmentSection';
import HodDashboardScreen from './src/screens/HodDashboardScreen';
import ParentDashboardScreen from './src/screens/ParentDashboardScreen';
import HappeningsScreen from './src/screens/HappeningsScreen';
import RmsScreen from './src/screens/RmsScreen';
import ViewMarksScreen from './src/screens/ViewMarksScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import TeacherPortalScreen from './src/screens/TeacherPortalScreen';
import ParentPortalScreen from './src/screens/ParentPortalScreen';
import WardOutpassScreen from './src/screens/WardOutpassScreen';
import StudentSyllabusScreen from './src/screens/StudentSyllabusScreen';
import AdminDepartmentSection from './src/screens/admin/AdminDepartmentSection';
import HodSyllabusTab from './src/screens/hod/HodSyllabusTab';
import HodAllocationsTab from './src/screens/hod/HodAllocationsTab';
import HodTeachersTab from './src/screens/hod/HodTeachersTab';
import HodStudentsTab from './src/screens/hod/HodStudentsTab';
import HodAnalyticsTab from './src/screens/hod/HodAnalyticsTab';
import HodSectionsTab from './src/screens/hod/HodSectionsTab';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';

// Modular Component Imports
import TopHeader from './src/components/TopHeader';
import LeftDrawer from './src/components/LeftDrawer';
import BottomTabBar from './src/components/BottomTabBar';
import FeatureModals from './src/components/FeatureModals';

export default function App() {
    // 1. First-time download onboarding state
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    // 2. Authenticated user state
    const [currentUser, setCurrentUser] = useState(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    // 3. Navigation & Tab state
    const [activeTab, setActiveTab] = useState('dashboard');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [editTilesMode, setEditTilesMode] = useState(false);

    // 4. Role-specific tile catalogs
    const [studentTiles, setStudentTiles] = useState(DEFAULT_TILE_IDS);
    const [adminTiles, setAdminTiles] = useState(DEFAULT_ADMIN_TILE_IDS);
    const [hodTiles, setHodTiles] = useState(DEFAULT_HOD_TILE_IDS);
    const [teacherTiles, setTeacherTiles] = useState(DEFAULT_TEACHER_TILE_IDS);
    const [parentTiles, setParentTiles] = useState(DEFAULT_PARENT_TILE_IDS);

    // 5. Grievance Tickets State
    const [rmsTickets, setRmsTickets] = useState([
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

    // 6. Dynamic Notification System
    const DEFAULT_NOTIFICATIONS = [
        { id: '1', title: 'Admit Cards for Mid-Term Examination ready for download', time: '10 mins ago', tag: 'Exams', isRead: false },
        { id: '2', title: 'TCS Placement Drive shortlisting round details updated', time: '1 hour ago', tag: 'Placement', isRead: false },
        { id: '3', title: 'Auditions for Annual Cultural Fest "Vibrance" this Friday', time: '3 hours ago', tag: 'Cultural', isRead: false },
        { id: '4', title: 'Operating Systems assignment submission deadline: Tomorrow', time: '5 hours ago', tag: 'Academics', isRead: false },
        { id: '5', title: 'Campus Wi-Fi maintenance completed in Aryabhata Hostel', time: 'Yesterday', tag: 'Hostel', isRead: false }
    ];
    const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

    function handleMarkAllNotificationsRead() {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }

    function handleMarkOneNotificationRead(id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }

    function handleClearAllNotifications() {
        setNotifications([]);
    }

    function handleDismissNotification(id) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    function handleResetNotifications() {
        setNotifications(DEFAULT_NOTIFICATIONS);
    }

    // Real Backend Authentication Login Handler
    async function handleManualLogin({ role, email, password }) {
        setLoginError(null);
        if (!email.trim()) {
            setLoginError('Please enter your Campus User ID or Email');
            return;
        }
        if (!password) {
            setLoginError('Please enter your password');
            return;
        }

        setLoginLoading(true);

        let emailToSubmit = email.trim().toLowerCase();
        if (emailToSubmit === '24ds001') emailToSubmit = 'aarav.patel@vgi.ac.in';
        else if (emailToSubmit === 'emp001') emailToSubmit = 'rajesh.sharma@vgi.ac.in';
        else if (emailToSubmit === 'emp002') emailToSubmit = 'priya.verma@vgi.ac.in';
        else if (emailToSubmit === 'par24001') emailToSubmit = 'suresh.patel@vgi.ac.in';
        else if (emailToSubmit === 'adm001') emailToSubmit = 'admin@vgi.ac.in';

        try {
            const res = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: emailToSubmit, password })
            });

            setLoginLoading(false);

            if (res.success && res.data) {
                setStoredToken(res.data.token);
                setStoredUser(res.data.user);
                const u = res.data.user;
                let mappedRole = u.role;
                if (role === 'PARENT' || u.role === 'PARENT') mappedRole = 'PARENT';
                else if (u.teacher?.designation?.includes('HOD') || u.role === 'HOD') mappedRole = 'HOD';
                else if (u.role === 'TEACHER') mappedRole = 'TEACHER';

                const appUser = {
                    id: u.id,
                    name: role === 'PARENT' ? (u.fullName || 'Suresh Patel') : u.fullName,
                    role: mappedRole,
                    email: u.email,
                    phone: u.phone,
                    program: u.student?.program?.name || u.ward?.program?.name || 'B.Tech Data Science (CSE)',
                    semester: u.student?.semester?.number || u.ward?.semester?.number || 5,
                    section: u.student?.section?.name || u.ward?.section?.name || 'Section A',
                    rollNumber: u.student?.rollNumber || u.ward?.rollNumber || '24DS001',
                    attendance: 84,
                    cgpa: '8.65',
                    employeeId: u.teacher?.employeeId || 'EMP001',
                    designation: u.teacher?.designation || 'Professor & HOD',
                    department: u.teacher?.department?.name || u.ward?.department?.name || 'Computer Science & Engineering',
                    ward: u.ward ? {
                        name: u.ward.user?.fullName || 'Aarav Patel',
                        rollNumber: u.ward.rollNumber || '24DS001',
                        program: u.ward.program?.name || 'B.Tech Data Science (CSE)',
                        semester: u.ward.semester?.number ? `Semester ${u.ward.semester.number}` : 'Semester 5',
                        section: u.ward.section?.name || 'Section A',
                        attendance: 84,
                        cgpa: u.ward.cgpa ? u.ward.cgpa.toString() : '8.65',
                        mentor: 'Dr. Rajesh Sharma (HOD)',
                        hostel: u.ward.hostelRoom || 'Aryabhata - Room 204'
                    } : DEMO_PARENT.ward
                };

                setCurrentUser(appUser);
                setActiveTab('dashboard');
            } else {
                const msg = res.error?.message || 'Authentication failed. Please verify credentials.';
                setLoginError(msg);
            }
        } catch (err) {
            setLoginLoading(false);
            setLoginError('Server side error');
        }
    }

    function handleLogout() {
        clearStoredToken();
        setCurrentUser(null);
        setDrawerOpen(false);
        setActiveModal(null);
        setActiveTab('dashboard');
    }

    function handleTilePress(tileId) {
        const role = currentUser?.role;

        // Student tiles that should navigate to a full tab screen
        const STUDENT_TAB_TILES = {
            'attendance':        'attendance',
            'results':           'viewMarks',
            'events':            'happenings',
            'rms_status':        'rms',
            'syllabus':          'syllabus',
            'timetable':         'attendance',
        };

        // Admin tiles that should navigate to a full tab screen
        const ADMIN_TAB_TILES = {
            'admin_admissions':  'admissions',
            'admin_departments': 'departments',
            'admin_rms':          'rms',
            'admin_events':       'happenings',
        };

        // HOD tiles that should navigate to a full tab screen
        const HOD_TAB_TILES = {
            'hod_rollcall':    'attendance_portal',
            'hod_syllabus':    'syllabus',
            'hod_timetable':   'allocations',
            'hod_allocations': 'allocations',
            'hod_teachers':    'teachers',
            'hod_faculty':     'teachers',
            'hod_students':    'students',
            'hod_analytics':   'analytics',
            'hod_sections':    'sections',
            'hod_campus':      'happenings',
            'hod_rms':         'rms',
        };

        // Teacher tiles that should navigate to a full tab screen
        const TEACHER_TAB_TILES = {
            'teacher_schedule': 'schedule',
            'teacher_rollcall': 'attendance_portal',
            'teacher_students': 'attendance_portal',
            'teacher_history':  'history',
            'teacher_campus':   'happenings',
            'teacher_support':  'rms',
        };

        // Parent tiles that should navigate to a full tab screen
        const PARENT_TAB_TILES = {
            'parent_outpass': 'outpass',
            'parent_feedback': 'rms',
        };

        if (role === 'STUDENT' && STUDENT_TAB_TILES[tileId]) {
            setActiveTab(STUDENT_TAB_TILES[tileId]);
            return;
        }
        if (role === 'ADMIN' && ADMIN_TAB_TILES[tileId]) {
            setActiveTab(ADMIN_TAB_TILES[tileId]);
            return;
        }
        if (role === 'HOD' && HOD_TAB_TILES[tileId]) {
            setActiveTab(HOD_TAB_TILES[tileId]);
            return;
        }
        if (role === 'TEACHER' && TEACHER_TAB_TILES[tileId]) {
            setActiveTab(TEACHER_TAB_TILES[tileId]);
            return;
        }
        if (role === 'PARENT' && PARENT_TAB_TILES[tileId]) {
            setActiveTab(PARENT_TAB_TILES[tileId]);
            return;
        }

        setActiveModal(tileId);
    }

    function handleToggleTile(tileId) {
        const role = currentUser?.role;
        if (role === 'ADMIN') {
            setAdminTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        } else if (role === 'HOD') {
            setHodTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        } else if (role === 'TEACHER') {
            setTeacherTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        } else if (role === 'PARENT') {
            setParentTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        } else {
            setStudentTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        }
    }

    function handleRemoveTile(tileId) {
        const role = currentUser?.role;
        if (role === 'ADMIN') {
            setAdminTiles(prev => prev.filter(id => id !== tileId));
        } else if (role === 'HOD') {
            setHodTiles(prev => prev.filter(id => id !== tileId));
        } else if (role === 'TEACHER') {
            setTeacherTiles(prev => prev.filter(id => id !== tileId));
        } else if (role === 'PARENT') {
            setParentTiles(prev => prev.filter(id => id !== tileId));
        } else {
            setStudentTiles(prev => prev.filter(id => id !== tileId));
        }
    }

    function handleAddRmsTicket(newTicket) {
        setRmsTickets(prev => [newTicket, ...prev]);
    }

    // =========================================================================
    // 1. FIRST-TIME ONBOARDING FLOW
    // =========================================================================
    if (!hasCompletedOnboarding) {
        return <OnboardingScreen onFinish={() => setHasCompletedOnboarding(true)} />;
    }

    // =========================================================================
    // 2. UNIFIED ROLE-BASED LOGIN SCREEN
    // =========================================================================
    if (!currentUser) {
        return (
            <LoginScreen
                onLogin={handleManualLogin}
                loginLoading={loginLoading}
                loginError={loginError}
            />
        );
    }

    // Active User Role
    const role = currentUser?.role;

    // Header Title & Badge Count
    let headerTitle = 'Dashboard';
    const unreadCount = notifications.filter(n => !n.isRead).length;
    let badgeCount = unreadCount;

    if (role === 'ADMIN') {
        headerTitle = activeTab === 'dashboard' ? 'Admin Portal' :
                      activeTab === 'admissions' ? 'Admissions & Enrollment' :
                      activeTab === 'departments' ? 'Academic Departments' :
                      activeTab === 'happenings' ? 'Campus Life' : 'Grievance Central';
    } else if (role === 'HOD') {
        headerTitle = activeTab === 'dashboard' ? 'HOD Command Center' :
                      activeTab === 'syllabus' ? 'Course Syllabus Manager' :
                      activeTab === 'allocations' ? 'Timetable & Allocations' :
                      activeTab === 'attendance_portal' ? 'Classroom Roll-Call' :
                      activeTab === 'teachers' ? 'Faculty Directory' :
                      activeTab === 'happenings' ? 'Campus Events' : 'Department RMS';
    } else if (role === 'TEACHER') {
        headerTitle = activeTab === 'dashboard' ? 'Faculty Roll-Call Portal' :
                      activeTab === 'schedule' ? 'Lecture Schedule' :
                      activeTab === 'happenings' ? 'Campus Events' : 'Department RMS';
    } else if (role === 'PARENT') {
        headerTitle = activeTab === 'outpass' ? 'Ward Hostel Outpass' :
                      activeTab === 'rms' ? 'Parent Support & Inquiries' : 'Ward Academic Progress';
    } else {
        headerTitle = activeTab === 'dashboard' ? 'Dashboard' :
                      activeTab === 'happenings' ? 'Happenings' :
                      activeTab === 'rms' ? 'RMS Grievance' :
                      activeTab === 'attendance' ? 'Attendance' :
                      activeTab === 'syllabus' ? 'Course Syllabus' : 'View Marks';
    }

    // =========================================================================
    // 3. ROLE-BASED DASHBOARDS & TAB NAVIGATION
    // =========================================================================
    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.appSafeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

            {/* Top Navigation Bar: Hamburger ☰ or Left Arrow ←, Portal Title, Bell Badge */}
            <TopHeader
                title={headerTitle}
                badgeCount={badgeCount}
                canGoBack={activeTab !== 'dashboard'}
                onGoBack={() => setActiveTab('dashboard')}
                onOpenDrawer={() => setDrawerOpen(true)}
                onOpenNotifications={() => setActiveModal('notifications')}
            />

            {/* Main Tab Screen Area */}
            <View style={styles.tabContentContainer}>
                {/* Tab 1: Role-Specific Home / Dashboard */}
                {activeTab === 'dashboard' && (
                    role === 'ADMIN' ? (
                        <AdminDashboardScreen
                            currentUser={currentUser}
                            activeTileIds={adminTiles}
                            onTilePress={handleTilePress}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
                        />
                    ) : role === 'HOD' ? (
                        <HodDashboardScreen
                            currentUser={currentUser}
                            onSelectTab={setActiveTab}
                            onTilePress={handleTilePress}
                            activeTileIds={hodTiles}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
                        />
                    ) : role === 'TEACHER' ? (
                        <TeacherDashboardScreen
                            currentUser={currentUser}
                            activeTileIds={teacherTiles}
                            onTilePress={handleTilePress}
                            onSelectTab={setActiveTab}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
                        />
                    ) : role === 'PARENT' ? (
                        <ParentPortalScreen
                            currentUser={currentUser}
                            onLogout={handleLogout}
                            onSelectTab={setActiveTab}
                        />
                    ) : (
                        <DashboardScreen
                            currentUser={currentUser}
                            activeTileIds={studentTiles}
                            onTilePress={handleTilePress}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
                        />
                    )
                )}

                {/* Tab 2: Campus Happenings & Events (Hidden for Parent) */}
                {activeTab === 'happenings' && (
                    role === 'PARENT' ? (
                        <ParentPortalScreen
                            currentUser={currentUser}
                            onLogout={handleLogout}
                        />
                    ) : (
                        <HappeningsScreen
                            currentUser={currentUser}
                            role={role}
                        />
                    )
                )}

                {/* Tab 3: RMS Grievance Tickets (privacy isolated per user, admin sees all) */}
                {activeTab === 'rms' && <RmsScreen currentUser={currentUser} />}

                {/* Admin-Specific Admissions Tab */}
                {activeTab === 'admissions' && role === 'ADMIN' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <AdminEnrollmentSection onEnrollSuccess={() => setActiveTab('dashboard')} />
                    </ScrollView>
                )}

                {/* Admin-Specific Departments Tab */}
                {activeTab === 'departments' && role === 'ADMIN' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <AdminDepartmentSection />
                    </ScrollView>
                )}

                {/* Teacher / HOD Specific Attendance Portal Tab */}
                {activeTab === 'attendance_portal' && (role === 'TEACHER' || role === 'HOD') && (
                    <TeacherPortalScreen
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                )}

                {/* Teacher-Specific Lecture Schedule Tab */}
                {activeTab === 'schedule' && role === 'TEACHER' && (
                    <TeacherPortalScreen
                        currentUser={currentUser}
                        initialTab="schedule"
                        onLogout={handleLogout}
                    />
                )}

                {/* HOD-Specific Course Syllabus Tab */}
                {activeTab === 'syllabus' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodSyllabusTab />
                    </ScrollView>
                )}

                {/* HOD-Specific Timetable & Allocations Tab */}
                {activeTab === 'allocations' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodAllocationsTab currentUser={currentUser} />
                    </ScrollView>
                )}

                {/* HOD-Specific Faculty Directory Tab */}
                {activeTab === 'teachers' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodTeachersTab />
                    </ScrollView>
                )}

                {/* Teacher-Specific Attendance Logs History Tab */}
                {activeTab === 'history' && role === 'TEACHER' && (
                    <TeacherPortalScreen
                        currentUser={currentUser}
                        initialTab="history"
                        onLogout={handleLogout}
                    />
                )}

                {/* HOD-Specific Students Cohort Tab */}
                {activeTab === 'students' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodStudentsTab />
                    </ScrollView>
                )}

                {/* HOD-Specific Analytics Audit Tab */}
                {activeTab === 'analytics' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodAnalyticsTab />
                    </ScrollView>
                )}

                {/* HOD-Specific Sections Tab */}
                {activeTab === 'sections' && role === 'HOD' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <HodSectionsTab />
                    </ScrollView>
                )}

                {/* Parent-Specific Ward Academic Snapshot Tab */}
                {activeTab === 'wardGrades' && role === 'PARENT' && (
                    <ParentPortalScreen
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                )}

                {/* Parent-Specific Ward Outpass Tab */}
                {activeTab === 'outpass' && role === 'PARENT' && (
                    <WardOutpassScreen currentUser={currentUser} />
                )}

                {/* Student-Only: View Marks & Transcripts Tab */}
                {activeTab === 'viewMarks' && role === 'STUDENT' && (
                    <ViewMarksScreen />
                )}

                {/* Student-Only: Attendance per Subject Tab */}
                {activeTab === 'attendance' && role === 'STUDENT' && (
                    <AttendanceScreen currentUser={currentUser} />
                )}

                {/* Student-Only: Course Syllabus Tab */}
                {activeTab === 'syllabus' && role === 'STUDENT' && (
                    <StudentSyllabusScreen currentUser={currentUser} />
                )}
            </View>

            {/* 4-Tab Bottom Navigation Bar (Role-Specific) */}
            <BottomTabBar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                userRole={role}
            />

            {/* Left Sliding Navigation Drawer with Role-Specific Menus & Avatar */}
            <LeftDrawer
                visible={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                currentUser={currentUser}
                onSelectTab={(tabId) => {
                    setDrawerOpen(false);
                    setActiveTab(tabId);
                }}
                onOpenModal={(modalId) => {
                    setDrawerOpen(false);
                    setActiveModal(modalId);
                }}
                onLogout={handleLogout}
            />

            {/* Interactive Modals for Grid Tiles and Drawer Actions */}
            <FeatureModals
                activeModal={activeModal}
                onClose={() => setActiveModal(null)}
                activeTileIds={
                    role === 'ADMIN' ? adminTiles :
                    role === 'HOD' ? hodTiles :
                    role === 'TEACHER' ? teacherTiles :
                    role === 'PARENT' ? parentTiles : studentTiles
                }
                onToggleTile={handleToggleTile}
                rmsTickets={rmsTickets}
                onAddRmsTicket={handleAddRmsTicket}
                onOpenRmsTab={() => {
                    setActiveModal(null);
                    setActiveTab('rms');
                }}
                role={role}
                notifications={notifications}
                onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
                onMarkOneNotificationRead={handleMarkOneNotificationRead}
                onClearAllNotifications={handleClearAllNotifications}
                onDismissNotification={handleDismissNotification}
                onResetNotifications={handleResetNotifications}
            />
        </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    appSafeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    tabContentContainer: {
        flex: 1
    }
});
