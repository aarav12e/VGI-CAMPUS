import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  X 
} from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    targetAudience: 'ALL'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    const res = await apiRequest('/notices');
    if (res.success && res.data) {
      setNotices(res.data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await apiRequest('/notices', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success) {
      setMessage('Campus notice published successfully and dispatched to target audience!');
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        targetAudience: 'ALL'
      });
      fetchNotices();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Withdraw and delete this campus notice?')) return;
    const res = await apiRequest(`/notices/${id}`, { method: 'DELETE' });
    if (res.success) fetchNotices();
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Campus Notices & Circulars</h1>
          <p className="page-subtitle">Publish targeted institutional notifications, circulars, and urgent alerts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Publish New Notice
        </button>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {/* Notices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading campus notices...</div>
        ) : notices.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No notices found.</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span className={`badge ${
                  notice.priority === 'CRITICAL' ? 'badge-danger' : notice.priority === 'HIGH' ? 'badge-warning' : 'badge-primary'
                }`}>
                  {notice.priority} PRIORITY
                </span>
                <span className="badge badge-secondary">{notice.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <Users size={13} />
                  Audience: <strong style={{ color: '#fff' }}>{notice.targetAudience}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                  <Clock size={13} />
                  {new Date(notice.publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{notice.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{notice.content}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Published by: <strong style={{ color: '#60a5fa' }}>{notice.author?.fullName || 'College Administration'}</strong>
                </div>
                <button onClick={() => handleDelete(notice.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>
                  <Trash2 size={13} />
                  Withdraw Notice
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publish Notice Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Publish Campus Notice</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Mid-Semester Examination Circular"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="EVENT">Event</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="GENERAL">General</option>
                    <option value="URGENT">Urgent Circular</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select 
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select 
                  className="form-select"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                >
                  <option value="ALL">Everyone (College-wide)</option>
                  <option value="STUDENTS">Students Only</option>
                  <option value="TEACHERS">Faculty Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notice Content & Details</label>
                <textarea 
                  className="form-textarea"
                  rows={4}
                  required
                  placeholder="Type the full body of the institutional circular..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Broadcasting...' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
