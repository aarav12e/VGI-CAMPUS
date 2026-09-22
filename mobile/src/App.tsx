import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Assets for Onboarding and Accreditation
const imgStudent = require('../assets/onboarding/student.jpg');
const imgEconnect = require('../assets/onboarding/econnect.jpg');
const imgParents = require('../assets/onboarding/parents.jpg');
const imgStaff = require('../assets/onboarding/staff.jpg');
const imgAccreditation = require('../assets/onboarding/accreditation_banner.jpg');

// 4 Onboarding Slides matching inspiration screenshots
const ONBOARDING_SLIDES = [
  {
    id: 'regular-student',
    title: 'Regular Student',
    description: 'The future is here!! Welcome to the Smartest way to stay connected and access everything Vishveshwarya Group of Institutions has put in place for you!!',
    image: imgStudent,
  },
  {
    id: 'econnect-student',
    title: 'E-Connect Student',
    description: 'Get all your learning resources, attend PCP meetings and much more, just at the flip of your fingers',
    image: imgEconnect,
  },
  {
    id: 'parents',
    title: 'Parents',
    description: 'Simplified App solution for parents to know everything that matters to their Child at VGI!!',
    image: imgParents,
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'One stop platform to assist you in all of your daily academic and extra-curricular activities',
    image: imgStaff,
  }
];

// Initial Demo Personas
const DEMO_STUDENT = {
  name: 'Aarav Patel',
  role: 'STUDENT',
  email: 'aarav.patel@vgi.ac.in',
  userId: '24DS001',
  rollNumber: '24DS001',
  enrollmentNumber: 'ENR2024001',
  program: 'B.Tech Data Science (CSE)',
  semester: 5,
  section: 'Section A',
  cgpa: '8.65',
  attendance: 84,
  hostelRoom: 'Aryabhata Hostel - Room 204',
  guardian: 'Suresh Patel (+91 98760 11223)'
};

const DEMO_TEACHER = {
  name: 'Dr. Rajesh Sharma',
  role: 'TEACHER',
  email: 'rajesh.sharma@vgi.ac.in',
  userId: 'EMP001',
  employeeId: 'EMP001',
  designation: 'Professor & HOD',
  department: 'Computer Science & Engineering',
  qualification: 'Ph.D. in Computer Science (IIT Roorkee)'
};

const DEMO_PARENT = {
  name: 'Suresh Patel',
  role: 'PARENT',
  email: 'suresh.patel@vgi.ac.in',
  userId: 'PAR24001',
  phone: '+91 98760 11223',
  relation: 'Father / Guardian',
  ward: {
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
  }
};

const DEMO_ADMIN = {
  name: 'Prof. S. K. Verma',
  role: 'ADMIN',
  email: 'admin@vgi.ac.in',
  userId: 'ADM001',
  designation: 'Registrar & Dean of Academics',
  department: 'University Administration'
};

