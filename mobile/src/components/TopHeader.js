import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imgVgiLogo = require('../../assets/logo.jpeg');

export default function TopHeader({
  title = 'Dashboard',
  badgeCount = 28,
  onOpenDrawer,
  onOpenNotifications,
  canGoBack = false,
  onGoBack
}) {
  return (
    <View style={styles.studentTopBar}>
      {/* Left: Back Arrow or Hamburger */}
      {canGoBack ? (
        <TouchableOpacity
          style={styles.studentHamburgerBtn}
          activeOpacity={0.7}
          onPress={onGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.studentHamburgerBtn}
          activeOpacity={0.7}
          onPress={onOpenDrawer}
        >
          <View style={styles.hamburgerLine1} />
          <View style={styles.hamburgerLine2} />
          <View style={styles.hamburgerLine3} />
        </TouchableOpacity>
      )}

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
        {Number(badgeCount) > 0 ? (
          <View style={styles.studentBellBadge}>
            <Text style={styles.studentBellBadgeText}>{badgeCount}</Text>
          </View>
        ) : null}
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
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#334155'
  },
  hamburgerLine2: {
    width: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginTop: 5
  },
  hamburgerLine3: {
    width: 20,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginTop: 5
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
    backgroundColor: '#1E3A8A',
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
