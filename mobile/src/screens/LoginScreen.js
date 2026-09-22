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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imgVgiLogo = require('../../assets/logo.jpeg');

const ANDROID_STATUS_BAR = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 0;

export default function LoginScreen({
    onLogin,
    loginLoading,
    loginError
}) {
    const [selectedRole, setSelectedRole] = useState('STUDENT');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

    const handleRoleTab = (role) => {
        setSelectedRole(role);
    };

    const handleSubmit = () => {
        onLogin({
            role: selectedRole,
            email: loginEmail,
            password: loginPassword
        });
    };

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
                    {/* Top Branding Section */}
                    <View style={styles.loginHeaderGlow}>
                        <View style={styles.loginInstitutionBranding}>
                            <View style={styles.universityLogoRow}>
                                <View style={styles.crestCircle}>
                                    <Image source={imgVgiLogo} style={styles.vgiOfficialLogo} resizeMode="contain" />
                                </View>
                                <View style={styles.crestVerticalLine} />
                                <View>
                                    <Text style={styles.univBrandMain}>VISHVESHWARYA</Text>
                                    <Text style={styles.univBrandSub}>GROUP OF INSTITUTIONS</Text>
                                    <Text style={styles.univBrandCity}>GREATER NOIDA PHASE-II (NCR)</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Role Selection Tabs */}
                    <View style={styles.roleTabsWrapper}>
                        {[
                            { role: 'STUDENT', label: 'Student', icon: 'person-outline' },
                            { role: 'TEACHER', label: 'Faculty', icon: 'briefcase-outline' },
                            { role: 'PARENT', label: 'Parent', icon: 'people-outline' },
                            { role: 'ADMIN', label: 'Admin', icon: 'shield-checkmark-outline' }
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.role}
                                activeOpacity={0.8}
                                onPress={() => handleRoleTab(item.role)}
                                style={[
                                    styles.roleTabItem,
                                    selectedRole === item.role && styles.roleTabItemActive
                                ]}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={15}
                                    color={selectedRole === item.role ? '#EA580C' : '#64748B'}
                                />
                                <Text
                                    style={[
                                        styles.roleTabLabel,
                                        selectedRole === item.role && styles.roleTabLabelActive
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Login Card */}
                    <View style={styles.loginCard}>
                        <Text style={styles.loginCardTitle}>Campus ERP Sign In</Text>
                        <Text style={styles.loginCardSubtitle}>
                            Access your personalized {selectedRole.toLowerCase()} dashboard
                        </Text>

                        {/* Error Alert Banner */}
                        {loginError && (
                            <View style={styles.loginErrorBanner}>
                                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                                <Text style={styles.loginErrorBannerText}>{loginError}</Text>
                            </View>
                        )}

                        {/* Email / ID Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {selectedRole === 'STUDENT' ? 'Roll No / University ID' :
                                    selectedRole === 'TEACHER' ? 'Employee ID' :
                                        selectedRole === 'PARENT' ? 'Registered Mobile / ID' : 'Admin Username'}
                            </Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={
                                        selectedRole === 'STUDENT' ? 'e.g. 24DS001 or aarav.patel@vgi.ac.in' :
                                            selectedRole === 'TEACHER' ? 'e.g. EMP001 or rajesh.sharma@vgi.ac.in' :
                                                selectedRole === 'PARENT' ? 'e.g. PAR24001 or suresh.patel@vgi.ac.in' :
                                                    'e.g. ADM001 or admin@vgi.ac.in'
                                    }
                                    placeholderTextColor="#94A3B8"
                                    value={loginEmail}
                                    onChangeText={setLoginEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your security password"
                                    placeholderTextColor="#94A3B8"
                                    value={loginPassword}
                                    onChangeText={setLoginPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <View style={styles.forgotRow}>
                            <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginSubmitBtn, loginLoading && { opacity: 0.7 }]}
                            activeOpacity={0.88}
                            onPress={handleSubmit}
                            disabled={loginLoading}
                        >
                            <Text style={styles.loginSubmitBtnText}>
                                {loginLoading ? 'AUTHENTICATING...' : 'SIGN IN ➔'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Security Note */}
                    <View style={styles.loginSecurityFooter}>
                        <Ionicons name="lock-closed" size={13} color="#94A3B8" />
                        <Text style={styles.securityText}>
                            256-bit SSL Encrypted Campus ERP Portal • VGI v2.4
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Forgot Password Modal */}
            {forgotPasswordVisible && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalDialog}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Reset ERP Password</Text>
                            <TouchableOpacity onPress={() => setForgotPasswordVisible(false)}>
                                <Ionicons name="close-circle" size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalBodyText}>
                            Please enter your registered student/faculty email or contact the VGI ERP IT Helpdesk at room AB-102.
                        </Text>
                        <TextInput
                            style={[styles.textInput, styles.modalInput]}
                            placeholder="Enter your registered email"
                            placeholderTextColor="#94A3B8"
                        />
                        <TouchableOpacity
                            style={styles.modalSubmitBtn}
                            onPress={() => {
                                Alert.alert('Request Submitted', 'Password reset instructions have been sent to your registered email.');
                                setForgotPasswordVisible(false);
                            }}
                        >
                            <Text style={styles.modalSubmitBtnText}>SEND RECOVERY LINK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loginSafeArea: {
        flex: 1,
        backgroundColor: '#FFF7ED',
        paddingTop: ANDROID_STATUS_BAR
    },
    loginScrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 30
    },
    loginHeaderGlow: {
        marginBottom: 16
    },
    loginInstitutionBranding: {
        alignItems: 'center',
        paddingVertical: 12
    },
    universityLogoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    crestCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#FED7AA',
        overflow: 'hidden'
    },
    vgiOfficialLogo: {
        width: 46,
        height: 46
    },
    crestVerticalLine: {
        width: 1.5,
        height: 38,
        backgroundColor: '#FDBA74'
    },
    univBrandMain: {
        fontSize: 15,
        fontWeight: '900',
        color: '#9A3412',
        letterSpacing: 1
    },
    univBrandSub: {
        fontSize: 10,
        fontWeight: '800',
        color: '#EA580C',
        letterSpacing: 0.8
    },
    univBrandCity: {
        fontSize: 8.5,
        fontWeight: '600',
        color: '#78716C',
        letterSpacing: 0.3
    },
    roleTabsWrapper: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FED7AA',
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    roleTabItem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        paddingVertical: 8,
        borderRadius: 10
    },
    roleTabItemActive: {
        backgroundColor: '#FFEDD5'
    },
    roleTabLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B'
    },
    roleTabLabelActive: {
        color: '#EA580C',
        fontWeight: '800'
    },
    loginCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: '#FED7AA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4
    },
    loginCardTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4
    },
    loginCardSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16
    },
    loginErrorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FEE2E2',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FCA5A5',
        marginBottom: 14
    },
    loginErrorBannerText: {
        flex: 1,
        fontSize: 12,
        color: '#B91C1C',
        fontWeight: '600',
        lineHeight: 16
    },
    inputGroup: {
        marginBottom: 14
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12
    },
    inputIcon: {
        marginRight: 8
    },
    textInput: {
        flex: 1,
        height: 46,
        fontSize: 14,
        color: '#1E293B'
    },
    eyeBtn: {
        padding: 8
    },
    forgotRow: {
        alignItems: 'flex-end',
        marginBottom: 16
    },
    forgotText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EA580C'
    },
    loginSubmitBtn: {
        backgroundColor: '#EA580C',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3
    },
    loginSubmitBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5
    },
    loginSecurityFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 16
    },
    securityText: {
        fontSize: 11,
        color: '#94A3B8'
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B'
    },
    modalBodyText: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        marginBottom: 14
    },
    modalInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16
    },
    modalSubmitBtn: {
        backgroundColor: '#EA580C',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalSubmitBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5
    }
});
