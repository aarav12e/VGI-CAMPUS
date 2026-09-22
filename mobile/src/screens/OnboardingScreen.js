import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ONBOARDING_SLIDES } from '../constants/onboardingData';

const imgVgiLogo = require('../../assets/logo.jpeg');

const ANDROID_STATUS_BAR = Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 40) : 0;

export default function OnboardingScreen({ onFinish }) {
    const [onboardingIndex, setOnboardingIndex] = useState(0);

    const currentSlide = ONBOARDING_SLIDES[onboardingIndex];
    const isLastSlide = onboardingIndex === ONBOARDING_SLIDES.length - 1;

    return (
        <SafeAreaView style={styles.onboardingSafeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Header: Skip & Brand */}
            <View style={styles.onboardingTopBar}>
                <View style={styles.vgiBrandingTopRow}>
                    <Image source={imgVgiLogo} style={styles.vgiLogoSmall} resizeMode="contain" />
                    <View style={styles.vgiMiniBadge}>
                        <Text style={styles.vgiMiniBadgeText}>VGI CAMPUS</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.onboardingSkipBtn}
                    activeOpacity={0.7}
                    onPress={onFinish}
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
                            onPress={onFinish}
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

const styles = StyleSheet.create({
    onboardingSafeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: ANDROID_STATUS_BAR
    },
    onboardingTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 10
    },
    vgiBrandingTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    vgiLogoSmall: {
        width: 32,
        height: 32,
        borderRadius: 16
    },
    vgiMiniBadge: {
        backgroundColor: '#EA580C',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8
    },
    vgiMiniBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.8
    },
    onboardingSkipBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    onboardingSkipText: {
        fontSize: 16,
        color: '#EA580C',
        fontWeight: '600'
    },
    onboardingContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 24
    },
    onboardingIllustrationWrap: {
        width: '100%',
        height: 310,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
        backgroundColor: '#FFFFFF'
    },
    onboardingIllustrationImg: {
        width: '100%',
        height: '100%'
    },
    onboardingTextWrap: {
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 20
    },
    onboardingTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 8
    },
    onboardingTitleBar: {
        width: 48,
        height: 3,
        backgroundColor: '#F97316',
        borderRadius: 2,
        marginBottom: 14
    },
    onboardingDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: '#64748B',
        textAlign: 'center'
    },
    onboardingActionWrap: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    nextSlideBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EA580C',
        paddingVertical: 14,
        borderRadius: 28,
        gap: 8,
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4
    },
    nextSlideBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5
    },
    getStartedBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EA580C',
        paddingVertical: 14,
        borderRadius: 28,
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    getStartedBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1
    },
    onboardingDotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    onboardingDot: {
        height: 8,
        borderRadius: 4
    },
    onboardingDotActive: {
        width: 24,
        backgroundColor: '#0284C7'
    },
    onboardingDotInactive: {
        width: 8,
        backgroundColor: '#E2E8F0'
    }
});
