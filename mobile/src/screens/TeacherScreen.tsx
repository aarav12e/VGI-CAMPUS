import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  CheckCircle2, 
  Users, 
  Clock, 
  Plus, 
  BookOpen, 
  Check, 
  X, 
  Calendar,
  Send
} from 'lucide-react';

interface TeacherScreenProps {
  user: any;
}

export const TeacherScreen: React.FC<TeacherScreenProps> = ({ user }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [topic, setTopic] = useState('Relational Normalization & SQL Queries');
  const [marking, setMarking] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, [user]);

  async function loadTeacherData() {
    setLoading(true);
    const teacherId = user?.teacher?.id;
    if (!teacherId) return;

    const res = await apiRequest(`/teachers/${teacherId}/dashboard`);
    if (res.success && res.data) {
      setClasses(res.data.assignedClasses || []);
      if (res.data.assignedClasses?.length > 0) {
        selectClassForAttendance(res.data.assignedClasses[0]);
      }
    }
    setLoading(false);
  }

  async function selectClassForAttendance(cls: any) {
    setSelectedAssignment(cls);
    // Fetch students in this section
    const res = await apiRequest(`/students?sectionId=${cls.sectionId}`);
    if (res.success && res.data) {
      setStudents(res.data);
      // Default all present
      const map: Record<string, boolean> = {};
      res.data.forEach((s: any) => {
        map[s.id] = true;
      });
      setAttendanceMap(map);
    }
  }

  function toggleStudentAttendance(studentId: string) {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  }

  function markAll(present: boolean) {
    const map: Record<string, boolean> = {};
    students.forEach(s => {
      map[s.id] = present;
    });
    setAttendanceMap(map);
  }

  async function submitAttendance() {
    if (!selectedAssignment) return;
    setMarking(true);
    setStatusMsg(null);

    const today = new Date().toISOString().split('T')[0];
    const records = students.map(s => ({
      studentId: s.id,
      isPresent: attendanceMap[s.id] !== false
    }));

    const res = await apiRequest('/attendance/sessions', {
      method: 'POST',
      body: JSON.stringify({
        subjectId: selectedAssignment.subjectId,
        sectionId: selectedAssignment.sectionId,
        date: today,
        topic,
        records
      })
    });

    if (res.success) {
      setStatusMsg(`Attendance submitted successfully for ${records.length} students!`);
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      setStatusMsg(res.error?.message || 'Submission failed');
    }
    setMarking(false);
  }

  return (
    <div>
      {/* Teacher Profile Summary */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.2) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
          Faculty Command Center
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>{user.fullName}</h2>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {user?.teacher?.designation} • {user?.teacher?.department?.name}
        </div>
      </div>

      {statusMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          {statusMsg}
        </div>
      )}

      {/* Select Assigned Teaching Class */}
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Select Teaching Class
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {classes.map(cls => (
          <button
            key={cls.id}
            onClick={() => selectClassForAttendance(cls)}
            className={selectedAssignment?.id === cls.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {cls.subject.code} • {cls.section.name}
          </button>
        ))}
      </div>

      {/* Roll Call Attendance Session Marker (PRD Section 11.2) */}
      <div className="app-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Roll Call Marker</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {selectedAssignment?.subject?.name} • {selectedAssignment?.section?.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              onClick={() => markAll(true)}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
            >
              All Present
            </button>
            <button 
              onClick={() => markAll(false)}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
            >
              All Absent
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>
            Lecture Topic Covered Today
          </label>
          <input 
            type="text" 
            className="form-input" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.5rem' }}
          />
        </div>

        {/* Student Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', maxHeight: '280px', overflowY: 'auto' }}>
          {students.map(s => {
            const isPresent = attendanceMap[s.id] !== false;
            return (
              <div 
                key={s.id}
                onClick={() => toggleStudentAttendance(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: isPresent ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${isPresent ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.user.fullName}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Roll: {s.rollNumber}</div>
                </div>

                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isPresent ? '#10b981' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {isPresent ? <Check size={16} /> : <X size={16} />}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={submitAttendance} 
          disabled={marking || students.length === 0}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.65rem' }}
        >
          <Send size={15} />
          {marking ? 'Saving Attendance...' : 'Submit Class Attendance'}
        </button>
      </div>
    </div>
  );
};
