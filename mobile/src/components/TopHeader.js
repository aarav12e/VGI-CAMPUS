import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imgVgiLogo = require('../../assets/logo.jpeg');

export default function TopHeader({
  title = 'Dashboard',
  badgeCount = 28,
  onOpenDrawer,
  onOpenNotifications
}) {
  return (
    <View style={styles.studentTopBar}>
      {/* Left: Hamburger */}
      <TouchableOpacity
        style={styles.studentHamburgerBtn}
        activeOpacity={0.7}
        onPress={onOpenDrawer}
      >
        <View style={styles.hamburgerLine1} />
        <View style={styles.hamburgerLine2} />
        <View style={styles.hamburgerLine3} />
      </TouchableOpacity>

      {/* Center: Logo + Title — absolutely centered */}
      <View style={styles.centerTitleGroup} pointerEvents="none">
        <Image source={imgVgiLogo} style={styles.headerLogoImg} resizeMode="contain" />
        <Text style={styles.studentHeaderTitle} numberOfLines={1}>{title}</Text>
      </View>

      {/* Right: Bell + Badge */}
      <TouchableOpacity
        style={styles.studentBellBtn}
        activeOpacity={0.7}
        onPress={onOpenNotifications}
      >
        <Ionicons name="notifications-outline" size={24} color="#1E293B" />
        <View style={styles.studentBellBadge}>
          <Text style={styles.studentBellBadgeText}>{badgeCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  studentTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  studentHamburgerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  hamburgerLine1: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FA7268'
  },
  hamburgerLine2: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F97316',
    marginTop: 4
  },
  hamburgerLine3: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FBB040',
    marginTop: 4
  },
  centerTitleGroup: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7
  },
  headerLogoImg: {
    width: 26,
    height: 26,
    borderRadius: 13
  },
  studentHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3
  },
  studentBellBtn: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  studentBellBadge: {
    position: 'absolute',
    top: 4,
    right: 0,
    backgroundColor: '#FA7268',
    borderRadius: 9,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  studentBellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});
