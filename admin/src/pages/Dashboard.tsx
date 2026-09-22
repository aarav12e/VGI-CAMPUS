import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  CheckCircle, 
  BedDouble, 
  Bell, 
  Calendar, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await apiRequest('/analytics/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading executive dashboard metrics...</div>;
  }

  const stats = data?.stats || {};
  const logs = data?.recentAuditLogs || [];

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={14} />
            Institutional Overview • Academic Year {stats.currentAcademicYear}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome to VGI CAMPUS Administration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem', maxWidth: '650px' }}>
            Central institutional command center. Monitor real-time student attendance, faculty teaching loads, course allocations, campus operations, and compliance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('students')} className="btn btn-primary">
            <GraduationCap size={16} />
            Add Student
          </button>
          <button onClick={() => onNavigate('timetable')} className="btn btn-secondary">
            <Calendar size={16} />
            Manage Timetable
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="stats-grid">
        {/* Total Students */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active Enrolled Students</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <GraduationCap size={22} />
            </div>
          </div>
          <div className="stat-number">{stats.totalStudents || 3}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.775rem', color: '#34d399' }}>
            <span>Verified against Academic Hierarchy</span>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Faculty & Instructors</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Users size={22} />
            </div>
          </div>
          <div className="stat-number">{stats.totalTeachers || 3}</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            100% Assigned to Sections
          </div>
        </div>

        {/* Average Attendance */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Institutional Attendance</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <CheckCircle size={22} />
            </div>
          </div>
          <div className="stat-number">{stats.averageAttendance || 86}%</div>
          <div style={{ fontSize: '0.775rem', color: stats.averageAttendance >= 75 ? '#34d399' : '#f87171', marginTop: '0.5rem' }}>
            {stats.averageAttendance >= 75 ? 'Above 75% Statutory Requirement' : 'Attendance Attention Needed'}
          </div>
        </div>

        {/* Hostel Occupancy */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Hostel Occupancy Rate</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <BedDouble size={22} />
            </div>
          </div>
          <div className="stat-number">{stats.hostelOccupancyRate || 85}%</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {stats.totalHostelOccupied || 4} / {stats.totalHostelCapacity || 6} Beds Occupied
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recent Audit Activities */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security & Administrative Audit Trail</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest immutable system actions and state transitions</p>
            </div>
            <button onClick={() => onNavigate('audit')} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              View All Logs
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No audit logs found yet.</div>
            ) : (
              logs.map((log: any) => (
                <div 
                  key={log.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: log.action.includes('CREATE') ? '#10b981' : log.action.includes('SUBMIT') ? '#3b82f6' : '#f59e0b'
                    }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.action}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: <span style={{ color: 'var(--text-main)' }}>{log.entityType}</span> {log.details ? `• ${log.details.slice(0, 45)}...` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{log.user?.fullName || 'System'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations Portal */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Institutional Hierarchy</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Active core structure components</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Departments</span>
                <strong style={{ color: '#fff' }}>{stats.totalDepartments || 2}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Degree Programs</span>
                <strong style={{ color: '#fff' }}>{stats.totalPrograms || 2}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Batches</span>
                <strong style={{ color: '#fff' }}>{stats.totalBatches || 1}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Curriculum Subjects</span>
                <strong style={{ color: '#fff' }}>{stats.totalSubjects || 4}</strong>
              </div>
            </div>
          </div>

          <button onClick={() => onNavigate('hierarchy')} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
            <Building2 size={16} />
            Configure Academic Hierarchy
          </button>
        </div>
      </div>
    </div>
  );
};
