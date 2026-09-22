import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Building, 
  Utensils, 
  BookOpen, 
  BedDouble, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  Layers
} from 'lucide-react';

export const CampusPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hostel' | 'mess' | 'library'>('hostel');
  const [rooms, setRooms] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [menu, setMenu] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [rRes, cRes, mRes, bRes] = await Promise.all([
      apiRequest('/campus/hostel/rooms'),
      apiRequest('/campus/hostel/complaints'),
      apiRequest('/campus/mess/menu'),
      apiRequest('/campus/library/books')
    ]);

    if (rRes.success) setRooms(rRes.data);
    if (cRes.success) setComplaints(cRes.data);
    if (mRes.success) setMenu(mRes.data);
    if (bRes.success) setBooks(bRes.data);
    setLoading(false);
  }

  async function handleResolveComplaint(id: string) {
    const res = await apiRequest(`/campus/hostel/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'RESOLVED' })
    });
    if (res.success) {
      loadData();
    }
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Campus Operations & Facilities</h1>
        <p className="page-subtitle">Manage Hostels, Maintenance Complaints, Mess Dining, and Library Catalog</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button 
          onClick={() => setActiveTab('hostel')} 
          className={activeTab === 'hostel' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <BedDouble size={16} />
          Hostels & Complaints ({complaints.length})
        </button>
        <button 
          onClick={() => setActiveTab('mess')} 
          className={activeTab === 'mess' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <Utensils size={16} />
          Mess Menu Schedule
        </button>
        <button 
          onClick={() => setActiveTab('library')} 
          className={activeTab === 'library' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <BookOpen size={16} />
          Library Catalog ({books.length})
        </button>
      </div>

      {/* Hostel Tab */}
      {activeTab === 'hostel' && (
        <div>
          {/* Hostel Rooms Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {rooms.map(room => (
              <div key={room.id} className="stat-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{room.building}</span>
                  <span className={`badge ${room.occupied >= room.capacity ? 'badge-danger' : 'badge-success'}`}>
                    {room.occupied >= room.capacity ? 'Full' : 'Available'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{room.hostelName}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Room {room.roomNumber} (Floor {room.floor})
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Occupancy: <strong>{room.occupied}</strong> / {room.capacity} Beds
                </div>
              </div>
            ))}
          </div>

          {/* Maintenance Complaints */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Hostel Maintenance Complaints</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Room</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No pending maintenance complaints.
                      </td>
                    </tr>
                  ) : (
                    complaints.map(c => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.student.user.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{c.student.rollNumber}</div>
                        </td>
                        <td>{c.roomNumber}</td>
                        <td>
                          <span className="badge badge-secondary">{c.category}</span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.description}</td>
                        <td>
                          <span className={`badge ${c.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          {c.status !== 'RESOLVED' ? (
                            <button 
                              onClick={() => handleResolveComplaint(c.id)}
                              className="btn btn-primary"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <CheckCircle2 size={13} />
                              Mark Resolved
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Mess Tab */}
      {activeTab === 'mess' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {menu.map(m => (
            <div key={m.id} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#60a5fa' }}>{m.dayOfWeek}</h3>
                {m.specialMeal && <span className="badge badge-warning">{m.specialMeal}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Breakfast</div>
                  <div style={{ color: 'var(--text-main)' }}>{m.breakfast}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Lunch</div>
                  <div style={{ color: 'var(--text-main)' }}>{m.lunch}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Dinner</div>
                  <div style={{ color: 'var(--text-main)' }}>{m.dinner}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Authors</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Available Copies</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.title}</td>
                  <td>{b.author}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{b.isbn}</td>
                  <td>
                    <span className="badge badge-primary">{b.category}</span>
                  </td>
                  <td>
                    <strong>{b.availableCopies}</strong> / {b.totalCopies}
                  </td>
                  <td>
                    <span className="badge badge-success">In Circulation</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
