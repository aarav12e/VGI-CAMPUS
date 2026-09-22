import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle2, 
  X
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentNumber: '',
    rollNumber: '',
    departmentId: '',
    programId: '',
    batchId: '',
    semesterId: '',
    sectionId: '',
    hostelRoom: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchDropdowns();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await apiRequest(`/students${query}`);
    if (res.success && res.data) {
      setStudents(res.data);
    }
    setLoading(false);
  }

  async function fetchDropdowns() {
    const [dRes, pRes, sRes, secRes] = await Promise.all([
      apiRequest('/academic/departments'),
      apiRequest('/academic/programs'),
      apiRequest('/academic/semesters'),
      apiRequest('/academic/sections')
    ]);

    if (dRes.success) setDepartments(dRes.data);
    if (pRes.success) setPrograms(pRes.data);
    if (sRes.success) setSemesters(sRes.data);
    if (secRes.success) setSections(secRes.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      ...formData,
      batchId: programs.find(p => p.id === formData.programId)?.batches[0]?.id || ''
    };

    const res = await apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.success) {
      setMessage({ type: 'success', text: `Student ${formData.fullName} enrolled successfully!` });
      setShowModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        enrollmentNumber: '',
        rollNumber: '',
        departmentId: '',
        programId: '',
        batchId: '',
        semesterId: '',
        sectionId: '',
        hostelRoom: ''
      });
      fetchStudents();
    } else {
      setMessage({ type: 'error', text: res.error?.message || 'Failed to enroll student' });
    }
    setSubmitting(false);
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Student Academic Directory</h1>
          <p className="page-subtitle">Manage institutional enrollment, academic progress, and student credentials</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          Enroll New Student
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

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by student name, enrollment no, or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
          />
        </div>
        <button onClick={fetchStudents} className="btn btn-secondary">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Students Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Identity</th>
              <th>Enrollment & Roll</th>
              <th>Program & Dept</th>
              <th>Semester & Section</th>
              <th>Hostel Room</th>
              <th>Cumulative CGPA</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Loading students records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}>
                        {student.user.fullName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{student.user.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>{student.rollNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{student.enrollmentNumber}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{student.program.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{student.department.code}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">Sem {student.semester.number}</span>
                    <span style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.section.name}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: student.hostelRoom ? 'var(--text-main)' : 'var(--text-dim)' }}>
                      {student.hostelRoom || 'Day Scholar'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: student.cgpa >= 8.5 ? '#34d399' : student.cgpa >= 7.0 ? '#60a5fa' : '#fbbf24' }}>
                      {student.cgpa.toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enroll Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enroll New Student</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Vikramaditya Gupta"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Institutional Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    placeholder="e.g. vikram.gupta@vgi.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. 24DS004"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Enrollment Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. ENR2024004"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                <div className="form-group">
                  <label className="form-label">Program</label>
                  <select 
                    className="form-select"
                    required
                    value={formData.programId}
                    onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select 
                    className="form-select"
                    required
                    value={formData.semesterId}
                    onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(s => (
                      <option key={s.id} value={s.id}>Semester {s.number} ({s.academicYear.name})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Section</label>
                  <select 
                    className="form-select"
                    required
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  >
                    <option value="">Select Section</option>
                    {sections.map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hostel Allocation (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Aryabhata - Room 205 (Bed 1)"
                  value={formData.hostelRoom}
                  onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Registering...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
