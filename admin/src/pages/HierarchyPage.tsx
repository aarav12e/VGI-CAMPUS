import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Layers, 
  Building2, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  UserCheck, 
  Trash2,
  ChevronRight
} from 'lucide-react';

export const HierarchyPage: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Teaching Assignment form
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [dRes, pRes, subRes, tRes, secRes, aRes] = await Promise.all([
      apiRequest('/academic/departments'),
      apiRequest('/academic/programs'),
      apiRequest('/academic/subjects'),
      apiRequest('/teachers'),
      apiRequest('/academic/sections'),
      apiRequest('/teaching-assignments')
    ]);

    if (dRes.success) setDepartments(dRes.data);
    if (pRes.success) setPrograms(pRes.data);
    if (subRes.success) setSubjects(subRes.data);
    if (tRes.success) setTeachers(tRes.data);
    if (secRes.success) setSections(secRes.data);
    if (aRes.success) setAssignments(aRes.data);
    setLoading(false);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeacher || !selectedSubject || !selectedSection) return;

    setAssigning(true);
    setMessage(null);

    const res = await apiRequest('/teaching-assignments', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: selectedTeacher,
        subjectId: selectedSubject,
        sectionId: selectedSection
      })
    });

    if (res.success) {
      setMessage({ type: 'success', text: 'Teaching assignment created successfully!' });
      setSelectedTeacher('');
      setSelectedSubject('');
      setSelectedSection('');
      loadData();
    } else {
      setMessage({ type: 'error', text: res.error?.message || 'Assignment failed' });
    }
    setAssigning(false);
  }

  async function handleDeleteAssignment(id: string) {
    if (!confirm('Are you sure you want to remove this teaching assignment?')) return;
    const res = await apiRequest(`/teaching-assignments/${id}`, { method: 'DELETE' });
    if (res.success) {
      loadData();
    }
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Academic Hierarchy & Allocations</h1>
        <p className="page-subtitle">Configure institutional structure: Departments, Programs, Curricula, and Faculty Teaching Allocations</p>
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

      {/* Teaching Allocation Builder (PRD Section 27) */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <UserCheck size={20} color="#3b82f6" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Faculty Teaching Allocation Engine</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Dynamically bind faculty members to specific curriculum subjects and classroom sections for the current academic session.
        </p>

        <form onSubmit={handleAssign} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 160px', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Faculty</label>
            <select className="form-select" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} required>
              <option value="">Choose Teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.user.fullName} ({t.employeeId})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Curriculum Subject</label>
            <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
              <option value="">Choose Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.credits} Credits)</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Class Section</label>
            <select className="form-select" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} required>
              <option value="">Choose Section</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.semester.batch.program.code} • Sem {sec.semester.number} • {sec.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={assigning} className="btn btn-primary" style={{ height: '42px' }}>
            <Plus size={16} />
            {assigning ? 'Assigning...' : 'Assign Class'}
          </button>
        </form>
      </div>

      {/* Active Teaching Allocations Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Teaching Assignments ({assignments.length})</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty Instructor</th>
                <th>Subject Code & Title</th>
                <th>Degree Program</th>
                <th>Section</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No teaching assignments configured yet.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.teacher.user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.teacher.employeeId} • {a.teacher.department.code}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.subject.name}</div>
                      <span className="badge badge-primary">{a.subject.code}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{a.subject.program.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-success">{a.section.name}</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteAssignment(a.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title="Delete assignment"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hierarchy Tree Visualization */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Institutional Hierarchy Architecture</h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Real-time structural decomposition based on PRD Section 5: Core Academic Hierarchy
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {departments.map((dept) => (
            <div key={dept.id} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="#3b82f6" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dept.name}</span>
                  <span className="badge badge-primary">{dept.code}</span>
                </div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                  {dept._count.teachers} Teachers • {dept._count.students} Students
                </span>
              </div>

              {/* Programs inside this Department */}
              <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {dept.programs?.map((prog: any) => (
                  <div key={prog.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <ChevronRight size={14} color="#60a5fa" />
                      <strong>{prog.name}</strong> ({prog.code})
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{prog.durationYears} Years</span>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Semester 5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
