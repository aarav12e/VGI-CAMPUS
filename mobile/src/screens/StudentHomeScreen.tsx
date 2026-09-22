import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  FileText, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  MapPin
} from 'lucide-react';

interface StudentHomeProps {
  user: any;
  onNavigate: (tab: string) => void;
}

export const StudentHomeScreen: React.FC<StudentHomeProps> = ({ user, onNavigate }) => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user?.student?.id) return;
      const res = await apiRequest(`/students/${user.student.id}/dashboard`);
      if (res.success && res.data) {
        setDashboard(res.data);
      }
      setLoading(false);
    }
    loadDashboard();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading student dashboard...</div>;
  }

  const student = dashboard?.student || user?.student;
  const attendancePct = dashboard?.attendancePercentage || 84;
  const isWarning = dashboard?.isAttendanceWarning;
  const nextClass = dashboard?.nextClass;
  const pendingAssignments = dashboard?.pendingAssignments || [];
  const latestNotices = dashboard?.latestNotices || [];
  const upcomingEvents = dashboard?.upcomingEvents || [];

  return (
    <div>
      {/* Student Greeting & Profile Summary (PRD Section 9.1) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        padding: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Welcome Back
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Hello, {user.fullName?.split(' ')[0] || 'Student'}</h1>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            {user.fullName ? user.fullName[0] : 'S'}
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
          {student?.program?.name || 'B.Tech Data Science'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
          Semester {student?.semester?.number || 5} • {student?.section?.name || 'Section A'} • Roll: {student?.rollNumber || '24DS001'}
        </div>
      </div>

      {/* Attendance KPI Widget */}
      <div className="app-card" onClick={() => onNavigate('academics')} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Overall Attendance
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: attendancePct >= 75 ? '#34d399' : '#f87171' }}>
                {attendancePct}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ({dashboard?.totalPresent || 16} / {dashboard?.totalSessions || 18} classes)
              </span>
            </div>
          </div>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: attendancePct >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: attendancePct >= 75 ? '#34d399' : '#f87171'
          }}>
            {attendancePct >= 75 ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
        </div>

        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${attendancePct}%`,
              background: attendancePct >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ef4444, #f87171)'
            }} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.725rem', color: attendancePct >= 75 ? '#34d399' : '#f87171' }}>
            {attendancePct >= 75 ? '✓ Above statutory 75% requirement' : '⚠️ Defaulter risk warning'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600 }}>
            Breakdown <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Next Class Widget */}
      {nextClass && (
        <div className="app-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              NEXT UPCOMING CLASS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              <Clock size={13} />
              {nextClass.startTime} - {nextClass.endTime}
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{nextClass.subject.name}</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Instructor: {nextClass.teacher?.user?.fullName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            <MapPin size={13} color="#94a3b8" />
            <span>Room: {nextClass.roomName}</span>
          </div>
        </div>
      )}

      {/* Pending Assignment Reminder */}
      {pendingAssignments.length > 0 && (
        <div className="app-card" onClick={() => onNavigate('academics')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              PENDING ACADEMIC TASK
            </span>
            <span className="badge badge-yellow">Due Soon</span>
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{pendingAssignments[0].title}</h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pendingAssignments[0].subjectName}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
            Due: {new Date(pendingAssignments[0].dueDate).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Latest Notice Card */}
      {latestNotices.length > 0 && (
        <div className="app-card" onClick={() => onNavigate('campus')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Bell size={14} color="#f87171" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase' }}>
              LATEST CIRCULAR
            </span>
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{latestNotices[0].title}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {latestNotices[0].content}
          </p>
        </div>
      )}

      {/* Upcoming Event */}
      {upcomingEvents.length > 0 && (
        <div className="app-card" onClick={() => onNavigate('campus')} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Calendar size={14} color="#8b5cf6" />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' }}>
              CAMPUS EVENT
            </span>
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{upcomingEvents[0].title}</h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            {upcomingEvents[0].date} • {upcomingEvents[0].venue}
          </div>
        </div>
      )}
    </div>
  );
};
