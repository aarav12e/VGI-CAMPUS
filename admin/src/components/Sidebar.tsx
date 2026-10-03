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
  BookOpen,
  FileText,
  Award,
  Building2,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, userRole }) => {
  const sections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'TEACHING & CLASSROOM',
      items: [
        { id: 'attendance', label: 'Roll-Call Attendance', icon: CheckCircle2, badge: 'Live' },
        { id: 'timetable', label: 'Timetable & Conflict', icon: CalendarClock },
        { id: 'assignments', label: 'Assignments & Grading', icon: FileText, badge: 'Sync' },
        { id: 'syllabus', label: 'Syllabus & Materials', icon: BookOpen },
        { id: 'results', label: 'Exam Marks Registry', icon: Award, badge: 'Mobile' },
      ]
    },
    {
      title: 'DEPARTMENT & ROSTER',
      items: [
        { id: 'hod_console', label: 'HOD Command Center', icon: Building2, badge: 'HOD' },
        { id: 'teachers', label: 'Faculty Directory', icon: Users },
        { id: 'students', label: 'Students Directory', icon: GraduationCap },
        { id: 'hierarchy', label: 'Academic Hierarchy', icon: Layers },
      ]
    },
    {
      title: 'CAMPUS SERVICES',
      items: [
        { id: 'notices', label: 'Notices & Broadcast', icon: Bell },
        { id: 'events', label: 'Events & Conclaves', icon: Calendar },
        { id: 'campus', label: 'Hostel, Mess & Library', icon: Building },
        { id: 'audit', label: 'Security & Audit Logs', icon: ShieldCheck },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '1.15rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
        }}>
          VGI
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#0f172a' }}>VGI CAMPUS</div>
          <div style={{ fontSize: '0.675rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unified Web Console
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {sections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', padding: '0 0.75rem 0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {sec.title}
            </div>

            {sec.items.map((item) => {
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
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.02))' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#334155',
                    border: 'none',
                    borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    marginBottom: '0.2rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={isActive ? '#2563eb' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '999px',
                      background: item.badge === 'Live' ? '#ecfdf5' : item.badge === 'HOD' ? '#f5f3ff' : '#eff6ff',
                      color: item.badge === 'Live' ? '#059669' : item.badge === 'HOD' ? '#6d28d9' : '#2563eb',
                      border: `1px solid ${item.badge === 'Live' ? '#a7f3d0' : item.badge === 'HOD' ? '#ddd6fe' : '#bfdbfe'}`
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Institution Info Footer */}
      <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <Smartphone size={12} color="#059669" />
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#065f46' }}>Neon Cloud Sync Active</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Vishveshwarya Group • Autumn 2026</div>
      </div>
    </aside>
  );
};
