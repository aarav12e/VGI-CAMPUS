import React from 'react';
import { LogOut, User, Bell, ExternalLink, Shield } from 'lucide-react';
import { clearStoredToken } from '../api';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-primary">
            <Shield size={12} />
            Institutional Portal
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>|</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Session: <strong>Autumn 2026</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* User Info Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            {user?.fullName ? user.fullName[0] : 'A'}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.fullName || 'VGI Administrator'}</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{user?.email || 'admin@vgi.ac.in'}</div>
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
