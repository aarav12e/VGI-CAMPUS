import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Layers, 
  CalendarClock, 
  CheckCircle2, 
  Bell, 
  Calendar, 
  ShieldCheck,
  Building,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: GraduationCap },
    { id: 'teachers', label: 'Faculty & Teachers', icon: Users },
    { id: 'hierarchy', label: 'Academic Hierarchy', icon: Layers },
    { id: 'timetable', label: 'Timetable & Conflict', icon: CalendarClock },
    { id: 'attendance', label: 'Attendance Monitor', icon: CheckCircle2 },
    { id: 'notices', label: 'Campus Notices', icon: Bell },
    { id: 'events', label: 'Events & TechFest', icon: Calendar },
    { id: 'campus', label: 'Hostel, Mess & Library', icon: Building },
    { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}>
          VGI
        </div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#fff' }}>VGI CAMPUS</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Console</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-dim)', padding: '0 0.75rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Platform Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))' : 'transparent',
                color: isActive ? '#60a5fa' : 'var(--text-muted)',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                marginBottom: '0.25rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#3b82f6' : '#94a3b8'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Institution Info Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Vishveshwarya Group</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Session: 2026-2027 • v1.0.0</div>
      </div>
    </aside>
  );
};
