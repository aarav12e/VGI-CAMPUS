import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Users, 
  Plus, 
  BookOpen, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle2, 
  X
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    departmentId: '',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  async function fetchTeachers() {
    setLoading(true);
    const res = await apiRequest('/teachers');
    if (res.success && res.data) {
      setTeachers(res.data);
    }
    setLoading(false);
  }

  async function fetchDepartments() {
    const res = await apiRequest('/academic/departments');
    if (res.success) setDepartments(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const res = await apiRequest('/teachers', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success) {
      setMessage({ type: 'success', text: `Faculty ${formData.fullName} added successfully!` });
      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        employeeId: '',
        departmentId: '',
        designation: 'Assistant Professor',
        qualification: 'Ph.D. in Computer Science'
      });
      fetchTeachers();
    } else {
      setMessage({ type: 'error', text: res.error?.message || 'Failed to add faculty' });
    }
    setSubmitting(false);
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Faculty & Teachers</h1>
          <p className="page-subtitle">Manage professor appointments, qualifications, and teaching course loads</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Add Faculty Member
        </button>
      </div>

      {message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          {message.text}
        </div>
      )}

      {/* Teachers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading faculty members...</div>
        ) : teachers.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>No teachers found.</div>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="stat-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}>
                    {teacher.user.fullName[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{teacher.user.fullName}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{teacher.designation}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{teacher.department.name}</div>
                  </div>
                </div>
                <span className="badge badge-primary">{teacher.employeeId}</span>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>QUALIFICATIONS</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{teacher.qualification}</div>
              </div>

              {/* Teaching Assignments */}
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Assigned Teaching Load ({teacher.teachingAssignments?.length || 0} classes)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {teacher.teachingAssignments && teacher.teachingAssignments.length > 0 ? (
                    teacher.teachingAssignments.map((a: any) => (
                      <span key={a.id} className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {a.subject.code} • {a.section.name}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>No current teaching load</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Appoint Faculty Member</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name & Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Dr. Ramesh Chander"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    placeholder="e.g. ramesh.c@vgi.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. EMP004"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select 
                  className="form-select"
                  required
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Registering...' : 'Appoint Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
