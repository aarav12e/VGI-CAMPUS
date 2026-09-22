import React from 'react';
import { clearStoredToken } from '../api';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  Building, 
  Award, 
  BedDouble, 
  Users, 
  LogOut, 
  RefreshCw 
} from 'lucide-react';

interface ProfileProps {
  user: any;
  onLogout: () => void;
  onSwitchRole: (role: string) => void;
}

export const ProfileScreen: React.FC<ProfileProps> = ({ user, onLogout, onSwitchRole }) => {
  const isStudent = user.role === 'STUDENT';
  const student = user.student;
  const teacher = user.teacher;

  return (
    <div>
      {/* Profile Avatar Card */}
      <div className="app-card" style={{ textAlign: 'center', padding: '1.75rem 1rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isStudent ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.8rem',
          margin: '0 auto 0.75rem',
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
        }}>
          {user.fullName ? user.fullName[0] : 'U'}
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user.fullName}</h2>
        <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600, marginTop: '0.15rem' }}>
          {user.role} • {isStudent ? student?.rollNumber : teacher?.employeeId}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
          {user.email}
        </div>
      </div>

      {/* Academic Identity Details (PRD Section 10) */}
      <div className="app-card">
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          {isStudent ? 'Academic Enrollment' : 'Faculty Appointment'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
          {isStudent ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Degree Program</span>
                <strong>{student?.program?.name || 'B.Tech Data Science'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department</span>
                <span>{student?.department?.code || 'CSE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Enrollment No.</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{student?.enrollmentNumber || 'ENR2024001'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Class Section</span>
                <span>Semester {student?.semester?.number || 5} • {student?.section?.name || 'Section A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cumulative CGPA</span>
                <strong style={{ color: '#34d399' }}>{student?.cgpa ? student.cgpa.toFixed(2) : '8.65'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hostel Residence</span>
                <span>{student?.hostelRoom || 'Aryabhata Room 204'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Guardian Contact</span>
                <span>{student?.guardianName || 'Suresh Patel'} ({student?.guardianPhone || '+91 98760 11223'})</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Designation</span>
                <strong>{teacher?.designation}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Employee ID</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{teacher?.employeeId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department</span>
                <span>{teacher?.department?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Qualification</span>
                <span>{teacher?.qualification}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Switch Demo Role (for testing both Student and Faculty personas easily) */}
      <div className="app-card">
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Persona Testing Switcher
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => onSwitchRole('student')}
            className="btn btn-secondary"
            style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.6rem 0.85rem' }}
          >
            <span>Switch to Student (Aarav Patel)</span>
            <span className="badge badge-blue">Student UI</span>
          </button>
          <button 
            onClick={() => onSwitchRole('teacher')}
            className="btn btn-secondary"
            style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.6rem 0.85rem' }}
          >
            <span>Switch to Faculty (Dr. Rajesh Sharma)</span>
            <span className="badge badge-green">Teacher UI</span>
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <button 
        onClick={onLogout}
        className="btn btn-secondary"
        style={{ width: '100%', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.75rem' }}
      >
        <LogOut size={16} />
        Sign Out from VGI CAMPUS
      </button>
    </div>
  );
};
