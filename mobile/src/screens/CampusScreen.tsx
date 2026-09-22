import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Bell, 
  Calendar, 
  BedDouble, 
  Utensils, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Wrench
} from 'lucide-react';

interface CampusProps {
  user: any;
}

export const CampusScreen: React.FC<CampusProps> = ({ user }) => {
  const [subTab, setSubTab] = useState<'notices' | 'events' | 'hostel' | 'mess' | 'fees'>('notices');
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [messMenu, setMessMenu] = useState<any[]>([]);
  const [fee, setFee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Complaint State
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCat, setComplaintCat] = useState('ELECTRICAL');
  const [complaintMsg, setComplaintMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    const [nRes, eRes, cRes, mRes, fRes] = await Promise.all([
      apiRequest('/notices'),
      apiRequest('/events'),
      apiRequest('/campus/hostel/complaints'),
      apiRequest('/campus/mess/menu'),
      apiRequest('/campus/fees/my-fee')
    ]);

    if (nRes.success) setNotices(nRes.data);
    if (eRes.success) setEvents(eRes.data);
    if (cRes.success) setComplaints(cRes.data);
    if (mRes.success) setMessMenu(mRes.data);
    if (fRes.success) setFee(fRes.data);
    setLoading(false);
  }

  async function handleRegisterEvent(eventId: string) {
    const res = await apiRequest(`/events/${eventId}/register`, { method: 'POST' });
    if (res.success) {
      loadData();
    }
  }

  async function handleRaiseComplaint(e: React.FormEvent) {
    e.preventDefault();
    if (!complaintDesc) return;

    const res = await apiRequest('/campus/hostel/complaints', {
      method: 'POST',
      body: JSON.stringify({
        roomNumber: user?.student?.hostelRoom || 'Aryabhata - 204',
        category: complaintCat,
        description: complaintDesc
      })
    });

    if (res.success) {
      setComplaintMsg('Maintenance ticket raised successfully!');
      setComplaintDesc('');
      setTimeout(() => setComplaintMsg(null), 3000);
      loadData();
    }
  }

  return (
    <div>
      {/* Sub-nav */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1rem',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'notices', label: 'Notices' },
          { id: 'events', label: 'Events' },
          { id: 'hostel', label: 'Hostel' },
          { id: 'mess', label: 'Mess Menu' },
          { id: 'fees', label: 'Fees' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={subTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem', borderRadius: '999px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. NOTICES */}
      {subTab === 'notices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notices.map((n) => (
            <div key={n.id} className="app-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className={`badge ${n.priority === 'CRITICAL' ? 'badge-red' : 'badge-blue'}`}>
                  {n.category}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {new Date(n.publishDate).toLocaleDateString()}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{n.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: '1.5' }}>
                {n.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 2. EVENTS */}
      {subTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {events.map((ev) => (
            <div key={ev.id} className="app-card" style={{ marginBottom: 0, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-blue">{ev.category}</span>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                  {ev.date}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{ev.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {ev.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.75rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={12} />
                  <span>{ev.startTime} - {ev.endTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={12} />
                  <span>{ev.venue}</span>
                </div>
              </div>

              {ev.isRegistered ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, padding: '0.4rem 0' }}>
                  <CheckCircle2 size={16} />
                  You are registered for this event!
                </div>
              ) : (
                <button 
                  onClick={() => handleRegisterEvent(ev.id)} 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  Register for Event
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. HOSTEL */}
      {subTab === 'hostel' && (
        <div>
          <div className="app-card">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              MY HOSTEL ALLOCATION
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.25rem' }}>
              {user?.student?.hostelRoom || 'Aryabhata Hostel - Room 204'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Bed 1 • Wi-Fi Enabled • Attached Washroom
            </div>
          </div>

          {/* Raise Complaint Form */}
          <div className="app-card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wrench size={16} color="#3b82f6" />
              Raise Maintenance Ticket
            </h4>

            {complaintMsg && (
              <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                {complaintMsg}
              </div>
            )}

            <form onSubmit={handleRaiseComplaint}>
              <div style={{ marginBottom: '0.6rem' }}>
                <select 
                  className="form-select"
                  value={complaintCat}
                  onChange={(e) => setComplaintCat(e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  <option value="ELECTRICAL">Electrical (Fan/Light/Socket)</option>
                  <option value="PLUMBING">Plumbing (Tap/Geyser/Drain)</option>
                  <option value="CARPENTRY">Carpentry (Bed/Desk/Door)</option>
                  <option value="CLEANLINESS">Housekeeping / Cleanliness</option>
                </select>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <textarea 
                  className="form-textarea"
                  rows={2}
                  placeholder="Describe the issue in your hostel room..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  style={{ fontSize: '0.8rem' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}>
                Submit Maintenance Complaint
              </button>
            </form>
          </div>

          {/* Active Complaints */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
            My Raised Complaints
          </div>
          {complaints.map(c => (
            <div key={c.id} className="app-card" style={{ marginBottom: '0.5rem', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span className="badge badge-blue">{c.category}</span>
                <span className={`badge ${c.status === 'RESOLVED' ? 'badge-green' : 'badge-yellow'}`}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem' }}>{c.description}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                Raised on {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MESS MENU */}
      {subTab === 'mess' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messMenu.map(m => (
            <div key={m.id} className="app-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa' }}>{m.dayOfWeek}</h4>
                {m.specialMeal && <span className="badge badge-yellow">{m.specialMeal}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <div><strong style={{ color: 'var(--text-muted)' }}>Breakfast:</strong> {m.breakfast}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Lunch:</strong> {m.lunch}</div>
                <div><strong style={{ color: 'var(--text-muted)' }}>Dinner:</strong> {m.dinner}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. FEES */}
      {subTab === 'fees' && (
        <div>
          <div className="app-card" style={{ textAlign: 'center', padding: '1.75rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              FEE ACCOUNT STATUS
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399', margin: '0.3rem 0' }}>
              ₹ {fee?.paidAmount?.toLocaleString() || '1,25,000'}
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
              ✓ ALL DUES CLEARED (PAID)
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Session: 2026-2027 • B.Tech Data Science
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