export default function App() {
  // First-time download onboarding state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Login form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'>('STUDENT');
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'academics' | 'teacherAttendance' | 'campus' | 'profile'>('home');
  const [academicSubTab, setAcademicSubTab] = useState<'attendance' | 'timetable' | 'subjects' | 'assignments' | 'results'>('attendance');
  const [campusSubTab, setCampusSubTab] = useState<'notices' | 'events' | 'hostel' | 'mess' | 'fees'>('notices');

  // Teacher roll-call state
  const [selectedClass, setSelectedClass] = useState('BCS501 - Section A');
  const [lectureTopic, setLectureTopic] = useState('Relational Normalization (1NF to BCNF)');
  const [attendanceList, setAttendanceList] = useState([
    { id: '1', name: 'Aarav Patel', roll: '24DS001', present: true },
    { id: '2', name: 'Sneha Gupta', roll: '24DS002', present: true },
    { id: '3', name: 'Rohan Singh', roll: '24DS003', present: false },
    { id: '4', name: 'Ananya Sharma', roll: '24DS004', present: true }
  ]);
  const [teacherSessionSubmitted, setTeacherSessionSubmitted] = useState(false);

  // Student interaction state
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [eventRegistered, setEventRegistered] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [complaints, setComplaints] = useState([
    { id: '1', category: 'ELECTRICAL', desc: 'Ceiling fan regulator in Room 204 running on max speed only', status: 'IN_PROGRESS' }
  ]);

  // Login handler
  function handleManualLogin() {
    setLoginError(null);
    const idLower = loginEmail.trim().toLowerCase();

    if (selectedRole === 'PARENT' || idLower.includes('parent') || idLower === 'suresh.patel@vgi.ac.in' || idLower === 'par24001') {
      setCurrentUser(DEMO_PARENT);
      setActiveTab('home');
    } else if (selectedRole === 'TEACHER' || idLower === 'rajesh.sharma@vgi.ac.in' || idLower === 'emp001' || idLower.includes('teacher') || idLower.includes('faculty')) {
      setCurrentUser(DEMO_TEACHER);
      setActiveTab('teacherAttendance');
    } else if (selectedRole === 'ADMIN' || idLower === 'admin@vgi.ac.in' || idLower === 'adm001') {
      setCurrentUser(DEMO_ADMIN);
      setActiveTab('home');
    } else if (idLower === 'aarav.patel@vgi.ac.in' || idLower === '24ds001' || selectedRole === 'STUDENT') {
      setCurrentUser(DEMO_STUDENT);
      setActiveTab('home');
    } else if (loginEmail.length > 0) {
      setCurrentUser({
        ...DEMO_STUDENT,
        name: loginEmail.split('@')[0],
        email: loginEmail
      });
      setActiveTab('home');
    } else {
      setLoginError('Please enter your Campus User ID or Email');
    }
  }

  function handleQuickLogin(persona: 'student' | 'teacher' | 'parent' | 'admin') {
    setLoginError(null);
    if (persona === 'student') {
      setSelectedRole('STUDENT');
      setCurrentUser(DEMO_STUDENT);
      setActiveTab('home');
    } else if (persona === 'teacher') {
      setSelectedRole('TEACHER');
      setCurrentUser(DEMO_TEACHER);
      setActiveTab('teacherAttendance');
    } else if (persona === 'parent') {
      setSelectedRole('PARENT');
      setCurrentUser(DEMO_PARENT);
      setActiveTab('home');
    } else if (persona === 'admin') {
      setSelectedRole('ADMIN');
      setCurrentUser(DEMO_ADMIN);
      setActiveTab('home');
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setActiveTab('home');
  }

  function toggleStudentAttendance(id: string) {
    setAttendanceList(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  }

  function markAll(present: boolean) {
    setAttendanceList(prev => prev.map(s => ({ ...s, present })));
  }

  function submitTeacherAttendance() {
    setTeacherSessionSubmitted(true);
    setTimeout(() => setTeacherSessionSubmitted(false), 3500);
  }

  function handleRaiseComplaint() {
    if (!complaintText.trim()) return;
    setComplaints(prev => [
      { id: String(Date.now()), category: 'MAINTENANCE', desc: complaintText, status: 'PENDING' },
      ...prev
    ]);
    setComplaintText('');
  }

  const isTeacher = currentUser?.role === 'TEACHER';
  const isParent = currentUser?.role === 'PARENT';
  const isAdmin = currentUser?.role === 'ADMIN';
  const presentCount = attendanceList.filter(s => s.present).length;
  const absentCount = attendanceList.length - presentCount;

  // =========================================================================
  // 1. FIRST-TIME ONBOARDING FLOW (Screens 1 to 4 from Inspiration Images)
  // =========================================================================
  if (!hasCompletedOnboarding) {
    const currentSlide = ONBOARDING_SLIDES[onboardingIndex];
    const isLastSlide = onboardingIndex === ONBOARDING_SLIDES.length - 1;

    return (
      <SafeAreaView style={styles.onboardingSafeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Top Header: Skip & Brand */}
        <View style={styles.onboardingTopBar}>
          <View style={styles.vgiMiniBadge}>
            <Text style={styles.vgiMiniBadgeText}>VGI</Text>
          </View>
          <TouchableOpacity 
            style={styles.onboardingSkipBtn}
            activeOpacity={0.7}
            onPress={() => setHasCompletedOnboarding(true)}
          >
            <Text style={styles.onboardingSkipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slide Content Scroll */}
        <ScrollView 
          contentContainerStyle={styles.onboardingContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Main Illustration Matching Inspiration */}
          <View style={styles.onboardingIllustrationWrap}>
            <Image 
              source={currentSlide.image} 
              style={styles.onboardingIllustrationImg}
              resizeMode="contain"
            />
          </View>

          {/* Title & Coral Accent Line */}
          <View style={styles.onboardingTextWrap}>
            <Text style={styles.onboardingTitle}>{currentSlide.title}</Text>
            <View style={styles.onboardingTitleBar} />
            <Text style={styles.onboardingDescription}>{currentSlide.description}</Text>
          </View>

          {/* Action Button: "GET STARTED" on Slide 4, else "NEXT" */}
          <View style={styles.onboardingActionWrap}>
            {isLastSlide ? (
              <TouchableOpacity 
                style={styles.getStartedBtn}
                activeOpacity={0.88}
                onPress={() => setHasCompletedOnboarding(true)}
              >
                <Text style={styles.getStartedBtnText}>GET STARTED</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.nextSlideBtn}
                activeOpacity={0.88}
                onPress={() => setOnboardingIndex(prev => Math.min(prev + 1, ONBOARDING_SLIDES.length - 1))}
              >
                <Text style={styles.nextSlideBtnText}>NEXT</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* 4 Interactive Pagination Dots (Active dot is Cyan-Blue #0284C7) */}
          <View style={styles.onboardingDotsRow}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setOnboardingIndex(i)}
                style={[
                  styles.onboardingDot,
                  onboardingIndex === i ? styles.onboardingDotActive : styles.onboardingDotInactive
                ]}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // 2. UNIFIED ROLE-BASED LOGIN SCREEN (Screen 5 from Inspiration Image)
  // =========================================================================
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.loginSafeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF7ED" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.loginScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Sunset/Peach Header Background */}
            <View style={styles.loginHeaderGlow}>
              {/* Institution Crest and Name */}
              <View style={styles.loginInstitutionBranding}>
                <View style={styles.universityLogoRow}>
                  {/* Crest Box */}
                  <View style={styles.crestCircle}>
                    <Ionicons name="school" size={26} color="#C2410C" />
                  </View>
                  <View style={styles.crestVerticalLine} />
                  <View>
                    <Text style={styles.univBrandMain}>VISHVESHWARYA</Text>
                    <Text style={styles.univBrandSub}>GROUP OF INSTITUTIONS</Text>
                  </View>
                </View>
                
                {/* Double Bordered Tagline Banner */}
                <View style={styles.taglineDoubleBorder}>
                  <Text style={styles.taglineText}>
                    Transforming Education Transforming India
                  </Text>
                </View>
              </View>
            </View>

            {/* Error Alert */}
            {loginError && (
              <View style={styles.loginErrorAlert}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.loginErrorText}>{loginError}</Text>
              </View>
            )}

            {/* Role Access Selector Tabs */}
            <View style={styles.roleTabsContainer}>
              <Text style={styles.roleTabsLabel}>SELECT ROLE FOR UNIFIED LOGIN</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleTabsScroll}>
                {[
                  { id: 'STUDENT', label: 'Regular Student', icon: 'school-outline' },
                  { id: 'TEACHER', label: 'Staff / Faculty', icon: 'person-outline' },
                  { id: 'PARENT', label: 'Parents', icon: 'people-outline' },
                  { id: 'ADMIN', label: 'Administration', icon: 'shield-checkmark-outline' }
                ].map(r => (
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.roleTabPill, selectedRole === r.id && styles.roleTabPillActive]}
                    onPress={() => setSelectedRole(r.id as any)}
                  >
                    <Ionicons 
                      name={r.icon as any} 
                      size={14} 
                      color={selectedRole === r.id ? '#FFFFFF' : '#475569'} 
                    />
                    <Text style={[styles.roleTabPillText, selectedRole === r.id && styles.roleTabPillTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Unified Input Card Matching Screenshot 5 */}
            <View style={styles.loginFormCard}>
              {/* User ID Input Box */}
              <View style={styles.inputFieldContainer}>
                <View style={styles.inputIconCircle}>
                  <Ionicons name="person" size={18} color="#FA7268" />
                </View>
                <TextInput
                  style={styles.textInputField}
                  placeholder={
                    selectedRole === 'STUDENT' ? 'User Id (e.g. 24DS001 or Email)' :
                    selectedRole === 'TEACHER' ? 'Faculty Id (e.g. EMP001 or Email)' :
                    selectedRole === 'PARENT' ? 'Registered Parent Mobile / Email' :
                    'Admin Username / Email'
                  }
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                />
              </View>

              {/* Password Input Box */}
              <View style={[styles.inputFieldContainer, { marginTop: 14 }]}>
                <View style={styles.inputIconCircle}>
                  <Ionicons name="lock-closed" size={18} color="#FA7268" />
                </View>
                <TextInput
                  style={styles.textInputField}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeToggleBtn}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={18} 
                    color="#94A3B8" 
                  />
                </TouchableOpacity>
              </View>

              {/* Coral-to-Gold Sign In Button (Matching Screenshot 5) */}
              <TouchableOpacity 
                style={styles.signInGradientBtn}
                activeOpacity={0.88}
                onPress={handleManualLogin}
              >
                <View style={styles.signInBtnContent}>
                  <Text style={styles.signInBtnLabel}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* Action Buttons Row: Forgot Password & Guest User */}
              <View style={styles.loginActionsRow}>
                <TouchableOpacity 
                  style={styles.actionOutlineBtn}
                  onPress={() => setForgotPasswordVisible(true)}
                >
                  <Text style={styles.actionOutlineText}>Forgot Password ?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionOutlineBtn}
                  onPress={() => handleQuickLogin('student')}
                >
                  <Text style={styles.actionOutlineText}>Guest User</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Modal / Info */}
            {forgotPasswordVisible && (
              <View style={styles.forgotPassModal}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.forgotPassTitle}>Password Recovery</Text>
                  <TouchableOpacity onPress={() => setForgotPasswordVisible(false)}>
                    <Ionicons name="close-circle" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.forgotPassDesc}>
                  To reset your password or retrieve your User ID, contact VGI IT Support:
                </Text>
                <Text style={styles.forgotPassEmail}>it.helpdesk@vgi.ac.in</Text>
                <Text style={styles.forgotPassSub}>Or visit the Academic Registrar Office (Ground Floor, Admin Block).</Text>
              </View>
            )}

            {/* Quick 1-Tap Personas */}
            <View style={styles.quickAccessSection}>
              <Text style={styles.quickAccessHeader}>1-TAP QUICK PERSONA ACCESS</Text>
              <View style={styles.personaGrid}>
                {/* Student */}
                <TouchableOpacity
                  style={[styles.personaCard, { borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }]}
                  onPress={() => handleQuickLogin('student')}
                >
                  <Text style={styles.personaEmoji}>🎓</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.personaTitle, { color: '#1E3A8A' }]}>Regular Student</Text>
                    <Text style={styles.personaSub}>Aarav Patel (Roll 24DS001)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                </TouchableOpacity>

                {/* Faculty */}
                <TouchableOpacity
                  style={[styles.personaCard, { borderColor: '#A7F3D0', backgroundColor: '#ECFDF5' }]}
                  onPress={() => handleQuickLogin('teacher')}
                >
                  <Text style={styles.personaEmoji}>👨‍🏫</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.personaTitle, { color: '#065F46' }]}>Staff / Faculty</Text>
                    <Text style={styles.personaSub}>Dr. Rajesh Sharma (HOD)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#059669" />
                </TouchableOpacity>

                {/* Parent */}
                <TouchableOpacity
                  style={[styles.personaCard, { borderColor: '#FED7AA', backgroundColor: '#FFF7ED' }]}
                  onPress={() => handleQuickLogin('parent')}
                >
                  <Text style={styles.personaEmoji}>👨‍👩‍👦</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.personaTitle, { color: '#9A3412' }]}>Parents Portal</Text>
                    <Text style={styles.personaSub}>Suresh Patel (Ward Attendance)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#EA580C" />
                </TouchableOpacity>

                {/* Admin */}
                <TouchableOpacity
                  style={[styles.personaCard, { borderColor: '#DDD6FE', backgroundColor: '#F5F3FF' }]}
                  onPress={() => handleQuickLogin('admin')}
                >
                  <Text style={styles.personaEmoji}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.personaTitle, { color: '#5B21B6' }]}>Administration</Text>
                    <Text style={styles.personaSub}>Prof. S.K. Verma (Registrar)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Accreditation Banner (Exact Match to Screenshot 5 bottom) */}
            <View style={styles.accreditationContainer}>
              <Text style={styles.accreditationHeaderTitle}>
                VGI RECEIVES HIGHEST ACCREDITATION
              </Text>
              
              <View style={styles.accreditationBannerCard}>
                <Image 
                  source={imgAccreditation} 
                  style={styles.accreditationImg}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.accreditationBottomBadge}>
                <Text style={styles.accreditationBottomText}>
                  Highest Score in 1st Cycle of Accreditation Among All Government and Private Technical Universities*
                </Text>
              </View>
            </View>

            {/* Reset / View Tour Again */}
            <TouchableOpacity 
              style={styles.viewTourLink}
              onPress={() => {
                setHasCompletedOnboarding(false);
                setOnboardingIndex(0);
              }}
            >
              <Ionicons name="refresh-outline" size={14} color="#64748B" />
              <Text style={styles.viewTourLinkText}>View App Introduction Slides Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // 2. LOGGED-IN APPLICATION SHELL
  // =========================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerBrand}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>VGI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>VGI CAMPUS</Text>
            <Text style={styles.headerSubtitle}>
              {isTeacher ? 'FACULTY PORTAL' : 'STUDENT SUPER-APP'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Sign Out Button in Header */}
          <TouchableOpacity 
            style={styles.signOutHeaderBtn}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={16} color="#DC2626" />
            <Text style={styles.signOutHeaderText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileBadgeBtn}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.profileBadgeLetter}>
              {currentUser.name ? currentUser.name[0] : 'U'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* TEACHER ATTENDANCE BANNER (Always visible on student view to guide user) */}
        {!isTeacher && (
          <TouchableOpacity 
            style={styles.facultyAttendanceBanner}
            activeOpacity={0.85}
            onPress={() => {
              setCurrentUser(DEMO_TEACHER);
              setActiveTab('teacherAttendance');
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.facultyIconCircle}>
                <Ionicons name="checkbox" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.facultyBannerTitle}>Professor Attendance Portal</Text>
                <Text style={styles.facultyBannerSub}>
                  Tap here to see how professors mark attendance!
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#2563EB" />
            </View>
          </TouchableOpacity>
        )}

        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <View>
            {isParent ? (
              <View style={styles.parentWardCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={styles.parentOverline}>REGISTERED WARD PROFILE</Text>
                    <Text style={styles.parentWardName}>{currentUser.ward.name}</Text>
                    <Text style={styles.parentWardSub}>{currentUser.ward.program} • Semester {currentUser.ward.semester}</Text>
                  </View>
                  <View style={styles.parentAvatarCircle}>
                    <Ionicons name="people" size={24} color="#EA580C" />
                  </View>
                </View>
                <View style={styles.parentStatsRow}>
                  <View style={styles.parentStatBox}>
                    <Text style={styles.parentStatLabel}>ATTENDANCE</Text>
                    <Text style={[styles.parentStatValue, { color: '#10B981' }]}>{currentUser.ward.attendance}%</Text>
                    <Text style={styles.parentStatSub}>Met (≥75%)</Text>
                  </View>
                  <View style={styles.parentStatBox}>
                    <Text style={styles.parentStatLabel}>SEMESTER CGPA</Text>
                    <Text style={[styles.parentStatValue, { color: '#2563EB' }]}>{currentUser.ward.cgpa}</Text>
                    <Text style={styles.parentStatSub}>Grade: A+</Text>
                  </View>
                  <View style={styles.parentStatBox}>
                    <Text style={styles.parentStatLabel}>FEE DUES</Text>
                    <Text style={[styles.parentStatValue, { color: '#059669' }]}>CLEAR</Text>
                    <Text style={styles.parentStatSub}>{currentUser.ward.feeStatus}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.heroCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={styles.heroPretitle}>ACADEMIC YEAR 2026-2027</Text>
                    <Text style={styles.heroTitle}>Hello, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</Text>
                  </View>
                  <View style={styles.heroAvatar}>
                    <Ionicons name="school" size={22} color="#2563EB" />
                  </View>
                </View>
                <Text style={styles.heroProgram}>{currentUser.program || currentUser.department || 'Vishveshwarya Group of Institutions'}</Text>
                <Text style={styles.heroDetails}>
                  {currentUser.role} • {currentUser.rollNumber || currentUser.employeeId || currentUser.userId || 'VGI'}
                </Text>
              </View>
            )}

            {/* Attendance Overview Card */}
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.85}
              onPress={() => { setActiveTab('academics'); setAcademicSubTab('attendance'); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.cardOverline}>OVERALL ATTENDANCE</Text>
                  <Text style={styles.bigStatNumber}>{currentUser.attendance}%</Text>
                </View>
                <View style={[styles.statIconWrapper, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                </View>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${currentUser.attendance}%` }]} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700' }}>
                  ✓ Above 75% Statutory Requirement
                </Text>
                <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '700' }}>
                  View Details →
                </Text>
              </View>
            </TouchableOpacity>

            {/* Next Lecture Schedule */}
            <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#2563EB' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.badgeBlue}>NEXT CLASS</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="time-outline" size={14} color="#059669" />
                  <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700' }}>09:00 - 10:00 AM</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Database Management Systems</Text>
              <Text style={styles.cardMutedText}>Instructor: Dr. Rajesh Sharma</Text>
              <Text style={styles.cardDimText}>📍 Room: Lecture Hall LT-101</Text>
            </View>

            {/* Homework Reminder */}
            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => { setActiveTab('academics'); setAcademicSubTab('assignments'); }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.badgeYellow}>PENDING TASK</Text>
                <Text style={{ fontSize: 12, color: '#64748B' }}>Due: Sep 28</Text>
              </View>
              <Text style={styles.cardTitle}>DBMS Normalization Problem Set</Text>
              <Text style={styles.cardMutedText}>Submit relational decomposition & dependency diagram</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB: PROFESSOR / TEACHER ATTENDANCE MARKER */}
        {activeTab === 'teacherAttendance' && (
          <View>
            <View style={[styles.heroCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[styles.heroPretitle, { color: '#059669' }]}>FACULTY ATTENDANCE MARKER</Text>
                  <Text style={[styles.heroTitle, { color: '#065F46' }]}>Dr. Rajesh Sharma</Text>
                </View>
                <View style={[styles.heroAvatar, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="people" size={22} color="#059669" />
                </View>
              </View>
              <Text style={[styles.heroProgram, { color: '#065F46' }]}>Professor & HOD, Computer Science & Engineering</Text>
              <Text style={[styles.heroDetails, { color: '#047857' }]}>Active Class: BCS501 — Database Management Systems</Text>
            </View>

            {teacherSessionSubmitted && (
              <View style={styles.successAlert}>
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#065F46', fontWeight: '800', fontSize: 13 }}>
                    Attendance Recorded Successfully!
                  </Text>
                  <Text style={{ color: '#047857', fontSize: 12 }}>
                    Saved {presentCount} Present and {absentCount} Absent in database.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardOverline}>LECTURE SESSION CONFIGURATION</Text>

              <View style={{ marginTop: 6, marginBottom: 10 }}>
                <Text style={styles.inputLabel}>Select Teaching Section</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  {['BCS501 - Section A', 'BCS501 - Section B'].map(cls => (
                    <TouchableOpacity
                      key={cls}
                      style={[styles.smallPillBtn, selectedClass === cls && styles.smallPillBtnActive]}
                      onPress={() => setSelectedClass(cls)}
                    >
                      <Text style={[styles.smallPillText, selectedClass === cls && styles.smallPillTextActive]}>
                        {cls}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={styles.inputLabel}>Lecture Topic Covered</Text>
                <TextInput
                  style={styles.lightTextInput}
                  value={lectureTopic}
                  onChangeText={setLectureTopic}
                  placeholder="e.g. Relational Normalization"
                />
              </View>

              {/* Bulk Action Controls */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#0F172A' }}>
                  Students ({presentCount} Present / {absentCount} Absent)
                </Text>

                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity style={styles.actionBtnGreen} onPress={() => markAll(true)}>
                    <Text style={styles.actionBtnGreenText}>✓ All Present</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnRed} onPress={() => markAll(false)}>
                    <Text style={styles.actionBtnRedText}>✗ All Absent</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.sectionHeader}>STUDENT ROLL CALL LIST (TAP TO TOGGLE)</Text>
            {attendanceList.map(st => (
              <TouchableOpacity
                key={st.id}
                style={[
                  styles.studentAttendanceCard,
                  { backgroundColor: st.present ? '#F0FDF4' : '#FEF2F2', borderColor: st.present ? '#BBF7D0' : '#FECACA' }
                ]}
                activeOpacity={0.8}
                onPress={() => toggleStudentAttendance(st.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.rollAvatar, { backgroundColor: st.present ? '#10B981' : '#EF4444' }]}>
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{st.name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.studentAttendanceName}>{st.name}</Text>
                    <Text style={styles.cardDimText}>Roll No: {st.roll}</Text>
                  </View>
                </View>

                <View style={[styles.statusPill, { backgroundColor: st.present ? '#DCFCE7' : '#FEE2E2' }]}>
                  <Text style={{ color: st.present ? '#15803D' : '#B91C1C', fontWeight: '800', fontSize: 12 }}>
                    {st.present ? '✓ PRESENT' : '✗ ABSENT'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.submitAttendanceBtn}
              activeOpacity={0.85}
              onPress={submitTeacherAttendance}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
              <Text style={styles.submitAttendanceBtnText}>
                Save & Submit Attendance Session
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB: ACADEMICS */}
        {activeTab === 'academics' && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {[
                { id: 'attendance', label: 'My Attendance' },
                { id: 'timetable', label: 'Timetable' },
                { id: 'subjects', label: 'Subjects' },
                { id: 'assignments', label: 'Assignments' },
                { id: 'results', label: 'Results' }
              ].map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.subPillLight, academicSubTab === t.id && styles.subPillLightActive]}
                  onPress={() => setAcademicSubTab(t.id as any)}
                >
                  <Text style={[styles.subPillLightText, academicSubTab === t.id && styles.subPillLightTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {academicSubTab === 'attendance' && (
              <View>
                <View style={[styles.card, { alignItems: 'center', paddingVertical: 20 }]}>
                  <Text style={styles.cardOverline}>AGGREGATE ATTENDANCE</Text>
                  <Text style={[styles.bigStatNumber, { color: '#059669', fontSize: 36 }]}>84%</Text>
                  <Text style={styles.cardMutedText}>16 of 18 Conducted Sessions Attended</Text>
                </View>

                <Text style={styles.sectionHeader}>SUBJECT-WISE BREAKDOWN</Text>
                {[
                  { code: 'BCS501', name: 'Database Management Systems', pct: 86, present: 6, total: 7 },
                  { code: 'BCS502', name: 'Design and Analysis of Algorithms', pct: 81, present: 5, total: 6 },
                  { code: 'BCS503', name: 'Operating Systems', pct: 88, present: 7, total: 8 },
                  { code: 'BCS504', name: 'Machine Learning Foundations', pct: 82, present: 5, total: 6 }
                ].map(item => (
                  <View key={item.code} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View>
                        <Text style={styles.badgeBlue}>{item.code}</Text>
                        <Text style={[styles.cardTitle, { marginTop: 4 }]}>{item.name}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#059669' }}>{item.pct}%</Text>
                        <Text style={styles.cardDimText}>{item.present} / {item.total} sessions</Text>
                      </View>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${item.pct}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {academicSubTab === 'timetable' && (
              <View>
                <Text style={styles.sectionHeader}>WEEKLY TIMETABLE</Text>
                {[
                  { time: '09:00 - 10:00 AM', code: 'BCS501', title: 'Database Management Systems', teacher: 'Dr. Rajesh Sharma', room: 'LT-101' },
                  { time: '10:00 - 11:00 AM', code: 'BCS502', title: 'Design and Analysis of Algorithms', teacher: 'Prof. Priya Verma', room: 'Computing Lab 3' },
                  { time: '11:15 - 12:15 PM', code: 'BCS503', title: 'Operating Systems', teacher: 'Dr. Amit Kumar', room: 'LT-102' }
                ].map((slot, i) => (
                  <View key={i} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#2563EB' }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.badgeBlue}>{slot.code}</Text>
                      <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700' }}>{slot.time}</Text>
                    </View>
                    <Text style={[styles.cardTitle, { marginTop: 4 }]}>{slot.title}</Text>
                    <Text style={styles.cardMutedText}>Faculty: {slot.teacher}</Text>
                    <Text style={styles.cardDimText}>📍 {slot.room}</Text>
                  </View>
                ))}
              </View>
            )}

            {academicSubTab === 'subjects' && (
              <View>
                <Text style={styles.sectionHeader}>REGISTERED SUBJECTS</Text>
                {[
                  { code: 'BCS501', name: 'Database Management Systems', credits: 4 },
                  { code: 'BCS502', name: 'Design and Analysis of Algorithms', credits: 4 },
                  { code: 'BCS503', name: 'Operating Systems', credits: 4 }
                ].map(sub => (
                  <View key={sub.code} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.badgeBlue}>{sub.code}</Text>
                      <Text style={styles.badgeGreen}>{sub.credits} Credits</Text>
                    </View>
                    <Text style={[styles.cardTitle, { marginTop: 4 }]}>{sub.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {academicSubTab === 'assignments' && (
              <View>
                <Text style={styles.sectionHeader}>COURSEWORK ASSIGNMENTS</Text>
                <View style={styles.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.badgeBlue}>BCS501</Text>
                    <Text style={assignmentSubmitted ? styles.badgeGreen : styles.badgeYellow}>
                      {assignmentSubmitted ? 'SUBMITTED' : 'PENDING'}
                    </Text>
                  </View>
                  <Text style={[styles.cardTitle, { marginTop: 6 }]}>DBMS Normalization Problem Set</Text>
                  <Text style={styles.cardMutedText}>Submit relational decomposition & dependency diagram (50 Marks).</Text>
                  
                  {assignmentSubmitted ? (
                    <View style={{ backgroundColor: '#ECFDF5', padding: 10, borderRadius: 8, marginTop: 10 }}>
                      <Text style={{ color: '#059669', fontWeight: '700', fontSize: 13 }}>✓ Homework Submitted</Text>
                      <Text style={{ color: '#047857', fontSize: 12, marginTop: 2 }}>Score: 47 / 50 (Grade: A+)</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.primaryBtn, { marginTop: 10 }]}
                      onPress={() => setAssignmentSubmitted(true)}
                    >
                      <Ionicons name="cloud-upload" size={16} color="#fff" />
                      <Text style={styles.primaryBtnText}>Submit Homework Document</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {academicSubTab === 'results' && (
              <View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Semester 4 Marksheet</Text>
                  <View style={{ flexDirection: 'row', gap: 12, marginVertical: 12 }}>
                    <View style={{ flex: 1, backgroundColor: '#EFF6FF', padding: 10, borderRadius: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#2563EB', fontWeight: '700' }}>SGPA</Text>
                      <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>8.75</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#ECFDF5', padding: 10, borderRadius: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#059669', fontWeight: '700' }}>CGPA</Text>
                      <Text style={{ fontSize: 24, fontWeight: '800', color: '#0F172A' }}>8.65</Text>
                    </View>
                  </View>
                  <Text style={styles.badgeGreen}>STATUS: PASSED (FIRST CLASS DISTINCTION)</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB: CAMPUS */}
        {activeTab === 'campus' && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {[
                { id: 'notices', label: 'Notices' },
                { id: 'events', label: 'Events' },
                { id: 'hostel', label: 'Hostel' },
                { id: 'mess', label: 'Mess Menu' },
                { id: 'fees', label: 'Fee Status' }
              ].map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.subPillLight, campusSubTab === t.id && styles.subPillLightActive]}
                  onPress={() => setCampusSubTab(t.id as any)}
                >
                  <Text style={[styles.subPillLightText, campusSubTab === t.id && styles.subPillLightTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {campusSubTab === 'notices' && (
              <View>
                {[
                  { title: 'Mid-Semester Examination Schedule', cat: 'EXAMINATION', date: 'Sep 20', content: 'Examinations will commence from Oct 12. Seating plans will be posted shortly.' },
                  { title: 'Smart India Hackathon 2026 Internal Round', cat: 'ACADEMIC', date: 'Sep 18', content: 'Form teams of 6 students with at least 1 female participant.' }
                ].map((n, i) => (
                  <View key={i} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.badgeBlue}>{n.cat}</Text>
                      <Text style={styles.cardDimText}>{n.date}</Text>
                    </View>
                    <Text style={[styles.cardTitle, { marginTop: 4 }]}>{n.title}</Text>
                    <Text style={styles.cardMutedText}>{n.content}</Text>
                  </View>
                ))}
              </View>
            )}

            {campusSubTab === 'events' && (
              <View>
                <View style={styles.card}>
                  <Text style={styles.badgeBlue}>CONCLAVE</Text>
                  <Text style={[styles.cardTitle, { marginTop: 4 }]}>VGI Technovate 2026 — Annual Tech Conclave</Text>
                  <Text style={styles.cardMutedText}>Hackathons, Robotics arena, and industry keynotes.</Text>
                  <Text style={[styles.cardDimText, { marginTop: 4 }]}>📅 Oct 25, 2026 • 📍 Main Auditorium</Text>

                  {eventRegistered ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      <Ionicons name="checkmark-circle" size={18} color="#059669" />
                      <Text style={{ color: '#059669', fontWeight: '700' }}>You are registered for this event!</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.primaryBtn, { marginTop: 10 }]}
                      onPress={() => setEventRegistered(true)}
                    >
                      <Text style={styles.primaryBtnText}>Register for Event</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {campusSubTab === 'hostel' && (
              <View>
                <View style={styles.card}>
                  <Text style={styles.cardOverline}>RESIDENCE DETAILS</Text>
                  <Text style={styles.cardTitle}>Aryabhata Boys Hostel — Room 204</Text>
                  <Text style={styles.cardMutedText}>Bed 1 • Wi-Fi Enabled • Attached Washroom</Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Submit Maintenance Ticket</Text>
                  <TextInput
                    style={styles.lightTextInput}
                    placeholder="Describe issue (e.g. leaking tap, tube light broken)..."
                    placeholderTextColor="#94A3B8"
                    value={complaintText}
                    onChangeText={setComplaintText}
                  />
                  <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} onPress={handleRaiseComplaint}>
                    <Text style={styles.primaryBtnText}>Raise Complaint</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {campusSubTab === 'mess' && (
              <View>
                {[
                  { day: 'Monday', b: 'Idli Sambar, Chutney, Tea', l: 'Rajma Masala, Steamed Rice, Roti', d: 'Paneer Butter Masala, Dal, Naan' },
                  { day: 'Friday', b: 'Masala Dosa, Sambar', l: 'Paneer Bhurji / Egg Curry, Rice', d: 'Special Biryani, Salan, Ice Cream' }
                ].map(m => (
                  <View key={m.day} style={styles.card}>
                    <Text style={[styles.cardTitle, { color: '#2563EB' }]}>{m.day}</Text>
                    <Text style={styles.cardDimText}>Breakfast: <Text style={styles.cardMutedText}>{m.b}</Text></Text>
                    <Text style={styles.cardDimText}>Lunch: <Text style={styles.cardMutedText}>{m.l}</Text></Text>
                    <Text style={styles.cardDimText}>Dinner: <Text style={styles.cardMutedText}>{m.d}</Text></Text>
                  </View>
                ))}
              </View>
            )}

            {campusSubTab === 'fees' && (
              <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={styles.cardOverline}>FEE ACCOUNT STATUS</Text>
                <Text style={[styles.bigStatNumber, { fontSize: 32, color: '#059669', marginVertical: 6 }]}>
                  ₹ 1,25,000
                </Text>
                <Text style={styles.badgeGreen}>✓ ALL DUES CLEARED (PAID)</Text>
              </View>
            )}
          </View>
        )}

        {/* TAB: PROFILE */}
        {activeTab === 'profile' && (
          <View>
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 20 }]}>
              <View style={[styles.bigAvatarLight, { backgroundColor: isTeacher ? '#10B981' : '#2563EB' }]}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 24 }}>{currentUser.name[0]}</Text>
              </View>
              <Text style={[styles.cardTitle, { fontSize: 18, marginTop: 8 }]}>{currentUser.name}</Text>
              <Text style={{ fontSize: 13, color: '#2563EB', fontWeight: '700' }}>
                {currentUser.role} • {isTeacher ? currentUser.employeeId : currentUser.rollNumber}
              </Text>
              <Text style={styles.cardDimText}>{currentUser.email}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardOverline}>SWITCH PERSONA</Text>
              <TouchableOpacity 
                style={[styles.switchBtnLight, !isTeacher && !isParent && !isAdmin && styles.switchBtnLightActive]} 
                onPress={() => handleQuickLogin('student')}
              >
                <Text style={styles.switchBtnLightText}>🎓 Student Mode (Aarav Patel)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.switchBtnLight, isTeacher && styles.switchBtnLightActive, { marginTop: 8 }]} 
                onPress={() => handleQuickLogin('teacher')}
              >
                <Text style={styles.switchBtnLightText}>👨‍🏫 Faculty Mode (Dr. Rajesh Sharma)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.switchBtnLight, isParent && styles.switchBtnLightActive, { marginTop: 8 }]} 
                onPress={() => handleQuickLogin('parent')}
              >
                <Text style={styles.switchBtnLightText}>👨‍👩‍👦 Parents Mode (Suresh Patel)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.switchBtnLight, isAdmin && styles.switchBtnLightActive, { marginTop: 8 }]} 
                onPress={() => handleQuickLogin('admin')}
              >
                <Text style={styles.switchBtnLightText}>🏛️ Administration Mode (Prof. S.K. Verma)</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={[styles.card, { borderColor: '#FECACA', backgroundColor: '#FEF2F2', alignItems: 'center' }]}
              onPress={handleLogout}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 14 }}>Sign Out of VGI CAMPUS</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavLight}>
        <TouchableOpacity 
          style={[styles.navBtnLight, activeTab === 'home' && styles.navBtnLightActive]} 
          onPress={() => setActiveTab('home')}
        >
          <Ionicons name="home" size={20} color={activeTab === 'home' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.navBtnLightLabel, activeTab === 'home' && styles.navBtnLightLabelActive]}>Home</Text>
        </TouchableOpacity>

        {/* PROMINENT ATTENDANCE ROLL CALL TAB */}
        <TouchableOpacity 
          style={[styles.navBtnLight, activeTab === 'teacherAttendance' && styles.navBtnLightActive]} 
          onPress={() => {
            setCurrentUser(DEMO_TEACHER);
            setActiveTab('teacherAttendance');
          }}
        >
          <Ionicons name="checkbox" size={20} color={activeTab === 'teacherAttendance' ? '#059669' : '#64748B'} />
          <Text style={[styles.navBtnLightLabel, activeTab === 'teacherAttendance' && { color: '#059669', fontWeight: '800' }]}>
            Mark Roll
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtnLight, activeTab === 'academics' && styles.navBtnLightActive]} 
          onPress={() => setActiveTab('academics')}
        >
          <Ionicons name="school" size={20} color={activeTab === 'academics' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.navBtnLightLabel, activeTab === 'academics' && styles.navBtnLightLabelActive]}>Academics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtnLight, activeTab === 'campus' && styles.navBtnLightActive]} 
          onPress={() => setActiveTab('campus')}
        >
          <Ionicons name="business" size={20} color={activeTab === 'campus' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.navBtnLightLabel, activeTab === 'campus' && styles.navBtnLightLabelActive]}>Campus</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtnLight, activeTab === 'profile' && styles.navBtnLightActive]} 
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons name="person" size={20} color={activeTab === 'profile' ? '#2563EB' : '#64748B'} />
          <Text style={[styles.navBtnLightLabel, activeTab === 'profile' && styles.navBtnLightLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  loginContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
  },
  loginLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  loginLogoText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22
  },
  loginAppTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    letterSpacing: -0.5
  },
  loginAppSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  loginBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    overflow: 'hidden'
  },
  loginCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    maxWidth: 360,
    width: '100%'
  },
  errorAlertText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600'
  },
  quickAccessTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 10
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  demoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  demoBtnTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12
  },
  headerTitle: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: -0.3
  },
  headerSubtitle: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700'
  },
  signOutHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  signOutHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626'
  },
  profileBadgeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  profileBadgeLetter: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13
  },
  contentScroll: {
    flex: 1,
    padding: 16
  },
  facultyAttendanceBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  facultyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  facultyBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A'
  },
  facultyBannerSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 1
  },
  heroCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  heroPretitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroProgram: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8
  },
  heroDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1
  },
  cardOverline: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5
  },
  bigStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2
  },
  cardMutedText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16
  },
  cardDimText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  badgeBlue: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden'
  },
  badgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden'
  },
  badgeYellow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFBEB',
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden'
  },
  subPillLight: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6
  },
  subPillLightActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  subPillLightText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600'
  },
  subPillLightTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13
  },
  lightTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    color: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    marginTop: 4
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  smallPillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  smallPillBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB'
  },
  smallPillText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  smallPillTextActive: {
    color: '#2563EB',
    fontWeight: '700'
  },
  actionBtnGreen: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  actionBtnGreenText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700'
  },
  actionBtnRed: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  actionBtnRedText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700'
  },
  studentAttendanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5
  },
  rollAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  studentAttendanceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  submitAttendanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  submitAttendanceBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  bigAvatarLight: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  switchBtnLight: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  switchBtnLightActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF'
  },
  switchBtnLightText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600'
  },
  bottomNavLight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5
  },
  navBtnLight: {
    alignItems: 'center',
    gap: 3,
    padding: 6
  },
  navBtnLightActive: {
    transform: [{ translateY: -2 }]
  },
  navBtnLightLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B'
  },
  navBtnLightLabelActive: {
    color: '#2563EB',
    fontWeight: '800'
  },

  // =========================================================================
  // ONBOARDING STYLES (Matching Screenshots 1-4)
  // =========================================================================
  onboardingSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  onboardingTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4
  },
  vgiMiniBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center'
  },
  vgiMiniBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  onboardingSkipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  onboardingSkipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600'
  },
  onboardingContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 28,
    paddingTop: 8
  },
  onboardingIllustrationWrap: {
    width: '100%',
    height: 340,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  onboardingIllustrationImg: {
    width: '100%',
    height: '100%',
    maxHeight: 330
  },
  onboardingTextWrap: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 12
  },
  onboardingTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.5
  },
  onboardingTitleBar: {
    width: 44,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FB7185',
    marginVertical: 10
  },
  onboardingDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    maxWidth: 320
  },
  onboardingActionWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8
  },
  getStartedBtn: {
    width: '88%',
    maxWidth: 320,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FF7356',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7356',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  getStartedBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1
  },
  nextSlideBtn: {
    width: '88%',
    maxWidth: 320,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  nextSlideBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5
  },
  onboardingDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14
  },
  onboardingDot: {
    height: 8,
    borderRadius: 4
  },
  onboardingDotActive: {
    width: 8,
    backgroundColor: '#0284C7'
  },
  onboardingDotInactive: {
    width: 8,
    backgroundColor: '#CBD5E1'
  },

  // =========================================================================
  // LOGIN SCREEN STYLES (Matching Screenshot 5)
  // =========================================================================
  loginSafeArea: {
    flex: 1,
    backgroundColor: '#FFFBF5'
  },
  loginScrollContainer: {
    flexGrow: 1,
    paddingBottom: 40
  },
  loginHeaderGlow: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5'
  },
  loginInstitutionBranding: {
    alignItems: 'center'
  },
  universityLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },
  crestCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    borderWidth: 1.5,
    borderColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center'
  },
  crestVerticalLine: {
    width: 1.5,
    height: 38,
    backgroundColor: '#EA580C'
  },
  univBrandMain: {
    fontSize: 17,
    fontWeight: '800',
    color: '#9A3412',
    letterSpacing: 0.8
  },
  univBrandSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#431407',
    letterSpacing: 0.5
  },
  taglineDoubleBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FDBA74',
    paddingVertical: 4,
    marginTop: 6,
    paddingHorizontal: 16
  },
  taglineText: {
    fontSize: 11,
    color: '#C2410C',
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  loginErrorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 10
  },
  loginErrorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1
  },
  roleTabsContainer: {
    marginTop: 18,
    paddingHorizontal: 20
  },
  roleTabsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
    marginBottom: 8
  },
  roleTabsScroll: {
    gap: 8,
    paddingBottom: 4
  },
  roleTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  roleTabPillActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C'
  },
  roleTabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  roleTabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  loginFormCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 52
  },
  inputIconCircle: {
    marginRight: 10
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%'
  },
  eyeToggleBtn: {
    padding: 6
  },
  signInGradientBtn: {
    marginTop: 18,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FF7356',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7356',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5
  },
  signInBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  signInBtnLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  loginActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14
  },
  actionOutlineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },
  forgotPassModal: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDBA74'
  },
  forgotPassTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412'
  },
  forgotPassDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6
  },
  forgotPassEmail: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
    marginVertical: 4
  },
  forgotPassSub: {
    fontSize: 11,
    color: '#64748B'
  },
  quickAccessSection: {
    marginHorizontal: 20,
    marginTop: 22
  },
  quickAccessHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  personaGrid: {
    gap: 8
  },
  personaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10
  },
  personaEmoji: {
    fontSize: 20
  },
  personaTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  personaSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  accreditationContainer: {
    marginTop: 28,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  accreditationHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center'
  },
  accreditationBannerCard: {
    width: '100%',
    height: 175,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  accreditationImg: {
    width: '100%',
    height: '100%'
  },
  accreditationBottomBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCD34D'
  },
  accreditationBottomText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center'
  },
  viewTourLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingVertical: 8
  },
  viewTourLinkText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },

  // =========================================================================
  // PARENT DASHBOARD STYLES
  // =========================================================================
  parentWardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  parentOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.6
  },
  parentWardName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2
  },
  parentWardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  parentAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    justifyContent: 'center',
    alignItems: 'center'
  },
  parentStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  parentStatBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center'
  },
  parentStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
  },
  parentStatValue: {
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 2
  },
  parentStatSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600'
  }
});
