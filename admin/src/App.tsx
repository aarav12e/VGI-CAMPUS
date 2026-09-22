import React, { useState, useEffect } from 'react';
import { getStoredUser, clearStoredToken, apiRequest } from './api';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { NoticesPage } from './pages/NoticesPage';
import { EventsPage } from './pages/EventsPage';
import { CampusPage } from './pages/CampusPage';
import { AuditPage } from './pages/AuditPage';

export const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const stored = getStoredUser();
      if (stored) {
        // verify session with /auth/me
        const res = await apiRequest('/auth/me');
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          clearStoredToken();
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  function handleLogout() {
    clearStoredToken();
    setUser(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-muted)' }}>
        Authenticating VGI CAMPUS administration portal...
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="layout-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="main-content">
        <Navbar user={user} onLogout={handleLogout} />

        {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
        {currentTab === 'students' && <StudentsPage />}
        {currentTab === 'teachers' && <TeachersPage />}
        {currentTab === 'hierarchy' && <HierarchyPage />}
        {currentTab === 'timetable' && <TimetablePage />}
        {currentTab === 'attendance' && <AttendancePage />}
        {currentTab === 'notices' && <NoticesPage />}
        {currentTab === 'events' && <EventsPage />}
        {currentTab === 'campus' && <CampusPage />}
        {currentTab === 'audit' && <AuditPage />}
      </div>
    </div>
  );
};
