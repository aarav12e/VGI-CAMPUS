import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles } from './modalStyles';
import { COLORS } from '../../theme/colors';
import { getAllTimetableSlots, subscribeToTimetable } from '../../services/academicSync';

export default function StudentModals({
  activeModal,
  rmsTickets,
  onAddRmsTicket,
  onClose,
  notifications: externalNotifications,
  onMarkAllNotificationsRead,
  onMarkOneNotificationRead,
  onClearAllNotifications,
  onDismissNotification,
  onResetNotifications
}) {
  const DEFAULT_NOTIFS = [
    { id: '1', title: 'Admit Cards for Mid-Term Examination ready for download', time: '10 mins ago', tag: 'Exams', isRead: false },
    { id: '2', title: 'TCS Placement Drive shortlisting round details updated', time: '1 hour ago', tag: 'Placement', isRead: false },
    { id: '3', title: 'Auditions for Annual Cultural Fest "Vibrance" this Friday', time: '3 hours ago', tag: 'Cultural', isRead: false },
    { id: '4', title: 'Operating Systems assignment submission deadline: Tomorrow', time: '5 hours ago', tag: 'Academics', isRead: false },
    { id: '5', title: 'Campus Wi-Fi maintenance completed in Aryabhata Hostel', time: 'Yesterday', tag: 'Hostel', isRead: false }
  ];
  const [localNotifs, setLocalNotifs] = useState(DEFAULT_NOTIFS);
  const [notifTab, setNotifTab] = useState('unread');
  const [notifFeedback, setNotifFeedback] = useState('');

  // Live Timetable State from Academic Sync (HOD allocations)
  const [liveTimetableSlots, setLiveTimetableSlots] = useState(() => getAllTimetableSlots());
  const [timetableDayFilter, setTimetableDayFilter] = useState('All');

  useEffect(() => {
    const unsub = subscribeToTimetable(() => {
      setLiveTimetableSlots(getAllTimetableSlots());
    });
    return () => unsub();
  }, []);

  const notifs = externalNotifications !== undefined ? externalNotifications : localNotifs;
  const unreadNotifs = notifs.filter(n => !n.isRead);
  const displayedNotifs = notifTab === 'unread' ? unreadNotifs : notifs;

  const handleMarkAllRead = () => {
    if (onMarkAllNotificationsRead) {
      onMarkAllNotificationsRead();
    }
    setLocalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setNotifTab('unread');
    setNotifFeedback('All notifications marked as read');
    setTimeout(() => setNotifFeedback(''), 2500);
  };

  const handleMarkOneRead = (id) => {
    if (onMarkOneNotificationRead) {
      onMarkOneNotificationRead(id);
    }
    setLocalNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAll = () => {
    if (onClearAllNotifications) {
      onClearAllNotifications();
    }
    setLocalNotifs([]);
    setNotifFeedback('All notifications cleared');
    setTimeout(() => setNotifFeedback(''), 2500);
  };

  const handleDismissOne = (id) => {
    if (onDismissNotification) {
      onDismissNotification(id);
    }
    setLocalNotifs(prev => prev.filter(n => n.id !== id));
  };

  const handleResetNotifs = () => {
    if (onResetNotifications) {
      onResetNotifications();
    }
    setLocalNotifs(DEFAULT_NOTIFS);
    setNotifFeedback('Restored demo notifications');
    setTimeout(() => setNotifFeedback(''), 2000);
  };

  // Notices Filter
  const [noticesFilter, setNoticesFilter] = useState('All');
  const [noticesSearch, setNoticesSearch] = useState('');

  // RMS Ticket Submission State
  const [newRmsCategory, setNewRmsCategory] = useState('Hostel & Mess');
  const [newRmsDesc, setNewRmsDesc] = useState('');
  const [rmsSuccessMsg, setRmsSuccessMsg] = useState(false);

  // Assignment Upload State
  const [uploadedAssignmentId, setUploadedAssignmentId] = useState(null);

  // Barcode Scanner State
  const [scannerSimulated, setScannerSimulated] = useState(false);

  // Password State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);
  const [passError, setPassError] = useState(null);

  const noticesList = [
    { id: '1', title: 'Schedule for Sessional Examination II released (Dec 2026)', category: 'Academic', date: '22 Sep 2026', author: 'Dean Academics' },
    { id: '2', title: 'TCS Digital & Ninja Campus Recruitment: Shortlisted Candidates List', category: 'Placement', date: '21 Sep 2026', author: 'T&P Cell' },
    { id: '3', title: 'Annual Techno-Cultural Fest "Vibrance 2026" Auditions & Volunteers', category: 'Events', date: '20 Sep 2026', author: 'Student Council' },
    { id: '4', title: 'Extension of Semester Fee Submission without Late Fine up to 30th Sept', category: 'Academic', date: '19 Sep 2026', author: 'Accounts Dept' },
    { id: '5', title: 'Hostel Night Curfew & Biometric Attendance Timing Update (09:00 PM)', category: 'Hostel', date: '18 Sep 2026', author: 'Chief Warden' },
    { id: '6', title: 'Workshop on Generative AI and Large Language Models by Google Experts', category: 'Academic', date: '17 Sep 2026', author: 'CSE Department' },
    { id: '7', title: 'Library Book Return & Digital Repository Access Renewal', category: 'Academic', date: '15 Sep 2026', author: 'Central Library' }
  ].filter(n => {
    if (noticesFilter !== 'All' && n.category !== noticesFilter) return false;
    if (noticesSearch.trim() && !n.title.toLowerCase().includes(noticesSearch.toLowerCase())) return false;
    return true;
  });

  const handlePasswordSubmit = () => {
    setPassError(null);
    if (!oldPass || !newPass || !confirmPass) {
      setPassError('Please fill in all 3 password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New Password and Confirm Password do not match.');
      return;
    }
    setPassChangeSuccess(true);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleCreateTicket = () => {
    if (!newRmsDesc.trim()) {
      Alert.alert('Required Field', 'Please provide grievance details before submitting.');
      return;
    }
    if (onAddRmsTicket) {
      onAddRmsTicket({
        category: newRmsCategory,
        description: newRmsDesc.trim()
      });
    }
    setRmsSuccessMsg(true);
    setNewRmsDesc('');
    setTimeout(() => setRmsSuccessMsg(false), 3500);
  };

  return (
    <View>
      {/* 1. NOTIFICATIONS */}
      {activeModal === 'notifications' && (
        <View>
          {Boolean(notifFeedback) && (
            <View style={styles.notifBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.notifBannerText}>{notifFeedback}</Text>
            </View>
          )}

          <View style={styles.notificationFilterRow}>
            <View style={styles.notifPillGroup}>
              <TouchableOpacity
                style={[styles.notifTabPill, notifTab === 'unread' && styles.notifTabPillActive]}
                onPress={() => setNotifTab('unread')}
                activeOpacity={0.7}
              >
                <Text style={[styles.notifTabPillText, notifTab === 'unread' && styles.notifTabPillTextActive]}>
                  Unread ({unreadNotifs.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.notifTabPill, notifTab === 'all' && styles.notifTabPillActive]}
                onPress={() => setNotifTab('all')}
                activeOpacity={0.7}
              >
                <Text style={[styles.notifTabPillText, notifTab === 'all' && styles.notifTabPillTextActive]}>
                  All ({notifs.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {unreadNotifs.length > 0 && (
                <TouchableOpacity
                  style={styles.markReadActionBtn}
                  activeOpacity={0.7}
                  onPress={handleMarkAllRead}
                  accessibilityRole="button"
                >
                  <Ionicons name="checkmark-done" size={15} color="#1D4ED8" />
                  <Text style={styles.markReadLink}>Mark all as read</Text>
                </TouchableOpacity>
              )}
              {notifs.length > 0 && (
                <TouchableOpacity
                  style={styles.clearAllBtn}
                  activeOpacity={0.7}
                  onPress={handleClearAll}
                  accessibilityRole="button"
                >
                  <Ionicons name="trash-outline" size={13} color="#DC2626" />
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {displayedNotifs.length === 0 ? (
            <View style={styles.notifEmptyCard}>
              <View style={styles.notifEmptyCircle}>
                <Ionicons name="checkmark-done" size={32} color="#10B981" />
              </View>
              <Text style={styles.notifEmptyTitle}>All Caught Up!</Text>
              <Text style={styles.notifEmptySub}>
                {notifTab === 'unread'
                  ? 'No unread notifications. All messages marked as read.'
                  : 'No notifications at this time.'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                {notifTab === 'unread' && notifs.length > 0 && (
                  <TouchableOpacity
                    style={styles.notifViewAllBtn}
                    onPress={() => setNotifTab('all')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.notifViewAllBtnText}>View All History ({notifs.length})</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.notifResetBtn}
                  onPress={handleResetNotifs}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh-outline" size={14} color="#1D4ED8" />
                  <Text style={styles.notifResetBtnText}>Restore</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            displayedNotifs.map(n => (
              <TouchableOpacity
                key={n.id}
                style={[
                  styles.notificationItem,
                  n.isRead && styles.notificationItemRead
                ]}
                activeOpacity={0.8}
                onPress={() => handleMarkOneRead(n.id)}
              >
                <View
                  style={[
                    styles.notificationDot,
                    n.isRead && styles.notificationDotRead
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      n.isRead && styles.notificationTitleRead
                    ]}
                  >
                    {n.title}
                  </Text>
                  <View style={styles.notificationMetaRow}>
                    <Text style={styles.notificationTime}>{n.time}</Text>
                    <Text style={styles.notificationTag}>{n.tag}</Text>
                    {n.isRead ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Ionicons name="checkmark-circle" size={12} color="#059669" />
                        <Text style={styles.readStatusText}>Read</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.singleMarkReadBtn}
                        onPress={() => handleMarkOneRead(n.id)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="checkmark" size={11} color="#1D4ED8" />
                        <Text style={styles.singleMarkReadText}>Mark read</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Dismiss button to remove this specific notification */}
                <TouchableOpacity
                  style={styles.notifDismissBtn}
                  activeOpacity={0.6}
                  onPress={() => handleDismissOne(n.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* 2. ANNOUNCEMENTS */}
      {activeModal === 'announce' && (
        <View>
          <TextInput
            style={modalStyles.inputBox}
            placeholder="Search circulars by keyword..."
            placeholderTextColor={COLORS.textLight}
            value={noticesSearch}
            onChangeText={setNoticesSearch}
          />
          <View style={modalStyles.filterPillsRow}>
            {['All', 'Academic', 'Placement', 'Hostel', 'Events'].map(cat => (
              <TouchableOpacity
                key={cat}
                style={[modalStyles.smallPill, noticesFilter === cat && modalStyles.smallPillActive]}
                onPress={() => setNoticesFilter(cat)}
              >
                <Text style={[modalStyles.smallPillText, noticesFilter === cat && modalStyles.smallPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {noticesList.map(n => (
            <View key={n.id} style={styles.circularCard}>
              <View style={styles.circularCardHeader}>
                <Text style={styles.circularBadge}>{n.category}</Text>
                <Text style={styles.circularDate}>{n.date}</Text>
              </View>
              <Text style={styles.circularTitle}>{n.title}</Text>
              <Text style={styles.circularAuthor}>Issued by: {n.author}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 3. EDU REVOLUTION */}
      {activeModal === 'edu_revolution' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Access digital learning paths, recorded faculty lectures, and NPTEL certs.
          </Text>
          {[
            { code: 'BCS501', title: 'Database Management Systems', prof: 'Dr. Rajesh Sharma', modules: '12 / 14 Completed', pct: 85 },
            { code: 'BCS502', title: 'Operating Systems & Concurrency', prof: 'Prof. Amit Kumar', modules: '10 / 14 Completed', pct: 71 },
            { code: 'BCS503', title: 'Design & Analysis of Algorithms', prof: 'Prof. Priya Verma', modules: '9 / 14 Completed', pct: 64 },
            { code: 'BCS504', title: 'Machine Learning Foundations', prof: 'Prof. Priya Verma', modules: '13 / 14 Completed', pct: 92 }
          ].map((course, i) => (
            <View key={i} style={styles.eduCourseCard}>
              <View style={styles.eduCourseHeader}>
                <Text style={styles.eduCourseCode}>{course.code}</Text>
                <Text style={styles.eduCoursePct}>{course.pct}%</Text>
              </View>
              <Text style={styles.eduCourseTitle}>{course.title}</Text>
              <Text style={styles.eduCourseProf}>{course.prof} • {course.modules}</Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${course.pct}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 4. FEE STATEMENT */}
      {activeModal === 'fee_statement' && (
        <View>
          <View style={styles.feeSummaryCard}>
            <Text style={styles.feeSummaryLabel}>Academic Year 2026-27 (Sem 5)</Text>
            <Text style={styles.feeSummaryAmount}>₹ 1,25,000</Text>
            <View style={styles.feePaidBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.feePaidText}>Fully Paid & Cleared</Text>
            </View>
          </View>
          {[
            { title: 'Semester 5 Tuition Fee', receipt: 'REC-2026-8812', amount: '₹ 85,000', date: '12 Jul 2026' },
            { title: 'Aryabhata Hostel & Mess Charge', receipt: 'REC-2026-8813', amount: '₹ 35,000', date: '12 Jul 2026' },
            { title: 'Examination & University Lab Fee', receipt: 'REC-2026-8904', amount: '₹ 5,000', date: '15 Jul 2026' }
          ].map((item, idx) => (
            <View key={idx} style={styles.ledgerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.ledgerTitle}>{item.title}</Text>
                <Text style={styles.ledgerReceipt}>Receipt: {item.receipt} • {item.date}</Text>
              </View>
              <Text style={styles.ledgerAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 5. ATTENDANCE DETAILS */}
      {activeModal === 'attendance' && (
        <View>
          <View style={styles.attendanceHeroCard}>
            <Text style={styles.attendanceHeroLabel}>COMBINED OVERALL ATTENDANCE</Text>
            <Text style={styles.attendanceHeroValue}>95.0%</Text>
            <Text style={styles.attendanceHeroStatus}>Eligible for End-Term University Exams (Safe &gt; 75%)</Text>
          </View>
          {[
            { code: 'BCS501', name: 'Database Management Systems', attended: 34, total: 36, pct: 94 },
            { code: 'BCS502', name: 'Operating Systems', attended: 32, total: 34, pct: 94 },
            { code: 'BCS503', name: 'Design & Analysis of Algorithms', attended: 38, total: 40, pct: 95 },
            { code: 'BCS504', name: 'Machine Learning', attended: 37, total: 38, pct: 97 }
          ].map((s, i) => (
            <View key={i} style={styles.subjectRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subjectName}>{s.name} ({s.code})</Text>
                <Text style={styles.subjectMeta}>{s.attended} Attended / {s.total} Lectures Delivered</Text>
              </View>
              <Text style={styles.subjectPct}>{s.pct}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* 6. ASSIGNMENT */}
      {activeModal === 'assignment' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Active course assignments. Submit solutions directly to ERP portal.
          </Text>
          {[
            { id: '1', title: 'SQL Triggers & Stored Procedures', sub: 'DBMS (BCS501)', due: '25 Sep 2026', status: 'Pending' },
            { id: '2', title: 'CPU Scheduling Simulation in Python', sub: 'OS (BCS502)', due: '28 Sep 2026', status: 'Pending' },
            { id: '3', title: 'Backpropagation on MNIST Dataset', sub: 'ML (BCS504)', due: '30 Sep 2026', status: 'Pending' }
          ].map(a => {
            const isUploaded = uploadedAssignmentId === a.id;
            return (
              <View key={a.id} style={styles.assignmentCard}>
                <View style={styles.assignmentHeader}>
                  <Text style={styles.assignmentSub}>{a.sub}</Text>
                  <Text style={[styles.assignmentDue, isUploaded && { color: COLORS.success }]}>
                    {isUploaded ? 'SUBMITTED' : `Due: ${a.due}`}
                  </Text>
                </View>
                <Text style={styles.assignmentTitle}>{a.title}</Text>
                <TouchableOpacity
                  style={[styles.uploadBtn, isUploaded && styles.uploadBtnDone]}
                  onPress={() => setUploadedAssignmentId(a.id)}
                >
                  <Ionicons name={isUploaded ? 'checkmark-done' : 'cloud-upload-outline'} size={15} color={isUploaded ? COLORS.success : COLORS.primary} />
                  <Text style={[styles.uploadBtnText, isUploaded && { color: COLORS.success }]}>
                    {isUploaded ? 'Solution Uploaded (v1.0)' : 'Upload Solution (PDF)'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* 7. RESULTS & GRADE CARD */}
      {activeModal === 'results' && (
        <View>
          <View style={styles.resultCgpaCard}>
            <Text style={styles.resultCgpaLabel}>CUMULATIVE GRADE POINT AVERAGE</Text>
            <Text style={styles.resultCgpaValue}>7.78 CGPA</Text>
            <Text style={styles.resultCgpaMeta}>Total Earned Credits: 92 • Division: First Class with Distinction</Text>
          </View>
          {[
            { sem: 'Semester 4', sgpa: '8.12', credits: '24 Credits', status: 'Passed' },
            { sem: 'Semester 3', sgpa: '7.85', credits: '24 Credits', status: 'Passed' },
            { sem: 'Semester 2', sgpa: '7.60', credits: '22 Credits', status: 'Passed' },
            { sem: 'Semester 1', sgpa: '7.55', credits: '22 Credits', status: 'Passed' }
          ].map((r, i) => (
            <View key={i} style={styles.gradeRow}>
              <View>
                <Text style={styles.gradeSem}>{r.sem}</Text>
                <Text style={styles.gradeCredits}>{r.credits} • {r.status}</Text>
              </View>
              <Text style={styles.gradeSgpa}>{r.sgpa} SGPA</Text>
            </View>
          ))}
        </View>
      )}

      {/* 8. EXAMS */}
      {activeModal === 'exams' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Upcoming End-Semester & Mid-Term Date Sheet. Admit Card downloadable.
          </Text>
          {[
            { date: '12 Oct 2026', time: '10:00 AM - 01:00 PM', code: 'BCS501', subject: 'Database Management Systems', hall: 'Hall B (Desk 42)' },
            { date: '15 Oct 2026', time: '10:00 AM - 01:00 PM', code: 'BCS502', subject: 'Operating Systems', hall: 'Hall B (Desk 42)' },
            { date: '18 Oct 2026', time: '10:00 AM - 01:00 PM', code: 'BCS503', subject: 'Design & Analysis of Algorithms', hall: 'Hall A (Desk 18)' },
            { date: '21 Oct 2026', time: '10:00 AM - 01:00 PM', code: 'BCS504', subject: 'Machine Learning', hall: 'Hall A (Desk 18)' }
          ].map((ex, i) => (
            <View key={i} style={styles.examCard}>
              <View style={styles.examHeader}>
                <Text style={styles.examDate}>{ex.date} • {ex.time}</Text>
                <Text style={styles.examCode}>{ex.code}</Text>
              </View>
              <Text style={styles.examSubject}>{ex.subject}</Text>
              <Text style={styles.examHall}>Seating Allocation: {ex.hall}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={modalStyles.outlineActionBtn}
            onPress={() => Alert.alert('Admit Card Download', 'Downloading official VGI Exam Admit Card (PDF with QR verification).')}
          >
            <Ionicons name="download-outline" size={16} color={COLORS.primary} />
            <Text style={modalStyles.outlineActionBtnText}>Download Official Admit Card</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 9. RMS GRIEVANCE */}
      {activeModal === 'rms_status' && (
        <View>
          {rmsSuccessMsg && (
            <View style={modalStyles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={modalStyles.successBannerText}>Grievance ticket created successfully!</Text>
            </View>
          )}

          <Text style={modalStyles.formSectionTitle}>LOG NEW GRIEVANCE / RMS TICKET</Text>
          <Text style={modalStyles.inputLabel}>CATEGORY</Text>
          <View style={modalStyles.filterPillsRow}>
            {['Hostel & Mess', 'Academic Issue', 'Library & Books', 'IT & Wi-Fi'].map(c => (
              <TouchableOpacity
                key={c}
                style={[modalStyles.smallPill, newRmsCategory === c && modalStyles.smallPillActive]}
                onPress={() => setNewRmsCategory(c)}
              >
                <Text style={[modalStyles.smallPillText, newRmsCategory === c && modalStyles.smallPillTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={modalStyles.inputLabel}>DESCRIPTION</Text>
          <TextInput
            style={[modalStyles.inputBox, { height: 75, textAlignVertical: 'top' }]}
            placeholder="Describe your issue with room, faculty, or facility..."
            placeholderTextColor={COLORS.textLight}
            multiline
            value={newRmsDesc}
            onChangeText={setNewRmsDesc}
          />
          <TouchableOpacity style={modalStyles.submitActionBtn} onPress={handleCreateTicket}>
            <Text style={modalStyles.submitActionBtnText}>Submit Grievance to UMS</Text>
          </TouchableOpacity>

          <Text style={[modalStyles.formSectionTitle, { marginTop: 18 }]}>ACTIVE TICKETS ({(rmsTickets || []).length})</Text>
          {(rmsTickets || []).map(t => (
            <View key={t.id} style={styles.rmsCard}>
              <View style={styles.rmsCardHeader}>
                <Text style={styles.rmsCat}>{t.category}</Text>
                <View style={styles.rmsStatusPill}>
                  <Text style={styles.rmsStatusText}>{t.status}</Text>
                </View>
              </View>
              <Text style={styles.rmsDesc}>{t.description}</Text>
              <Text style={styles.rmsDate}>Logged on: {t.date}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 10. EVENTS & FEST */}
      {activeModal === 'events' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Upcoming campus cultural, techno, and sports events.
          </Text>
          {[
            { name: 'Vibrance 2026 - Annual Techno Fest', dates: '14 - 16 Nov 2026', venue: 'VGI Central Amphitheatre', tag: 'Cultural' },
            { name: 'Google Developer Hackathon (AI / ML)', dates: '28 Oct 2026', venue: 'Academic Block A Auditorium', tag: 'Technical' },
            { name: 'Inter-College Cricket & Football Cup', dates: '05 - 08 Nov 2026', venue: 'VGI Sports Complex', tag: 'Sports' }
          ].map((ev, i) => (
            <View key={i} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{ev.name}</Text>
                <View style={styles.eventTagBadge}>
                  <Text style={styles.eventTagText}>{ev.tag}</Text>
                </View>
              </View>
              <Text style={styles.eventMeta}>Dates: {ev.dates}</Text>
              <Text style={styles.eventMeta}>Venue: {ev.venue}</Text>
              <TouchableOpacity
                style={styles.eventRegisterBtn}
                onPress={() => Alert.alert('Registered', `You are registered for ${ev.name}. Details sent to your student email.`)}
              >
                <Ionicons name="ticket-outline" size={14} color={COLORS.primary} />
                <Text style={styles.eventRegisterText}>Register as Participant / Volunteer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 11. PLACEMENT SCANNER */}
      {activeModal === 'placement_scanner' && (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View style={styles.qrContainer}>
            <Ionicons name="qr-code-outline" size={140} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.qrLabel}>T&P Drive Quick Pass: Aarav Patel (24DS001)</Text>
          <Text style={styles.qrSub}>Show this QR at recruitment desks for biometric attendance verification.</Text>
          <TouchableOpacity
            style={modalStyles.submitActionBtn}
            onPress={() => {
              setScannerSimulated(true);
              Alert.alert('Scanner Activated', 'Candidate QR Scanned: Aarav Patel • Shortlisted for TCS Digital Round 2.');
            }}
          >
            <Ionicons name="scan" size={18} color={COLORS.white} />
            <Text style={modalStyles.submitActionBtnText}>
              {scannerSimulated ? 'Verified for Today’s Drive' : 'Scan Drive Checkpoint'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 12. TRANSPORT */}
      {activeModal === 'transport' && (
        <View>
          <View style={styles.transportCard}>
            <Text style={styles.transportRoute}>Bus Route 14: Meerut City to VGI Campus</Text>
            <Text style={styles.transportSub}>Bus No: UP 15 BT 4421 • Driver: Ramesh Singh (+91 98765 11223)</Text>
            <Text style={styles.transportSub}>Morning Pickup: 07:45 AM (Begum Bridge Circle)</Text>
            <View style={styles.transportLiveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.transportLiveText}>Live GPS Tracking: Near Hapur Bypass (ETA 12 mins)</Text>
            </View>
          </View>
        </View>
      )}

      {/* 13. CHANGE PASSWORD */}
      {activeModal === 'password' && (
        <View>
          {passChangeSuccess && (
            <View style={modalStyles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={modalStyles.successBannerText}>Password changed successfully!</Text>
            </View>
          )}
          {passError && (
            <View style={[modalStyles.successBanner, { backgroundColor: COLORS.dangerBg, borderColor: COLORS.dangerBorder }]}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={[modalStyles.successBannerText, { color: COLORS.danger }]}>{passError}</Text>
            </View>
          )}
          <Text style={modalStyles.inputLabel}>CURRENT PASSWORD</Text>
          <TextInput
            style={modalStyles.inputBox}
            placeholder="Enter current password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry
            value={oldPass}
            onChangeText={setOldPass}
          />
          <Text style={modalStyles.inputLabel}>NEW PASSWORD</Text>
          <TextInput
            style={modalStyles.inputBox}
            placeholder="Enter new password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry
            value={newPass}
            onChangeText={setNewPass}
          />
          <Text style={modalStyles.inputLabel}>CONFIRM NEW PASSWORD</Text>
          <TextInput
            style={modalStyles.inputBox}
            placeholder="Re-type new password"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
          <TouchableOpacity style={modalStyles.submitActionBtn} onPress={handlePasswordSubmit}>
            <Text style={modalStyles.submitActionBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 14. HOSTEL & MESS */}
      {activeModal === 'hostel_mess' && (
        <View>
          <View style={styles.hostelCard}>
            <Text style={styles.hostelTitle}>Aryabhata Boys Hostel • Room 204</Text>
            <Text style={styles.hostelSub}>Warden: Dr. Vinod Rathore (+91 98765 43210)</Text>
            <Text style={styles.hostelSub}>Gate Closing Time: 09:00 PM (Biometric Required)</Text>
          </View>
          <Text style={modalStyles.formSectionTitle}>TODAY'S MESS MENU (VEG & SPECIAL)</Text>
          {[
            { meal: 'Breakfast (07:30 - 09:00 AM)', items: 'Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs, Tea/Coffee' },
            { meal: 'Lunch (12:30 - 02:00 PM)', items: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Tandoori Roti, Salad' },
            { meal: 'Evening Snacks (05:00 - 06:00 PM)', items: 'Samosa, Mint Chutney, Masala Chai' },
            { meal: 'Dinner (08:00 - 09:30 PM)', items: 'Kadhai Mushroom, Rajma, Steamed Rice, Gulab Jamun' }
          ].map((m, i) => (
            <View key={i} style={styles.messRow}>
              <Text style={styles.messMealTitle}>{m.meal}</Text>
              <Text style={styles.messMealItems}>{m.items}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 15. TIMETABLE */}
      {activeModal === 'timetable' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Weekly Academic Routine & Classroom Allocation (Set daily a day before by HOD).
          </Text>

          {/* Day Filter Chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => {
              const isSel = timetableDayFilter === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.ttDayChip, isSel && styles.ttDayChipActive]}
                  onPress={() => setTimetableDayFilter(d)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.ttDayChipText, isSel && styles.ttDayChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {(() => {
            const slots = (timetableDayFilter === 'All'
              ? liveTimetableSlots
              : liveTimetableSlots.filter(s => s.day?.toLowerCase() === timetableDayFilter.toLowerCase())
            );

            if (!slots || slots.length === 0) {
              return (
                <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                  <Ionicons name="calendar-outline" size={32} color="#94A3B8" />
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#64748B', marginTop: 8 }}>
                    No Scheduled Classes
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3 }}>
                    No lecture slots published for {timetableDayFilter}.
                  </Text>
                </View>
              );
            }

            return slots.map((slot, i) => (
              <View key={slot.id || i} style={styles.timetableRow}>
                <View style={styles.timeCol}>
                  <Text style={styles.timeSlotLabel}>{slot.day ? slot.day.substring(0, 3) : `Period ${i + 1}`}</Text>
                  <Text style={styles.timeSlotHours}>{slot.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text style={styles.slotSubject}>{slot.subject} ({slot.code})</Text>
                    {slot.isHodTeaching && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EDE9FE', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                        <Ionicons name="shield-checkmark" size={10} color="#6D28D9" />
                        <Text style={{ fontSize: 9.5, fontWeight: '800', color: '#6D28D9' }}>HOD Teaching</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.slotFaculty}>
                    Faculty: {slot.faculty} • {slot.room}
                  </Text>
                  {slot.dateScheduled ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <Ionicons name="checkmark-circle" size={10} color="#059669" />
                      <Text style={{ fontSize: 9.5, color: '#059669', fontWeight: '600' }}>
                        {slot.dateScheduled}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ));
          })()}
        </View>
      )}

      {/* 16. E-LIBRARY */}
      {activeModal === 'library' && (
        <View>
          <Text style={modalStyles.sectionHelperText}>
            Central University E-Library: 50,000+ E-books, IEEE journals, and 10-year question papers.
          </Text>
          {[
            { title: 'Database System Concepts (7th Edition)', author: 'Silberschatz, Korth', cat: 'Computer Science', status: 'Available in E-Reader' },
            { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson', cat: 'Core Engg', status: 'Available in E-Reader' },
            { title: 'Marketing Management (16th Edition)', author: 'Philip Kotler', cat: 'Management', status: 'Available in E-Reader' },
            { title: 'Remington: The Science and Practice of Pharmacy', author: 'Adeboye Adejare', cat: 'Pharmacy', status: 'Available in E-Reader' },
            { title: 'Constitutional Law of India (Vol 1 & 2)', author: 'Dr. J.N. Pandey', cat: 'Law', status: 'Available in E-Reader' }
          ].map((book, i) => (
            <View key={i} style={styles.libraryCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>Author: {book.author}</Text>
                <Text style={styles.bookCat}>{book.cat} • {book.status}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookReadBtn}
                onPress={() => Alert.alert('E-Reader', `Opening digital copy of "${book.title}" in secure viewer.`)}
              >
                <Ionicons name="book" size={14} color={COLORS.primary} />
                <Text style={styles.bookReadBtnText}>Read</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8
  },
  notifBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  notifBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46'
  },
  notifPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  notifTabPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F1F5F9'
  },
  notifTabPillActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  notifTabPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B'
  },
  notifTabPillTextActive: {
    color: '#2563EB',
    fontWeight: '700'
  },
  markReadActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    cursor: 'pointer'
  },
  markReadLink: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '700'
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    cursor: 'pointer'
  },
  clearAllText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700'
  },
  notifEmptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10
  },
  notifEmptyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  notifEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4
  },
  notifEmptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 240
  },
  notifViewAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    cursor: 'pointer'
  },
  notifViewAllBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB'
  },
  notifResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer'
  },
  notifResetBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB'
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
    alignItems: 'center',
    cursor: 'pointer'
  },
  notificationItemRead: {
    opacity: 0.7
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D4ED8',
    marginTop: 2
  },
  notificationDotRead: {
    backgroundColor: '#CBD5E1'
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  notificationTitleRead: {
    color: '#64748B'
  },
  notificationMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 3,
    alignItems: 'center'
  },
  notificationTime: {
    fontSize: 11,
    color: COLORS.textLight
  },
  notificationTag: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '700'
  },
  readStatusText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600'
  },
  singleMarkReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    cursor: 'pointer'
  },
  singleMarkReadText: {
    fontSize: 10.5,
    color: '#1D4ED8',
    fontWeight: '700'
  },
  notifDismissBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginLeft: 6,
    cursor: 'pointer'
  },
  ttDayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    cursor: 'pointer'
  },
  ttDayChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE'
  },
  ttDayChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B'
  },
  ttDayChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '700'
  },
  circularCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  circularCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  circularBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  circularDate: {
    fontSize: 11,
    color: COLORS.textLight
  },
  circularTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  circularAuthor: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4
  },
  eduCourseCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  eduCourseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eduCourseCode: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary
  },
  eduCoursePct: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success
  },
  eduCourseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2
  },
  eduCourseProf: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 8
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3
  },
  feeSummaryCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    marginBottom: 14
  },
  feeSummaryLabel: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600'
  },
  feeSummaryAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E40AF',
    marginVertical: 4
  },
  feePaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20
  },
  feePaidText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.success
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  ledgerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  ledgerReceipt: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  ledgerAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  attendanceHeroCard: {
    backgroundColor: COLORS.successBg,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    alignItems: 'center',
    marginBottom: 12
  },
  attendanceHeroLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5
  },
  attendanceHeroValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 2
  },
  attendanceHeroStatus: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600'
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  subjectName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  subjectMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  subjectPct: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success
  },
  assignmentCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  assignmentSub: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary
  },
  assignmentDue: {
    fontSize: 11,
    color: COLORS.accentOrange,
    fontWeight: '700'
  },
  assignmentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginVertical: 4
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  uploadBtnDone: {
    backgroundColor: COLORS.successBg
  },
  uploadBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary
  },
  resultCgpaCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    marginBottom: 12
  },
  resultCgpaLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5
  },
  resultCgpaValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E40AF',
    marginVertical: 2
  },
  resultCgpaMeta: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
    textAlign: 'center'
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  gradeSem: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  gradeCredits: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1
  },
  gradeSgpa: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  examCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  examDate: {
    fontSize: 11.5,
    color: COLORS.accentOrange,
    fontWeight: '700'
  },
  examCode: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary
  },
  examSubject: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 2
  },
  examHall: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  rmsCard: {
    backgroundColor: COLORS.cardBg,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  rmsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rmsCat: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  rmsStatusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4
  },
  rmsStatusText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309'
  },
  rmsDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 4
  },
  rmsDate: {
    fontSize: 10.5,
    color: COLORS.textLight
  },
  eventCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    flex: 1
  },
  eventTagBadge: {
    backgroundColor: COLORS.purpleBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4
  },
  eventTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.accentPurple
  },
  eventMeta: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  eventRegisterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  eventRegisterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  qrLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textAlign: 'center'
  },
  qrSub: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 16
  },
  transportCard: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  transportRoute: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  transportSub: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  transportLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success
  },
  transportLiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857'
  },
  hostelCard: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    marginBottom: 12
  },
  hostelTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E40AF'
  },
  hostelSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2
  },
  messRow: {
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  messMealTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentOrange
  },
  messMealItems: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  timetableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12
  },
  timeCol: {
    width: 90
  },
  timeSlotLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentOrange
  },
  timeSlotHours: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 1
  },
  slotSubject: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  slotFaculty: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2
  },
  libraryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8
  },
  bookTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  bookAuthor: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  bookCat: {
    fontSize: 10.5,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 2
  },
  bookReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder
  },
  bookReadBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary
  }
});
