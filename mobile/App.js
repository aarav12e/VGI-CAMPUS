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
        else if (emailToSubmit === 'par24001' || emailToSubmit.includes('parent') || role === 'PARENT') emailToSubmit = 'suresh.patel@vgi.ac.in';
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
                const mappedRole = role === 'PARENT' ? 'PARENT' : u.role;

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
        };

        // HOD/Teacher tiles that should navigate to a full tab screen
        const HOD_TAB_TILES = {
            'hod_rollcall': 'attendance_portal',
        };

        if (role === 'STUDENT' && STUDENT_TAB_TILES[tileId]) {
            setActiveTab(STUDENT_TAB_TILES[tileId]);
            return;
        }
        if ((role === 'TEACHER' || role === 'HOD') && HOD_TAB_TILES[tileId]) {
            setActiveTab(HOD_TAB_TILES[tileId]);
            return;
        }

        setActiveModal(tileId);
    }

    function handleToggleTile(tileId) {
        const role = currentUser?.role;
        if (role === 'ADMIN') {
            setAdminTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
        } else if (role === 'TEACHER' || role === 'HOD') {
            setHodTiles(prev => prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]);
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
        } else if (role === 'TEACHER' || role === 'HOD') {
            setHodTiles(prev => prev.filter(id => id !== tileId));
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
    let badgeCount = 28;

    if (role === 'ADMIN') {
        headerTitle = activeTab === 'dashboard' ? 'Admin Portal' :
                      activeTab === 'admissions' ? 'Admissions & Enrollment' :
                      activeTab === 'happenings' ? 'Campus Life' : 'Grievance Central';
        badgeCount = 12;
    } else if (role === 'TEACHER' || role === 'HOD') {
        headerTitle = activeTab === 'dashboard' ? 'Faculty Portal' :
                      activeTab === 'attendance_portal' ? 'Classroom Attendance' :
                      activeTab === 'happenings' ? 'Campus Events' : 'Department RMS';
        badgeCount = 8;
    } else if (role === 'PARENT') {
        headerTitle = activeTab === 'dashboard' ? 'Parent Portal' :
                      activeTab === 'wardGrades' ? 'Ward Academic Snapshot' :
                      activeTab === 'happenings' ? 'Campus Life' : 'Parent Support';
        badgeCount = 5;
    } else {
        headerTitle = activeTab === 'dashboard' ? 'Dashboard' :
                      activeTab === 'happenings' ? 'Happenings' :
                      activeTab === 'rms' ? 'RMS Grievance' :
                      activeTab === 'attendance' ? 'Attendance' : 'View Marks';
        badgeCount = 28;
    }

    // =========================================================================
    // 3. ROLE-BASED DASHBOARDS & TAB NAVIGATION
    // =========================================================================
    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.appSafeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

            {/* Top Navigation Bar: Hamburger ☰, Portal Title, Bell Badge */}
            <TopHeader
                title={headerTitle}
                badgeCount={badgeCount}
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
                    ) : (role === 'TEACHER' || role === 'HOD') ? (
                        <HodDashboardScreen
                            currentUser={currentUser}
                            activeTileIds={hodTiles}
                            onTilePress={handleTilePress}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
                        />
                    ) : role === 'PARENT' ? (
                        <ParentDashboardScreen
                            currentUser={currentUser}
                            activeTileIds={parentTiles}
                            onTilePress={handleTilePress}
                            onAddTilesPress={() => setActiveModal('add_tiles')}
                            editTilesMode={editTilesMode}
                            onToggleEditTiles={() => setEditTilesMode(!editTilesMode)}
                            onRemoveTile={handleRemoveTile}
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

                {/* Tab 2: Campus Happenings & Events (all roles) */}
                {activeTab === 'happenings' && <HappeningsScreen />}

                {/* Tab 3: RMS Grievance Tickets (student + all can access from drawer) */}
                {activeTab === 'rms' && <RmsScreen />}

                {/* Admin-Specific Admissions Tab */}
                {activeTab === 'admissions' && role === 'ADMIN' && (
                    <ScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
                        <AdminEnrollmentSection onEnrollSuccess={() => setActiveTab('dashboard')} />
                    </ScrollView>
                )}

                {/* Teacher / HOD Specific Attendance Portal Tab */}
                {activeTab === 'attendance_portal' && (role === 'TEACHER' || role === 'HOD') && (
                    <TeacherPortalScreen
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                )}

                {/* Parent-Specific Ward Academic Snapshot Tab */}
                {activeTab === 'wardGrades' && role === 'PARENT' && (
                    <ParentPortalScreen
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                )}

                {/* Student-Only: View Marks & Transcripts Tab */}
                {activeTab === 'viewMarks' && role === 'STUDENT' && (
                    <ViewMarksScreen />
                )}

                {/* Student-Only: Attendance per Subject Tab */}
                {activeTab === 'attendance' && role === 'STUDENT' && (
                    <AttendanceScreen currentUser={currentUser} />
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
                    (role === 'TEACHER' || role === 'HOD') ? hodTiles :
                    role === 'PARENT' ? parentTiles : studentTiles
                }
                onToggleTile={handleToggleTile}
                rmsTickets={rmsTickets}
                onAddRmsTicket={handleAddRmsTicket}
                onOpenRmsTab={() => {
                    setActiveModal(null);
                    setActiveTab('rms');
                }}
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
