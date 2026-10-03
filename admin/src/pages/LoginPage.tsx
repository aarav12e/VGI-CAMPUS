import React, { useState } from 'react';
import { apiRequest, setStoredToken, setStoredUser } from '../api';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, Smartphone, Users, Award, BookOpen } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@vgi.ac.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
      onLoginSuccess(res.data.user);
    } else {
      setError(res.error?.message || 'Invalid email or password');
    }
    setLoading(false);
  }

  async function handleQuickLogin(userEmail: string, userPass: string) {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
    setLoading(true);

    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: userEmail, password: userPass })
    });

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
      onLoginSuccess(res.data.user);
    } else {
      setError(res.error?.message || 'Invalid credentials');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08), transparent 40%), radial-gradient(circle at 90% 80%, rgba(124, 58, 237, 0.06), transparent 40%), #f8fafc',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.5rem',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
          }}>
            VGI
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>VGI CAMPUS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Unified Institutional Administration & Faculty Web Portal
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
            <Smartphone size={12} color="#059669" />
            <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>
              Live Bi-Directional Mobile Synchronization Active
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#dc2626',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Campus Email or Employee ID</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '2.4rem' }}
                required 
                placeholder="admin@vgi.ac.in or emp001"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '2.4rem' }}
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Click Role Direct Logins */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.725rem', color: '#64748b', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', fontWeight: 700 }}>
            Instant 1-Click Role Launchers
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Admin */}
            <button 
              type="button" 
              onClick={() => handleQuickLogin('admin@vgi.ac.in', 'admin123')}
              className="btn btn-secondary" 
              style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.6rem 0.85rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>👑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>College Registrar / Admin</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Full campus management & security audit</div>
                </div>
              </div>
              <code style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 }}>admin@vgi.ac.in</code>
            </button>

            {/* HOD */}
            <button 
              type="button" 
              onClick={() => handleQuickLogin('rajesh.sharma@vgi.ac.in', 'teacher123')}
              className="btn btn-secondary" 
              style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.6rem 0.85rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>🏛️</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: '#6d28d9' }}>Dr. Rajesh Sharma (HOD CSE)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Faculty allocation & dept analytics</div>
                </div>
              </div>
              <code style={{ color: '#6d28d9', fontSize: '0.75rem', fontWeight: 600 }}>rajesh.sharma@vgi.ac.in</code>
            </button>

            {/* Faculty */}
            <button 
              type="button" 
              onClick={() => handleQuickLogin('priya.verma@vgi.ac.in', 'teacher123')}
              className="btn btn-secondary" 
              style={{ justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.6rem 0.85rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>👨‍🏫</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: '#059669' }}>Prof. Priya Verma (Faculty)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Daily roll call, assignments & study notes</div>
                </div>
              </div>
              <code style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>priya.verma@vgi.ac.in</code>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
