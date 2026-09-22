import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Send,
  Check,
  X,
  UserCheck,
  BookOpen
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'marker' | 'sessions'>('marker');
  const [sessions, setSessions] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Roll-Call Marker State
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('Relational Normalization & SQL Queries');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [sessRes, tRes, secRes, subRes] = await Promise.all([
      apiRequest('/attendance/sessions'),
      apiRequest('/teachers'),
      apiRequest('/academic/sections'),
      apiRequest('/academic/subjects')
    ]);

    if (sessRes.success) setSessions(sessRes.data);
    if (tRes.success) {
      setTeachers(tRes.data);
      if (tRes.data.length > 0) setSelectedTeacher(tRes.data[0].id);
    }
    if (secRes.success && secRes.data.length > 0) {
      setSections(secRes.data);
      setSelectedSection(secRes.data[0].id);
      loadStudentsForSection(secRes.data[0].id);
    }
    if (subRes.success && subRes.data.length > 0) {
      setSubjects(subRes.data);
      setSelectedSubject(subRes.data[0].id);
    }
    setLoading(false);
  }

  async function loadStudentsForSection(secId: string) {
    const res = await apiRequest(`/students?sectionId=${secId}`);
    if (res.success && res.data) {
      setStudents(res.data);
      const initialMap: Record<string, boolean> = {};
      res.data.forEach((s: any) => {
        initialMap[s.id] = true; // default all present
      });
      setAttendanceMap(initialMap);
    }
  }

  function handleSectionSelect(secId: string) {
    setSelectedSection(secId);
    loadStudentsForSection(secId);
  }

  function toggleStudent(studentId: string) {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  }

  function setAllAttendance(present: boolean) {
    const newMap: Record<string, boolean> = {};
    students.forEach(s => {
      newMap[s.id] = present;
    });
    setAttendanceMap(newMap);
  }

  async function handleSubmitAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeacher || !selectedSection || !selectedSubject) {
      setMessage({ type: 'error', text: 'Please select faculty, subject, and section.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const records = students.map(s => ({
      studentId: s.id,
      isPresent: attendanceMap[s.id] !== false
    }));

    const res = await apiRequest('/attendance/sessions', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: selectedTeacher,
        sectionId: selectedSection,
        subjectId: selectedSubject,
        date: sessionDate,
        topic,
        records
      })
    });

    if (res.success) {
      setMessage({
        type: 'success',
        text: `Attendance saved successfully! ${records.filter(r => r.isPresent).length} present, ${records.filter(r => !r.isPresent).length} absent.`
      });
      // Refresh session history
      const sessRes = await apiRequest('/attendance/sessions');
      if (sessRes.success) setSessions(sessRes.data);
    } else {
      setMessage({ type: 'error', text: res.error?.message || 'Failed to submit attendance' });
    }
    setSubmitting(false);
  }

  const presentCount = students.filter(s => attendanceMap[s.id] !== false).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Faculty Attendance & Roll-Call Portal</h1>
        <p className="page-subtitle">Interactive roll-call marker for professors and instructors to record and audit classroom attendance</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveView('marker')}
          className={activeView === 'marker' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <UserCheck size={16} />
          Faculty Roll-Call Marker (Active)
        </button>
        <button
          onClick={() => setActiveView('sessions')}
          className={activeView === 'sessions' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <Calendar size={16} />
          Conducted Sessions History ({sessions.length})
        </button>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color={message.type === 'success' ? '#059669' : '#dc2626'} />
          {message.text}
        </div>
      )}

      {/* 1. FACULTY ROLL CALL ATTENDANCE MARKER VIEW */}
      {activeView === 'marker' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Left Configuration Panel */}
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#2563eb" />
              Lecture Session Details
            </h3>

            <form onSubmit={handleSubmitAttendance}>
              <div className="form-group">
                <label className="form-label">Instructing Professor / Teacher</label>
                <select 
                  className="form-select"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.user.fullName} ({t.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select 
                  className="form-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Class Section</label>
                <select 
                  className="form-select"
                  value={selectedSection}
                  onChange={(e) => handleSectionSelect(e.target.value)}
                  required
                >
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>
                      {sec.semester.batch.program.code} • Sem {sec.semester.number} ({sec.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lecture Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lecture Topic Covered</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Relational Normalization (1NF to BCNF)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              {/* Attendance Statistics Box */}
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', margin: '1.25rem 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Roll-Call Summary
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <span>Total Enrolled:</span>
                  <strong>{students.length} Students</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#059669', marginBottom: '0.35rem' }}>
                  <span>Marked Present:</span>
                  <strong>{presentCount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#dc2626' }}>
                  <span>Marked Absent:</span>
                  <strong>{absentCount}</strong>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting || students.length === 0} 
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
              >
                <Send size={16} />
                {submitting ? 'Recording Attendance...' : 'Submit & Save Attendance Session'}
              </button>
            </form>
          </div>

          {/* Right Roll Call Checklist */}
          <div className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Student Roll-Call Checklist</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click any student card to toggle Present / Absent status</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setAllAttendance(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <Check size={14} color="#059669" />
                  Mark All Present
                </button>
                <button 
                  type="button" 
                  onClick={() => setAllAttendance(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <X size={14} color="#dc2626" />
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Checklist List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                  No students enrolled in this section.
                </div>
              ) : (
                students.map((student) => {
                  const isPresent = attendanceMap[student.id] !== false;
                  return (
                    <div 
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isPresent ? '#a7f3d0' : '#fecaca'}`,
                        background: isPresent ? '#ecfdf5' : '#fef2f2',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isPresent ? '#059669' : '#dc2626',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}>
                          {student.user.fullName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                            {student.user.fullName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                            Roll: <strong style={{ fontFamily: 'var(--font-mono)' }}>{student.rollNumber}</strong> • Enr: {student.enrollmentNumber}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                          {isPresent ? '✓ PRESENT' : '✗ ABSENT'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SESSIONS HISTORY VIEW */}
      {activeView === 'sessions' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject & Code</th>
                <th>Faculty Instructor</th>
                <th>Class Section</th>
                <th>Topic Taught</th>
                <th>Present / Total</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No attendance sessions recorded yet.
                  </td>
                </tr>
              ) : (
                sessions.map((sess) => {
                  const total = sess.records.length;
                  const present = sess.records.filter((r: any) => r.isPresent).length;
                  const pct = total > 0 ? Math.round((present / total) * 100) : 0;
                  return (
                    <tr key={sess.id}>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>{sess.date}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{sess.subject.name}</div>
                        <span className="badge badge-primary">{sess.subject.code}</span>
                      </td>
                      <td>{sess.teacher.user.fullName}</td>
                      <td>
                        <span className="badge badge-secondary">{sess.section.name}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{sess.topic || 'Regular Lecture'}</td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{present}</strong> / {total}
                      </td>
                      <td>
                        <span className={`badge ${pct >= 75 ? 'badge-success' : 'badge-danger'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
