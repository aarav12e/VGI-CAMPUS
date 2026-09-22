import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar({
  activeTab = 'dashboard',
  onSelectTab,
  userRole = 'STUDENT'
}) {
  let tabs = [];

  if (userRole === 'ADMIN') {
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'admissions', label: 'Admissions', activeIcon: 'people', inactiveIcon: 'people-outline' },
      { id: 'happenings', label: 'Campus', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'rms', label: 'Grievances', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' }
    ];
  } else if (userRole === 'TEACHER' || userRole === 'HOD') {
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'attendance_portal', label: 'Attendance', activeIcon: 'clipboard', inactiveIcon: 'clipboard-outline' },
      { id: 'happenings', label: 'Campus', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'rms', label: 'RMS', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' }
    ];
  } else if (userRole === 'PARENT') {
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'wardGrades', label: 'Ward Marks', activeIcon: 'school', inactiveIcon: 'school-outline' },
      { id: 'happenings', label: 'Campus', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'rms', label: 'Support', activeIcon: 'create', inactiveIcon: 'create-outline' }
    ];
  } else {
    // Default Student Tabs
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'attendance', label: 'Attendance', activeIcon: 'calendar', inactiveIcon: 'calendar-outline' },
      { id: 'happenings', label: 'Happenings', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'viewMarks', label: 'View Marks', activeIcon: 'list', inactiveIcon: 'list-outline' }
    ];
  }

  return (
    <View style={styles.studentBottomBar}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity 
            key={tab.id}
            style={styles.studentTabItem}
            onPress={() => onSelectTab(tab.id)}
          >
            <Ionicons 
              name={isActive ? tab.activeIcon : tab.inactiveIcon} 
              size={22} 
              color={isActive ? '#E07A2B' : '#64748B'} 
            />
            <Text style={[styles.studentTabLabel, isActive && styles.studentTabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  studentBottomBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  studentTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6
  },
  studentTabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3
  },
  studentTabLabelActive: {
    color: '#E07A2B',
    fontWeight: '700'
  }
});
