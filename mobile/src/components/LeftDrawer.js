import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  DRAWER_ITEMS, 
  ADMIN_DRAWER_ITEMS, 
  HOD_DRAWER_ITEMS, 
  PARENT_DRAWER_ITEMS 
} from '../constants/drawerData';

import UserShadowAvatar from './UserShadowAvatar';

export default function LeftDrawer({
  visible,
  onClose,
  currentUser,
  onSelectTab,
  onOpenModal,
  onLogout
}) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!visible) return null;

  // Determine drawer menu based on role
  let roleItems = DRAWER_ITEMS;
  let gradientTheme = {
    headerBg: '#FA7268',
    subHeader: '#9A3412',
    accent: '#EA580C'
  };

  if (currentUser?.role === 'ADMIN') {
    roleItems = ADMIN_DRAWER_ITEMS;
    gradientTheme = {
      headerBg: '#4C1D95',
      subHeader: '#2E1065',
      accent: '#7C3AED'
    };
  } else if (currentUser?.role === 'TEACHER' || currentUser?.role === 'HOD') {
    roleItems = HOD_DRAWER_ITEMS;
    gradientTheme = {
      headerBg: '#065F46',
      subHeader: '#064E3B',
      accent: '#059669'
    };
  } else if (currentUser?.role === 'PARENT') {
    roleItems = PARENT_DRAWER_ITEMS;
    gradientTheme = {
      headerBg: '#1E40AF',
      subHeader: '#1E3A8A',
      accent: '#2563EB'
    };
  }

  const filteredItems = roleItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <View style={styles.drawerBackdrop}>
      {/* Dimmed backdrop area (tap to close) */}
      <TouchableOpacity 
        style={styles.drawerDismissArea}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sliding Sidebar Panel */}
      <View style={styles.drawerPanel}>
        {/* Header Card (Inspiration Image 2) */}
        <View style={[styles.drawerHeaderCard, { backgroundColor: gradientTheme.headerBg }]}>
          {/* Empty Shadow User Silhouette Avatar (Male / Female Aware) */}
          <UserShadowAvatar 
            user={currentUser} 
            size={68} 
            style={{ marginBottom: 10 }} 
          />

          {/* Identity */}
          <Text style={styles.drawerStudentName}>
            {currentUser?.name || 'Aarav Patel'}
          </Text>
          <Text style={styles.drawerStudentId}>
            {currentUser?.role === 'ADMIN' ? 'ADM001 • Dean & Registrar' :
             currentUser?.role === 'TEACHER' ? 'EMP001 • Professor & HOD' :
             currentUser?.role === 'PARENT' ? 'Guardian • Ward: Aarav Patel' :
             (currentUser?.rollNumber || currentUser?.userId || '24DS001')}
          </Text>
          <Text style={styles.drawerStudentCourse}>
            {currentUser?.role === 'ADMIN' ? 'University Central Administration' :
             currentUser?.role === 'TEACHER' ? 'Dept of Computer Science & Engg' :
             currentUser?.role === 'PARENT' ? 'B.Tech Data Science (CSE - Sem 5)' :
             (currentUser?.program || 'B.Tech Data Science (CSE)')}
          </Text>

          {/* Close 'X' Button on Top Right */}
          <TouchableOpacity 
            style={styles.drawerCloseBtn}
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Live Search Bar inside Menu (Image 2) */}
        <View style={styles.drawerSearchContainer}>
          <Ionicons name="search-outline" size={17} color="#94A3B8" />
          <TextInput 
            style={styles.drawerSearchInput}
            placeholder="Search menu features..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items Scroll List */}
        <ScrollView 
          style={styles.drawerItemsScroll}
          contentContainerStyle={styles.drawerItemsContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.drawerRowItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.tab) {
                  onSelectTab(item.tab);
                } else if (item.modal) {
                  onOpenModal(item.modal);
                }
              }}
            >
              <View style={styles.drawerRowIconCircle}>
                <Ionicons name={item.iconName} size={18} color="#64748B" />
              </View>
              <Text style={styles.drawerRowLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Sunset Gradient Logout Button (Image 2) */}
        <View style={styles.drawerLogoutFooter}>
          <TouchableOpacity 
            style={[styles.drawerLogoutBtn, { backgroundColor: gradientTheme.accent }]}
            activeOpacity={0.88}
            onPress={onLogout}
          >
            <Text style={styles.drawerLogoutBtnText}>LOGOUT</Text>
            <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 999,
    elevation: 20
  },
  drawerDismissArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  drawerPanel: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  drawerHeaderCard: {
    paddingTop: Platform.OS === 'android'
      ? (require('react-native').StatusBar.currentHeight || 24) + 16
      : 56,
    paddingBottom: 22,
    paddingHorizontal: 20,
    position: 'relative'
  },
  drawerAvatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  drawerAvatarImg: {
    width: '100%',
    height: '100%'
  },
  drawerStudentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2
  },
  drawerStudentId: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2
  },
  drawerStudentCourse: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500'
  },
  drawerCloseBtn: {
    position: 'absolute',
    top: Platform.OS === 'android'
      ? (require('react-native').StatusBar.currentHeight || 24) + 10
      : 50,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8
  },
  drawerSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B'
  },
  drawerItemsScroll: {
    flex: 1
  },
  drawerItemsContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16
  },
  drawerRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  drawerRowIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  drawerLogoutFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF'
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3
  },
  drawerLogoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1
  }
});
