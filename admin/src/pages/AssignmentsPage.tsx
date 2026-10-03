import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  Award, 
  Send, 
  ExternalLink, 
  BookOpen, 
  Users,
  Smartphone,
  Eye
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // New Assignment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newSectionId, setNewSectionId] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState('50');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [createMsg, setCreateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Submissions Drawer Modal
  const [activeAssignment, setActiveAssignment] = useState<any | null>(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [gradeMsg, setGradeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    const [assignRes, subRes, secRes] = await Promise.all([
      apiRequest('/assignments'),
      apiRequest('/academic/subjects'),
      apiRequest('/academic/sections')
    ]);

    if (assignRes.success && assignRes.data) {
      setAssignments(assignRes.data);
    }
    if (subRes.success && subRes.data) {
      setSubjects(subRes.data);
      if (subRes.data.length > 0) setNewSubjectId(subRes.data[0].id);
    }
    if (secRes.success && secRes.data) {
      setSections(secRes.data);
      if (secRes.data.length > 0) setNewSectionId(secRes.data[0].id);
    }

    // Default due date: 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setNewDueDate(nextWeek.toISOString().slice(0, 16));

    setLoading(false);
  }

  async function handleFilter() {
    setLoading(true);
    let url = '/assignments?';
    if (selectedSubject) url += `subjectId=${selectedSubject}&`;
    if (selectedSection) url += `sectionId=${selectedSection}&`;
    const res = await apiRequest(url);
    if (res.success && res.data) {
      setAssignments(res.data);
    }
    setLoading(false);
  }

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateMsg(null);

    const res = await apiRequest('/assignments', {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle,
        description: newDesc,
        subjectId: newSubjectId,
        sectionId: newSectionId,
        dueDate: new Date(newDueDate).toISOString(),
        maxMarks: Number(newMaxMarks),
        attachmentUrl: newAttachmentUrl || 'https://vgi.ac.in/materials/sample_assignment.pdf'
      })
    });

    if (res.success) {
      setCreateMsg({ type: 'success', text: '✓ Assignment published! Instantly synced to student mobile apps.' });
      setTimeout(() => {
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        setCreateMsg(null);
        loadInitialData();
      }, 1200);
    } else {
      setCreateMsg({ type: 'error', text: res.error?.message || 'Failed to publish assignment' });
    }
    setCreating(false);
  }

  async function openSubmissions(assignment: any) {
    setActiveAssignment(assignment);
    setSelectedSubmission(null);
    setGradeMsg(null);
    setSubmissionsLoading(true);
    const res = await apiRequest(`/assignments/${assignment.id}`);
    if (res.success && res.data) {
      setActiveAssignment(res.data);
    }
    setSubmissionsLoading(false);
  }

  function handleSelectSubmission(sub: any) {
    setSelectedSubmission(sub);
    setGradeMarks(sub.marks ? String(sub.marks) : '');
    setGradeFeedback(sub.feedback || '');
    setGradeMsg(null);
  }

  async function handleGradeSubmission(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission) return;
    setGrading(true);
    setGradeMsg(null);

    const res = await apiRequest(`/assignments/submissions/${selectedSubmission.id}/grade`, {
      method: 'POST',
      body: JSON.stringify({
        marks: Number(gradeMarks),
        feedback: gradeFeedback
      })
    });

    if (res.success) {
      setGradeMsg({ type: 'success', text: '✓ Grade & feedback saved! Live notification pushed to student.' });
      // Update local state
      if (activeAssignment && activeAssignment.submissions) {
        const updated = activeAssignment.submissions.map((s: any) => 
          s.id === selectedSubmission.id 
            ? { ...s, marks: Number(gradeMarks), feedback: gradeFeedback, status: 'GRADED' }
            : s
        );
        setActiveAssignment({ ...activeAssignment, submissions: updated });
      }
    } else {
      setGradeMsg({ type: 'error', text: res.error?.message || 'Grading failed' });
    }
    setGrading(false);
  }

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = searchQuery === '' || 
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject?.code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">Assignments & Grading Suite</h1>
            <span className="badge badge-success">
              <Smartphone size={12} />
              Mobile App Sync Active
            </span>
          </div>
          <p className="page-subtitle">Publish coursework, inspect student submissions, and award grades synchronized directly to students' phones</p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Create New Assignment
        </button>
      </div>

      {/* Filter Row */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search assignments or subjects..."
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '180px' }}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">All Sections</option>
            {sections.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </select>

          <button onClick={handleFilter} className="btn btn-secondary">
            <Filter size={15} />
            Filter
          </button>
        </div>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading assignments and submission rosters...
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileText size={42} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3>No assignments found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Click "Create New Assignment" above to assign problem sets or project briefs to students.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredAssignments.map(a => {
            const isDueSoon = new Date(a.dueDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
            return (
              <div key={a.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">
                    <BookOpen size={12} />
                    {a.subject?.code || 'SUB'} • {a.section?.name || 'Section'}
                  </span>
                  <span className={`badge ${isDueSoon ? 'badge-warning' : 'badge-secondary'}`}>
                    <Clock size={12} />
                    Due {new Date(a.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {a.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.description || 'No description provided.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }}>
                      {a.teacher?.user?.fullName ? a.teacher.user.fullName[0] : 'F'}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {a.teacher?.user?.fullName || 'Faculty'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Max Marks</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{a.maxMarks || 100} pts</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Users size={14} />
                    <span><strong>{a.submissionCount || (a.submissions ? a.submissions.length : 0)}</strong> Submissions</span>
                  </div>

                  <button 
                    onClick={() => openSubmissions(a)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <Eye size={14} />
                    View & Grade
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => !creating && setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Course Assignment</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pushes to all enrolled student devices in real-time</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary" 
                style={{ padding: '0.35rem 0.7rem' }}
              >
                ✕
              </button>
            </div>

            {createMsg && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: createMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: createMsg.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${createMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {createMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Relational Decomposition & Normalization Lab"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select 
                    required 
                    className="form-select"
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Section *</label>
                  <select 
                    required 
                    className="form-select"
                    value={newSectionId}
                    onChange={(e) => setNewSectionId(e.target.value)}
                  >
                    {sections.map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Submission Due Date *</label>
                  <input 
                    type="datetime-local" 
                    required
                    className="form-input"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Marks</label>
                  <input 
                    type="number" 
                    min="10"
                    max="100"
                    className="form-input"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Instructions</label>
                <textarea 
                  rows={3}
                  className="form-textarea"
                  placeholder="Provide submission guidelines, test cases, or expected report format..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reference Material URL (PDF / Problem Document)</label>
                <input 
                  type="url" 
                  placeholder="https://vgi.ac.in/materials/assignment1.pdf"
                  className="form-input"
                  value={newAttachmentUrl}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  disabled={creating}
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="btn btn-primary"
                >
                  <Send size={15} />
                  {creating ? 'Publishing...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSIONS & GRADING DRAWER */}
      {activeAssignment && (
        <div className="modal-overlay" onClick={() => setActiveAssignment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', width: '95%' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                  {activeAssignment.subject?.code} • {activeAssignment.section?.name}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{activeAssignment.title}</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Max Marks: <strong>{activeAssignment.maxMarks}</strong> • Due: {new Date(activeAssignment.dueDate).toLocaleString()}
                </div>
              </div>
              <button 
                onClick={() => setActiveAssignment(null)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem' }}
              >
                Close
              </button>
            </div>

            {submissionsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading student submissions...
              </div>
            ) : !activeAssignment.submissions || activeAssignment.submissions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={32} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
                <p>No student submissions recorded yet for this assignment.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Students submit work directly via the VGI Mobile app.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: selectedSubmission ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
                {/* Roster List */}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    Student Submissions ({activeAssignment.submissions.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {activeAssignment.submissions.map((sub: any) => {
                      const isSelected = selectedSubmission?.id === sub.id;
                      const isGraded = sub.status === 'GRADED';
                      return (
                        <div 
                          key={sub.id}
                          onClick={() => handleSelectSubmission(sub)}
                          style={{
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                            background: isSelected ? 'rgba(37, 99, 235, 0.04)' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                              {sub.student?.user?.fullName || 'Student'}
                            </div>
                            <span className={`badge ${isGraded ? 'badge-success' : 'badge-warning'}`}>
                              {isGraded ? `✓ Graded (${sub.marks}/${activeAssignment.maxMarks})` : 'Pending Review'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            <span>Roll: {sub.student?.rollNumber || 'N/A'}</span>
                            <span>{new Date(sub.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grading Panel */}
                {selectedSubmission && (
                  <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                      Review & Grade Submission
                    </div>

                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>STUDENT WORK</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        "{selectedSubmission.content || 'Submission file uploaded.'}"
                      </div>
                      {selectedSubmission.fileUrl && (
                        <a 
                          href={selectedSubmission.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                        >
                          <ExternalLink size={13} />
                          Open Submitted Document
                        </a>
                      )}
                    </div>

                    {gradeMsg && (
                      <div style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        fontSize: '0.8rem',
                        background: gradeMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: gradeMsg.type === 'success' ? '#059669' : '#dc2626',
                        border: `1px solid ${gradeMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                      }}>
                        {gradeMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleGradeSubmission}>
                      <div className="form-group">
                        <label className="form-label">
                          Award Marks (out of {activeAssignment.maxMarks}) *
                        </label>
                        <input 
                          type="number"
                          required
                          min="0"
                          max={activeAssignment.maxMarks}
                          className="form-input"
                          placeholder="e.g. 48"
                          value={gradeMarks}
                          onChange={(e) => setGradeMarks(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Faculty Feedback & Comments</label>
                        <textarea 
                          rows={3}
                          className="form-textarea"
                          placeholder="e.g. Excellent relational schema. Good attention to functional dependencies."
                          value={gradeFeedback}
                          onChange={(e) => setGradeFeedback(e.target.value)}
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={grading}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        <Award size={15} />
                        {grading ? 'Recording...' : 'Submit Grade & Notify Student'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
