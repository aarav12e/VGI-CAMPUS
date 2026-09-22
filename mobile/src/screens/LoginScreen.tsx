import React, { useState } from 'react';
import { apiRequest, setStoredToken, setStoredUser } from '../api';
import { Shield, Lock, Mail, ArrowRight, GraduationCap, Users } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('aarav.patel@vgi.ac.in');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e?: React.FormEvent, customEmail?: string, customPass?: string) {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: loginEmail, password: loginPass })
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
      onLoginSuccess(res.data.user);
    } else {
      setError(res.error?.message || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.4rem',
          margin: '0 auto 0.75rem',
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
        }}>
          VGI
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>VGI CAMPUS</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
          Vishveshwarya Group of Institutions
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          color: '#f87171',
          fontSize: '0.8rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => handleLogin(e)} className="app-card">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>
            Campus Email ID
          </label>
          <input 
            type="email" 
            className="form-input" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>
            Password
          </label>
          <input 
            type="password" 
            className="form-input" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.7rem' }}>
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight size={16} />
        </button>
      </form>

      {/* 1-Tap Quick Access Buttons */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          1-Tap Quick Demo Personas
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => handleLogin(undefined, 'aarav.patel@vgi.ac.in', 'Password@123')}
            className="btn btn-secondary"
            style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={16} color="#60a5fa" />
              <span>Student (Aarav Patel)</span>
            </div>
            <span className="badge badge-blue">Student</span>
          </button>

          <button 
            type="button" 
            onClick={() => handleLogin(undefined, 'rajesh.sharma@vgi.ac.in', 'Password@123')}
            className="btn btn-secondary"
            style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} color="#34d399" />
              <span>Faculty (Dr. Rajesh Sharma)</span>
            </div>
            <span className="badge badge-green">Teacher</span>
          </button>
        </div>
      </div>
    </div>
  );
};
