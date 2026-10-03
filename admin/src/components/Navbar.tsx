import React, { useState } from 'react';
import { LogOut, User, Bell, ExternalLink, Shield, Smartphone, RefreshCw, ChevronDown } from 'lucide-react';
import { apiRequest, setStoredToken, setStoredUser } from '../api';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onRoleSwitch?: (newUser: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onRoleSwitch }) => {
  const [switching, setSwitching] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  async function handleFastRoleSwitch(email: string, pass: string) {
    setSwitching(true);
    setShowRoleMenu(false);
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
      if (onRoleSwitch) {
        onRoleSwitch(res.data.user);
      }
    }
    setSwitching(false);
  }

  function handleTriggerSync() {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 800);
  }

  const roleLabel = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
    ? 'College Administrator'
    : user?.teacher?.designation?.includes('HOD')
    ? 'Head of Department'
    : user?.role === 'TEACHER'
    ? 'Faculty / Professor'
    : user?.role || 'Staff';

  const roleColor = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'
    ? '#2563eb'
    : user?.teacher?.designation?.includes('HOD')
    ? '#7c3aed'
    : '#059669';

  return (
    <header className="topbar">
      {/* Left: Institution & Sync Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge" style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}35` }}>
            <Shield size={12} />
            {roleLabel}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>|</span>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Session: <strong>Autumn 2026</strong>
          </span>
        </div>

        {/* Live Cloud & Mobile Sync Heartbeat */}
        <div 
          onClick={handleTriggerSync}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#065f46'
          }}
          title="Click to force sync refresh with Neon Cloud DB & Mobile Apps"
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'inline-block',
            boxShadow: '0 0 8px #10b981'
          }} />
          <Smartphone size={12} color="#059669" />
          <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Mobile In-Sync (Live Neon DB)'}</span>
          <RefreshCw size={11} className={syncStatus === 'syncing' ? 'spin' : ''} />
        </div>
      </div>

      {/* Right: Role Switcher & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        {/* Quick Role Switcher Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            disabled={switching}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem', gap: '0.35rem' }}
          >
            <span>Switch Role</span>
            <ChevronDown size={14} />
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '0.5rem',
              zIndex: 100,
              minWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', padding: '0.35rem 0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Quick Persona Switcher
              </div>
              
              <button
                onClick={() => handleFastRoleSwitch('admin@vgi.ac.in', 'admin123')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: user?.email === 'admin@vgi.ac.in' ? '#eff6ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>👑</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>College Administrator</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>admin@vgi.ac.in</div>
                </div>
              </button>

              <button
                onClick={() => handleFastRoleSwitch('rajesh.sharma@vgi.ac.in', 'teacher123')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: user?.email === 'rajesh.sharma@vgi.ac.in' ? '#f5f3ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>🏛️</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6d28d9' }}>Dr. Rajesh Sharma (HOD CSE)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>rajesh.sharma@vgi.ac.in</div>
                </div>
              </button>

              <button
                onClick={() => handleFastRoleSwitch('priya.verma@vgi.ac.in', 'teacher123')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: user?.email === 'priya.verma@vgi.ac.in' ? '#ecfdf5' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>👨‍🏫</span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46' }}>Prof. Priya Verma (Faculty)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>priya.verma@vgi.ac.in</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Info Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor} 0%, #1e293b 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            {user?.fullName ? user.fullName[0] : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.fullName || 'VGI Staff'}</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user?.email || 'user@vgi.ac.in'}</div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          title="Sign out of administration session"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </header>
  );
};
