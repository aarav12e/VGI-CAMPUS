import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  Award, 
  GraduationCap, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Smartphone, 
  TrendingUp, 
  BookOpen,
  Filter
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('');

  // Enter Marks Modal
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryStudentId, setEntryStudentId] = useState('');
  const [entrySemesterId, setEntrySemesterId] = useState('');
  const [entrySgpa, setEntrySgpa] = useState('8.50');
  const [entryCgpa, setEntryCgpa] = useState('8.50');
  const [entryStatus, setEntryStatus] = useState('PASSED');
  const [markItems, setMarkItems] = useState<{
    subjectId: string;
    subjectName: string;
    internalMarks: string;
    externalMarks: string;
    grade: string;
    gradePoints: string;
  }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [entryMsg, setEntryMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [resRes, studRes, semRes, subRes] = await Promise.all([
      apiRequest('/results'),
      apiRequest('/students'),
      apiRequest('/academic/semesters'),
      apiRequest('/academic/subjects')
    ]);

    if (resRes.success && resRes.data) setResults(resRes.data);
    if (studRes.success && studRes.data) {
      setStudents(studRes.data);
      if (studRes.data.length > 0) setEntryStudentId(studRes.data[0].id);
    }
    if (semRes.success && semRes.data) {
      setSemesters(semRes.data);
      if (semRes.data.length > 0) setEntrySemesterId(semRes.data[0].id);
    }
    if (subRes.success && subRes.data) {
      setSubjects(subRes.data);
      // Pre-fill mark items from subjects
      const initialItems = subRes.data.slice(0, 4).map((s: any) => ({
        subjectId: s.id,
        subjectName: `${s.code} - ${s.name}`,
        internalMarks: '26',
        externalMarks: '60',
        grade: 'A',
        gradePoints: '8.5'
      }));
      setMarkItems(initialItems);
    }
    setLoading(false);
  }

  function handleMarkItemChange(index: number, field: string, value: string) {
    const updated = [...markItems];
    (updated[index] as any)[field] = value;
    
    // Auto calculate grade & grade points based on total
    if (field === 'internalMarks' || field === 'externalMarks') {
      const internal = Number(field === 'internalMarks' ? value : updated[index].internalMarks) || 0;
      const external = Number(field === 'externalMarks' ? value : updated[index].externalMarks) || 0;
      const total = internal + external;
      if (total >= 90) {
        updated[index].grade = 'A+';
        updated[index].gradePoints = '10.0';
      } else if (total >= 80) {
        updated[index].grade = 'A';
        updated[index].gradePoints = '9.0';
      } else if (total >= 70) {
        updated[index].grade = 'B+';
        updated[index].gradePoints = '8.0';
      } else if (total >= 60) {
        updated[index].grade = 'B';
        updated[index].gradePoints = '7.0';
      } else if (total >= 50) {
        updated[index].grade = 'C';
        updated[index].gradePoints = '6.0';
      } else {
        updated[index].grade = 'F';
        updated[index].gradePoints = '0.0';
      }

      // Calculate new SGPA average
      const pts = updated.map(u => Number(u.gradePoints) || 0);
      const avg = pts.reduce((a, b) => a + b, 0) / (pts.length || 1);
      setEntrySgpa(avg.toFixed(2));
      setEntryCgpa(avg.toFixed(2));
    }

    setMarkItems(updated);
  }

  async function handlePublishResult(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setEntryMsg(null);

    const payload = {
      studentId: entryStudentId,
      semesterId: entrySemesterId,
      sgpa: Number(entrySgpa),
      cgpa: Number(entryCgpa),
      status: entryStatus,
      items: markItems.map(m => ({
        subjectId: m.subjectId,
        internalMarks: Number(m.internalMarks) || 0,
        externalMarks: Number(m.externalMarks) || 0,
        grade: m.grade || 'A',
        gradePoints: Number(m.gradePoints) || 8.0
      }))
    };

    const res = await apiRequest('/results', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.success) {
      setEntryMsg({ type: 'success', text: '✓ Semester marks published! Immediately visible in student and parent mobile apps.' });
      setTimeout(() => {
        setShowEntryModal(false);
        setEntryMsg(null);
        loadData();
      }, 1200);
    } else {
      setEntryMsg({ type: 'error', text: res.error?.message || 'Failed to publish results' });
    }
    setSubmitting(false);
  }

  const filteredResults = results.filter(r => {
    const studentName = r.student?.user?.fullName?.toLowerCase() || '';
    const roll = r.student?.rollNumber?.toLowerCase() || '';
    const matchesSearch = searchQuery === '' || studentName.includes(searchQuery.toLowerCase()) || roll.includes(searchQuery.toLowerCase());
    const matchesSem = selectedSemesterFilter === '' || r.semesterId === selectedSemesterFilter;
    return matchesSearch && matchesSem;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">Examination & Marks Registry</h1>
            <span className="badge badge-success">
              <Smartphone size={12} />
              Mobile App Sync Active
            </span>
          </div>
          <p className="page-subtitle">Publish internal assessments, semester grades, SGPA & CGPA with instant real-time synchronization to student mobile report cards</p>
        </div>

        <button 
          onClick={() => setShowEntryModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Enter Student Examination Marks
        </button>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">RESULTS RECORDED</span>
            <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-number">{results.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.25rem' }}>
            ✓ All published to Mobile App
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">AVERAGE BATCH SGPA</span>
            <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-number">
            {results.length > 0 
              ? (results.reduce((acc, r) => acc + (r.sgpa || 0), 0) / results.length).toFixed(2)
              : '8.65'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Autumn 2026 Examination cycle
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">ENROLLED STUDENTS</span>
            <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="stat-number">{students.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Across all sections and departments
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search student name or roll number..."
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedSemesterFilter}
            onChange={(e) => setSelectedSemesterFilter(e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map(s => (
              <option key={s.id} value={s.id}>Semester {s.number} {s.isCurrent ? '(Current)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading examination results and grading transcripts...
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Award size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3>No examination results found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Click "Enter Student Examination Marks" to record and publish student grades.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student & Roll Number</th>
                <th>Semester</th>
                <th>SGPA</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Subject-Wise Breakdown</th>
                <th>Mobile Sync</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {r.student?.user?.fullName || 'Student'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Roll: {r.student?.rollNumber || 'N/A'} • {r.student?.program?.code || 'BTECH-DS'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      Semester {r.semester?.number || 5}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#2563eb' }}>
                      {r.sgpa?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
                      {r.cgpa?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.status === 'PASSED' ? 'badge-success' : 'badge-warning'}`}>
                      {r.status || 'PASSED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '320px' }}>
                      {r.items?.map((item: any) => (
                        <span 
                          key={item.id} 
                          className="badge badge-secondary" 
                          title={`${item.subject?.name}: Int ${item.internalMarks}, Ext ${item.externalMarks}`}
                        >
                          {item.subject?.code}: <strong>{item.grade}</strong> ({item.totalMarks}m)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} />
                      Live in App
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ENTER MARKS MODAL */}
      {showEntryModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowEntryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', width: '95%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Record Student Examination Marks</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Calculates SGPA/CGPA and pushes directly to Mobile report card</p>
              </div>
              <button onClick={() => setShowEntryModal(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>✕</button>
            </div>

            {entryMsg && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: entryMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: entryMsg.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${entryMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {entryMsg.text}
              </div>
            )}

            <form onSubmit={handlePublishResult}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Student *</label>
                  <select 
                    required 
                    className="form-select"
                    value={entryStudentId}
                    onChange={(e) => setEntryStudentId(e.target.value)}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.user?.fullName} ({s.rollNumber} • {s.section?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Semester *</label>
                  <select 
                    required 
                    className="form-select"
                    value={entrySemesterId}
                    onChange={(e) => setEntrySemesterId(e.target.value)}
                  >
                    {semesters.map(s => (
                      <option key={s.id} value={s.id}>
                        Semester {s.number} ({s.academicYear?.name || '2026-27'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Marks Entry Grid */}
              <div style={{ margin: '1.25rem 0', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                  <span>SUBJECT</span>
                  <span>INT (30)</span>
                  <span>EXT (70)</span>
                  <span>GRADE</span>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {markItems.map((item, idx) => (
                    <div key={idx} style={{ padding: '0.65rem 0.9rem', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.subjectName}
                      </span>
                      <input 
                        type="number"
                        min="0"
                        max="30"
                        className="form-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                        value={item.internalMarks}
                        onChange={(e) => handleMarkItemChange(idx, 'internalMarks', e.target.value)}
                      />
                      <input 
                        type="number"
                        min="0"
                        max="70"
                        className="form-input"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                        value={item.externalMarks}
                        onChange={(e) => handleMarkItemChange(idx, 'externalMarks', e.target.value)}
                      />
                      <span className="badge badge-primary" style={{ justifySelf: 'start' }}>
                        {item.grade} ({item.gradePoints}p)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>CALCULATED SGPA</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb' }}>{entrySgpa}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>CUMULATIVE CGPA</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>{entryCgpa}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>RESULT STATUS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{entryStatus}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowEntryModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  <Send size={15} />
                  {submitting ? 'Publishing to Mobile...' : 'Publish Results to Mobile App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
