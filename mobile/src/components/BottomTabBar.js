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
  } else if (userRole === 'HOD') {
    tabs = [
      { id: 'dashboard', label: 'HOD Hub', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'attendance_portal', label: 'Roll-Call', activeIcon: 'clipboard', inactiveIcon: 'clipboard-outline' },
      { id: 'happenings', label: 'Campus', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'rms', label: 'RMS', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' }
    ];
  } else if (userRole === 'TEACHER') {
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'attendance_portal', label: 'Roll-Call', activeIcon: 'clipboard', inactiveIcon: 'clipboard-outline' },
      { id: 'happenings', label: 'Campus', activeIcon: 'newspaper', inactiveIcon: 'newspaper-outline' },
      { id: 'rms', label: 'Support', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' }
    ];
  } else if (userRole === 'PARENT') {
    tabs = [
      { id: 'dashboard', label: 'Ward Progress', activeIcon: 'school', inactiveIcon: 'school-outline' },
      { id: 'outpass', label: 'Ward Outpass', activeIcon: 'exit', inactiveIcon: 'exit-outline' },
      { id: 'rms', label: 'Parent Support', activeIcon: 'chatbubbles', inactiveIcon: 'chatbubbles-outline' }
    ];
  } else {
    // Default Student Tabs
    tabs = [
      { id: 'dashboard', label: 'Dashboard', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
      { id: 'attendance', label: 'Attendance', activeIcon: 'calendar', inactiveIcon: 'calendar-outline' },
      { id: 'syllabus', label: 'Syllabus', activeIcon: 'book', inactiveIcon: 'book-outline' },
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
            {isActive ? <View style={styles.activeIndicator} /> : null}
            <Ionicons
              name={isActive ? tab.activeIcon : tab.inactiveIcon}
              size={22}
              color={isActive ? '#1E3A8A' : '#94A3B8'}
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
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  studentTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
    position: 'relative'
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    backgroundColor: '#1E3A8A',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2
  },
  studentTabLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2
  },
  studentTabLabelActive: {
    color: '#1E3A8A',
    fontWeight: '700'
  }
});
