import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Download, 
  ExternalLink, 
  FolderPlus, 
  Layers, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  Trash2,
  List
} from 'lucide-react';

export const SyllabusPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [syllabusUnits, setSyllabusUnits] = useState<any[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Unit Modal
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitNumber, setUnitNumber] = useState('1');
  const [unitTitle, setUnitTitle] = useState('');
  const [unitTopics, setUnitTopics] = useState('');
  const [savingUnit, setSavingUnit] = useState(false);
  const [unitMsg, setUnitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Material Modal
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matFileUrl, setMatFileUrl] = useState('');
  const [matFileType, setMatFileType] = useState('PDF');
  const [matUnitNumber, setMatUnitNumber] = useState('1');
  const [savingMat, setSavingMat] = useState(false);
  const [matMsg, setMatMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    const res = await apiRequest('/academic/subjects');
    if (res.success && res.data && res.data.length > 0) {
      setSubjects(res.data);
      setSelectedSubjectId(res.data[0].id);
      loadSubjectSyllabus(res.data[0].id);
    } else {
      setLoading(false);
    }
  }

  async function loadSubjectSyllabus(subjectId: string) {
    setLoading(true);
    const res = await apiRequest(`/syllabus/subject/${subjectId}`);
    if (res.success && res.data) {
      setSyllabusUnits(res.data.units || []);
      setStudyMaterials(res.data.studyMaterials || []);
    }
    setLoading(false);
  }

  function handleSubjectChange(subId: string) {
    setSelectedSubjectId(subId);
    loadSubjectSyllabus(subId);
  }

  async function handleCreateUnit(e: React.FormEvent) {
    e.preventDefault();
    setSavingUnit(true);
    setUnitMsg(null);

    // Parse topics from comma/line separated string
    const topicsArray = unitTopics
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const res = await apiRequest('/syllabus/units', {
      method: 'POST',
      body: JSON.stringify({
        subjectId: selectedSubjectId,
        unitNumber: Number(unitNumber),
        title: unitTitle,
        topics: topicsArray.length > 0 ? topicsArray : [unitTitle]
      })
    });

    if (res.success) {
      setUnitMsg({ type: 'success', text: '✓ Syllabus unit added! Mobile students can now view this unit.' });
      setTimeout(() => {
        setShowUnitModal(false);
        setUnitTitle('');
        setUnitTopics('');
        setUnitMsg(null);
        loadSubjectSyllabus(selectedSubjectId);
      }, 1200);
    } else {
      setUnitMsg({ type: 'error', text: res.error?.message || 'Failed to save unit' });
    }
    setSavingUnit(false);
  }

  async function handleCreateMaterial(e: React.FormEvent) {
    e.preventDefault();
    setSavingMat(true);
    setMatMsg(null);

    const res = await apiRequest('/syllabus/materials', {
      method: 'POST',
      body: JSON.stringify({
        subjectId: selectedSubjectId,
        title: matTitle,
        description: matDesc,
        fileUrl: matFileUrl,
        fileType: matFileType,
        unitNumber: matUnitNumber ? Number(matUnitNumber) : undefined
      })
    });

    if (res.success) {
      setMatMsg({ type: 'success', text: '✓ Study material published! Available for student download on Mobile.' });
      setTimeout(() => {
        setShowMaterialModal(false);
        setMatTitle('');
        setMatDesc('');
        setMatFileUrl('');
        setMatMsg(null);
        loadSubjectSyllabus(selectedSubjectId);
      }, 1200);
    } else {
      setMatMsg({ type: 'error', text: res.error?.message || 'Failed to upload material' });
    }
    setSavingMat(false);
  }

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 className="page-title">Curriculum Syllabus & Courseware</h1>
            <span className="badge badge-success">
              <Smartphone size={12} />
              Mobile App Sync Active
            </span>
          </div>
          <p className="page-subtitle">Publish unit course outcomes, syllabus roadmaps, and digital lecture notes directly to student phones</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowUnitModal(true)}
            className="btn btn-secondary"
          >
            <Layers size={16} />
            Add Syllabus Unit
          </button>
          <button 
            onClick={() => setShowMaterialModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Publish Study Material
          </button>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen size={20} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Active Course Module</div>
            <select 
              className="form-select" 
              style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '320px' }}
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name} ({s.credits} Credits • {s.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSubject && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="badge badge-primary">
              {selectedSubject.program?.code || 'BTECH'} • Sem {selectedSubject.semesterNumber || 5}
            </span>
            <span className="badge badge-secondary">
              {syllabusUnits.length} Units Defined
            </span>
            <span className="badge badge-success">
              {studyMaterials.length} Study Notes Published
            </span>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading course syllabus and digital library...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          {/* Left Column: Syllabus Units */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--primary)" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Syllabus Breakdown</h2>
              </div>
              <button 
                onClick={() => setShowUnitModal(true)}
                className="btn btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                + Add Unit
              </button>
            </div>

            {syllabusUnits.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <Layers size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
                <h4>No syllabus units created yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Define Unit 1 through Unit 5 to populate the student Mobile syllabus view.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {syllabusUnits
                  .sort((a, b) => a.unitNumber - b.unitNumber)
                  .map((unit) => {
                    let topics: string[] = [];
                    try {
                      topics = typeof unit.topics === 'string' ? JSON.parse(unit.topics) : unit.topics;
                      if (!Array.isArray(topics)) topics = [String(topics)];
                    } catch (e) {
                      topics = [unit.topics];
                    }

                    return (
                      <div key={unit.id} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span className="badge badge-primary">UNIT {unit.unitNumber}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {topics.length} Key Topics
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                          {unit.title}
                        </h3>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {topics.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Right Column: Published Study Materials */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#059669" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Digital Materials & Notes</h2>
              </div>
              <button 
                onClick={() => setShowMaterialModal(true)}
                className="btn btn-secondary" 
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                + Upload Notes
              </button>
            </div>

            {studyMaterials.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <FileText size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
                <h4>No study materials uploaded</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Publish lecture slides, reference guides, or question banks for students.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {studyMaterials.map((mat) => (
                  <div key={mat.id} className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span className="badge badge-success">
                        {mat.fileType || 'PDF'} • Unit {mat.unitNumber || 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {new Date(mat.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.975rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      {mat.title}
                    </h4>

                    {mat.description && (
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {mat.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        By {mat.teacher?.user?.fullName || 'Faculty'}
                      </span>
                      <a 
                        href={mat.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.7rem', fontSize: '0.775rem', textDecoration: 'none' }}
                      >
                        <Download size={13} />
                        View / Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD SYLLABUS UNIT MODAL */}
      {showUnitModal && (
        <div className="modal-overlay" onClick={() => !savingUnit && setShowUnitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Syllabus Unit</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Define curriculum outcomes for this course</p>
              </div>
              <button onClick={() => setShowUnitModal(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>✕</button>
            </div>

            {unitMsg && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: unitMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: unitMsg.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${unitMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {unitMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateUnit}>
              <div className="form-group">
                <label className="form-label">Unit Number</label>
                <input 
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="form-input"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Relational Data Model & Concurrency Control"
                  className="form-input"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Topics (One per line) *</label>
                <textarea 
                  rows={4}
                  required
                  className="form-textarea"
                  placeholder="Relational Algebra&#10;SQL Subqueries & Views&#10;ACID Properties&#10;Two-Phase Locking Protocol"
                  value={unitTopics}
                  onChange={(e) => setUnitTopics(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowUnitModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={savingUnit} className="btn btn-primary">
                  {savingUnit ? 'Saving...' : 'Save Syllabus Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLISH STUDY MATERIAL MODAL */}
      {showMaterialModal && (
        <div className="modal-overlay" onClick={() => !savingMat && setShowMaterialModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Publish Course Notes & Reference</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Uploaded materials are immediately downloadable on student phones</p>
              </div>
              <button onClick={() => setShowMaterialModal(false)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>✕</button>
            </div>

            {matMsg && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: matMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: matMsg.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${matMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {matMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateMaterial}>
              <div className="form-group">
                <label className="form-label">Material Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Comprehensive Normalization Guide"
                  className="form-input"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">File Format</label>
                  <select 
                    className="form-select"
                    value={matFileType}
                    onChange={(e) => setMatFileType(e.target.value)}
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPT">Presentation (PPT)</option>
                    <option value="DOC">Word Document (DOC)</option>
                    <option value="ZIP">Code / Lab Archive (ZIP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Related Unit</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Unit 1"
                    className="form-input"
                    value={matUnitNumber}
                    onChange={(e) => setMatUnitNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">File Download URL *</label>
                <input 
                  type="url"
                  required
                  placeholder="https://vgi.ac.in/materials/dbms_unit3.pdf"
                  className="form-input"
                  value={matFileUrl}
                  onChange={(e) => setMatFileUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overview & Summary</label>
                <textarea 
                  rows={2}
                  className="form-textarea"
                  placeholder="Key concepts, sample problems, and solved university questions..."
                  value={matDesc}
                  onChange={(e) => setMatDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowMaterialModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={savingMat} className="btn btn-primary">
                  {savingMat ? 'Publishing...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
