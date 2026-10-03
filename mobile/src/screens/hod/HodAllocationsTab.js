import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import DropdownSelect from '../../components/DropdownSelect';
import {
  getAllTimetableSlots,
  scheduleClassSlot,
  deleteTimetableSlot,
  subscribeToTimetable
} from '../../services/academicSync';
import { apiRequest } from '../../api';

export default function HodAllocationsTab({ currentUser }) {
  const hodName = currentUser?.name || currentUser?.fullName || 'Dr. Rajesh Sharma (HOD)';
  const [targetDay, setTargetDay] = useState('Friday');
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM - 10:00 AM');
  const [selectedSubject, setSelectedSubject] = useState('Database Management Systems');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('BCS501');
  const [selectedTeacher, setSelectedTeacher] = useState(hodName);
  const [isHodTeaching, setIsHodTeaching] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('Room 302');
  const [allocSubmitting, setAllocSubmitting] = useState(false);
  const [allocSuccessMsg, setAllocSuccessMsg] = useState(null);

  // Active Timetable Slots
  const [slotsList, setSlotsList] = useState([]);
  const [filterDay, setFilterDay] = useState('All');

  useEffect(() => {
    loadSlots();
    const unsubscribe = subscribeToTimetable(() => loadSlots());
    return () => unsubscribe();
  }, []);

  const loadSlots = () => {
    const slots = getAllTimetableSlots();
    setSlotsList(slots);
  };

  const handleAssignToMyself = () => {
    setSelectedTeacher(hodName);
    setIsHodTeaching(true);
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    if (teacher.toLowerCase().includes('hod') || teacher === hodName) {
      setIsHodTeaching(true);
    } else {
      setIsHodTeaching(false);
    }
  };

  const handleSubjectSelect = (subName) => {
    setSelectedSubject(subName);
    if (subName.includes('Database')) setSelectedSubjectCode('BCS501');
    else if (subName.includes('Operating')) setSelectedSubjectCode('BCS502');
    else if (subName.includes('Machine')) setSelectedSubjectCode('BCS504');
    else if (subName.includes('Algorithms')) setSelectedSubjectCode('BCS503');
    else setSelectedSubjectCode('BCS505');
  };

  const handleScheduleSlot = async () => {
    setAllocSubmitting(true);
    setAllocSuccessMsg(null);

    const slotPayload = {
      day: targetDay,
      time: selectedTimeSlot,
      departmentCode: selectedCourse === 'BCA' ? 'CA' : 'CSE',
      course: selectedCourse,
      section: selectedSection,
      subject: selectedSubject,
      code: selectedSubjectCode,
      faculty: selectedTeacher,
      facultyId: isHodTeaching ? 'EMP001' : 'EMP002',
      isHodTeaching: isHodTeaching,
      room: selectedRoom,
      scheduledNotice: 'a day before'
    };

    try {
      await apiRequest('/timetable', {
        method: 'POST',
        body: JSON.stringify({
          dayOfWeek: targetDay.toUpperCase(),
          startTime: selectedTimeSlot.split(' - ')[0],
          endTime: selectedTimeSlot.split(' - ')[1],
          subjectId: selectedSubjectCode,
          teacherId: isHodTeaching ? 'emp001' : 'emp002',
          sectionId: selectedSection,
          roomName: selectedRoom
        })
      });
    } catch (e) {
      // Keep optimistic update
    }

    scheduleClassSlot(slotPayload);
    setAllocSubmitting(false);

    const whoTeaching = isHodTeaching ? 'You (HOD Self-Teaching)' : selectedTeacher;
    setAllocSuccessMsg(
      `✓ Class scheduled for ${targetDay} (${selectedTimeSlot}) in ${selectedSection}!\nTeacher: ${whoTeaching}\nRoom: ${selectedRoom}`
    );

    Alert.alert(
      'Timetable Published',
      `Class scheduled for ${targetDay} a day in advance!\n\n• Course: ${selectedCourse} (${selectedSection})\n• Subject: ${selectedSubject}\n• Teacher: ${whoTeaching}\n• Room: ${selectedRoom}\n\nDepartment students and the assigned teacher can now see this in their daily timetable.`
    );
  };

  const handleDeleteSlot = (slot) => {
    Alert.alert(
      'Cancel Class Slot',
      `Remove ${slot.subject} scheduled for ${slot.day} (${slot.time})?`,
      [
        { text: 'Keep Slot', style: 'cancel' },
        {
          text: 'Remove Slot',
          style: 'destructive',
          onPress: () => {
            deleteTimetableSlot(slot.id);
            Alert.alert('Slot Removed', 'Timetable updated for students and teachers.');
          }
        }
      ]
    );
  };

  const filteredSlots = slotsList.filter(s => {
    if (filterDay === 'All') return true;
    return s.day.toLowerCase() === filterDay.toLowerCase();
  });

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={18} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Daily Class Timetable & Allocations</Text>
            <Text style={styles.headerSub}>
              HOD can schedule class times daily (a day in advance). Department students & teachers see their timetable instantly.
            </Text>
          </View>
        </View>
      </View>

      {/* Scheduler Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formSectionTitle}>SCHEDULE CLASS TIMETABLE (DAILY / DAY BEFORE)</Text>

        {/* 1. Target Day */}
        <DropdownSelect
          label="1. TARGET DAY (SCHEDULE A DAY BEFORE)"
          value={targetDay}
          options={[
            { label: 'Tomorrow (Friday, 26 Sep)', value: 'Friday' },
            { label: 'Today (Thursday, 25 Sep)', value: 'Thursday' },
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Saturday', value: 'Saturday' }
          ]}
          onSelect={(val) => setTargetDay(val)}
          icon="calendar-outline"
        />

        {/* 2. Course & Section */}
        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="2. ACADEMIC COURSE"
            value={selectedCourse}
            options={[
              { label: 'B.Tech (Computer Science & Engineering)', value: 'B.Tech' },
              { label: 'BCA (Computer Applications)', value: 'BCA' },
              { label: 'BBA (Management Studies)', value: 'BBA' }
            ]}
            onSelect={(val) => setSelectedCourse(val)}
            icon="school-outline"
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="3. CLASS SECTION"
            value={selectedSection}
            options={[
              { label: 'Section A (Semester 5)', value: 'Section A' },
              { label: 'Section B (Semester 5)', value: 'Section B' },
              { label: 'Section C (Semester 5)', value: 'Section C' }
            ]}
            onSelect={(val) => setSelectedSection(val)}
            icon="people-outline"
          />
        </View>

        {/* 4. Time Slot */}
        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="4. CLASS TIME DURATION"
            value={selectedTimeSlot}
            options={[
              { label: '09:00 AM - 10:00 AM (Slot 1)', value: '09:00 AM - 10:00 AM' },
              { label: '10:00 AM - 11:00 AM (Slot 2)', value: '10:00 AM - 11:00 AM' },
              { label: '11:15 AM - 12:15 PM (Slot 3)', value: '11:15 AM - 12:15 PM' },
              { label: '12:15 PM - 01:15 PM (Slot 4)', value: '12:15 PM - 01:15 PM' },
              { label: '02:00 PM - 03:00 PM (Slot 5)', value: '02:00 PM - 03:00 PM' },
              { label: '03:00 PM - 04:00 PM (Slot 6)', value: '03:00 PM - 04:00 PM' },
              { label: '04:00 PM - 05:00 PM (Slot 7)', value: '04:00 PM - 05:00 PM' }
            ]}
            onSelect={(val) => setSelectedTimeSlot(val)}
            icon="alarm-outline"
          />
        </View>

        {/* 5. Subject */}
        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="5. SUBJECT / COURSE MODULE"
            value={selectedSubject}
            options={[
              { label: 'Database Management Systems (BCS501)', value: 'Database Management Systems' },
              { label: 'Operating Systems (BCS502)', value: 'Operating Systems' },
              { label: 'Machine Learning (BCS504)', value: 'Machine Learning' },
              { label: 'Design & Analysis of Algorithms (BCS503)', value: 'Design & Analysis of Algorithms' }
            ]}
            onSelect={handleSubjectSelect}
            icon="book-outline"
          />
        </View>

        {/* 6. Teacher Selector with HOD SELF-TEACHING BUTTON */}
        <View style={styles.teacherSectionWrap}>
          <View style={styles.teacherHeaderRow}>
            <Text style={styles.inputLabelText}>6. ASSIGN FACULTY MEMBER</Text>
            {/* HOD Self-Teaching One-Tap Button */}
            <TouchableOpacity
              style={[styles.selfTeachBtn, isHodTeaching && styles.selfTeachBtnActive]}
              onPress={handleAssignToMyself}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark" size={13} color={isHodTeaching ? COLORS.white : '#6D28D9'} />
              <Text style={[styles.selfTeachBtnText, isHodTeaching && styles.selfTeachBtnTextActive]}>
                Assign to Myself (HOD)
              </Text>
            </TouchableOpacity>
          </View>

          <DropdownSelect
            label="SELECT FACULTY"
            value={selectedTeacher}
            options={[
              { label: `${hodName} (HOD & Professor)`, value: hodName },
              { label: 'Prof. Priya Verma (Associate Professor)', value: 'Prof. Priya Verma' },
              { label: 'Prof. Amit Kumar (Assistant Professor)', value: 'Prof. Amit Kumar' },
              { label: 'Dr. Neha Kapoor (Professor)', value: 'Dr. Neha Kapoor' }
            ]}
            onSelect={handleTeacherSelect}
            icon="person-outline"
          />

          {isHodTeaching && (
            <View style={styles.hodSelfBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#047857" />
              <Text style={styles.hodSelfBadgeText}>
                HOD Self-Teaching Active: This class slot will directly appear in your Roll-Call screen.
              </Text>
            </View>
          )}
        </View>

        {/* 7. Room / Venue */}
        <View style={{ marginTop: 10 }}>
          <DropdownSelect
            label="7. CLASSROOM / COMPUTING LAB"
            value={selectedRoom}
            options={[
              { label: 'Room 302 (Block A)', value: 'Room 302' },
              { label: 'Lab 3 (GPU Supercomputing)', value: 'Lab 3 (GPU Supercomputing)' },
              { label: 'Room 105 (Block A)', value: 'Room 105' },
              { label: 'Computing Lab 2', value: 'Computing Lab 2' },
              { label: 'Main Auditorium Hall B', value: 'Main Auditorium Hall B' }
            ]}
            onSelect={(val) => setSelectedRoom(val)}
            icon="business-outline"
          />
        </View>

        {/* Publish Action Button */}
        <TouchableOpacity
          style={[styles.publishBtn, allocSubmitting && { opacity: 0.7 }]}
          onPress={handleScheduleSlot}
          disabled={allocSubmitting}
          activeOpacity={0.85}
        >
          {allocSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-done-circle" size={18} color={COLORS.white} />
              <Text style={styles.publishBtnText}>Set & Publish Timetable Slot</Text>
            </>
          )}
        </TouchableOpacity>

        {allocSuccessMsg && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.successBannerText}>{allocSuccessMsg}</Text>
          </View>
        )}
      </View>

      {/* Published Timetable Feed */}
      <View style={styles.slotsCard}>
        <View style={styles.slotsHeaderRow}>
          <View>
            <Text style={styles.slotsHeaderTitle}>ACTIVE DEPARTMENT TIMETABLE</Text>
            <Text style={styles.slotsHeaderSub}>
              Synced live to students and teachers ({filteredSlots.length} slots)
            </Text>
          </View>

          <View style={{ width: 140 }}>
            <DropdownSelect
              label="FILTER DAY"
              value={filterDay}
              options={[
                { label: 'All Days', value: 'All' },
                { label: 'Friday', value: 'Friday' },
                { label: 'Thursday', value: 'Thursday' },
                { label: 'Monday', value: 'Monday' }
              ]}
              onSelect={(val) => setFilterDay(val)}
              icon="filter-outline"
            />
          </View>
        </View>

        <View style={{ gap: 8, marginTop: 10 }}>
          {filteredSlots.length === 0 ? (
            <View style={styles.emptySlots}>
              <Ionicons name="calendar-outline" size={36} color="#CBD5E1" />
              <Text style={styles.emptySlotsText}>No classes scheduled for this day.</Text>
            </View>
          ) : (
            filteredSlots.map(slot => (
              <View key={slot.id} style={styles.slotItemCard}>
                <View style={styles.slotDayCol}>
                  <Text style={styles.slotDayName}>{slot.day.substring(0, 3)}</Text>
                  <Text style={styles.slotTimeText}>{slot.time.split(' - ')[0]}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.slotSubject}>{slot.subject}</Text>
                    {slot.isHodTeaching && (
                      <View style={[styles.crownBadge, { flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                        <Ionicons name="shield-checkmark" size={10} color="#6D28D9" />
                        <Text style={styles.crownBadgeText}>HOD Self</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.slotTeacher}>
                    Teacher: {slot.faculty}
                  </Text>
                  <Text style={styles.slotMeta}>
                    {slot.course} • {slot.section} • {slot.room}
                  </Text>
                  <Text style={styles.scheduledNoticeText}>{slot.dateScheduled}</Text>
                </View>

                <TouchableOpacity
                  style={styles.cancelSlotBtn}
                  onPress={() => handleDeleteSlot(slot)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={14} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24
  },
  headerCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    marginBottom: 10
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B21B6'
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  formSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  teacherSectionWrap: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  teacherHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  inputLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  selfTeachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  selfTeachBtnActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9'
  },
  selfTeachBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6D28D9'
  },
  selfTeachBtnTextActive: {
    color: COLORS.white
  },
  hodSelfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  hodSelfBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857',
    flex: 1
  },
  publishBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14
  },
  publishBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800'
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10
  },
  successBannerText: {
    fontSize: 11.5,
    color: '#065F46',
    fontWeight: '600',
    flex: 1,
    lineHeight: 16
  },
  slotsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotsHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5
  },
  slotsHeaderSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1
  },
  emptySlots: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6
  },
  emptySlotsText: {
    fontSize: 12,
    color: '#94A3B8'
  },
  slotItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10
  },
  slotDayCol: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  slotDayName: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  slotTimeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1
  },
  slotSubject: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B'
  },
  crownBadge: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD6FE'
  },
  crownBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7C3AED'
  },
  slotTeacher: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2
  },
  slotMeta: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1
  },
  scheduledNoticeText: {
    fontSize: 9.5,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2
  },
  cancelSlotBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2'
  }
});
