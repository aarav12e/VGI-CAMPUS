import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  CalendarClock, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  X 
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Add Slot Modal
  const [showModal, setShowModal] = useState(false);
  const [slotData, setSlotData] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    subjectId: '',
    teacherId: '',
    sectionId: '',
    roomName: 'Lecture Hall LT-101'
  });
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    setLoading(true);
    const [secRes, tRes, subRes] = await Promise.all([
      apiRequest('/academic/sections'),
      apiRequest('/teachers'),
      apiRequest('/academic/subjects')
    ]);

    if (secRes.success && secRes.data && secRes.data.length > 0) {
      setSections(secRes.data);
      setSelectedSection(secRes.data[0].id);
      fetchSchedule(secRes.data[0].id);
    }
    if (tRes.success) setTeachers(tRes.data);
    if (subRes.success) setSubjects(subRes.data);
    setLoading(false);
  }

  async function fetchSchedule(secId: string) {
    const res = await apiRequest(`/timetable?sectionId=${secId}`);
    if (res.success && res.data) {
      setTimetable(res.data);
    }
  }

  function handleSectionChange(secId: string) {
    setSelectedSection(secId);
    fetchSchedule(secId);
  }

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    setConflictError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    const res = await apiRequest('/timetable', {
      method: 'POST',
      body: JSON.stringify({
        ...slotData,
        sectionId: slotData.sectionId || selectedSection
      })
    });

    if (res.success) {
      setSuccessMsg('Lecture slot scheduled successfully with zero conflicts!');
      setShowModal(false);
      fetchSchedule(selectedSection);
    } else {
      setConflictError(res.error?.message || 'Schedule conflict detected');
    }
    setSubmitting(false);
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm('Remove this lecture slot from schedule?')) return;
    const res = await apiRequest(`/timetable/${id}`, { method: 'DELETE' });
    if (res.success) {
      fetchSchedule(selectedSection);
    }
  }

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title">Timetable & Schedule Engine</h1>
          <p className="page-subtitle">Real-time timetable orchestrator with automated multi-resource conflict detection</p>
        </div>
        <button 
          onClick={() => {
            setConflictError(null);
            setSlotData({ ...slotData, sectionId: selectedSection });
            setShowModal(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} />
          Schedule Lecture Slot
        </button>
      </div>

      {successMsg && (
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
          {successMsg}
        </div>
      )}

      {/* Section Filter Selector */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Select Section:</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleSectionChange(sec.id)}
              className={selectedSection === sec.id ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            >
              {sec.semester.batch.program.code} • Sem {sec.semester.number} ({sec.name})
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {daysOfWeek.map((day) => {
          const daySlots = timetable.filter(t => t.dayOfWeek === day);
          return (
            <div key={day} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#60a5fa' }}>{day}</h3>
                <span className="badge badge-primary">{daySlots.length} Classes</span>
              </div>

              {daySlots.length === 0 ? (
                <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                  No classes scheduled for this day.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {daySlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary">{slot.subject.code}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: '#34d399', fontWeight: 600 }}>
                          <Clock size={13} />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        {slot.subject.name}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={13} color="#94a3b8" />
                          <span>{slot.teacher.user.fullName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={13} color="#94a3b8" />
                          <span>{slot.roomName}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="btn btn-danger"
                        style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                        title="Delete slot"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Slot Modal with Conflict Detection Alert */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Schedule Lecture Slot</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {conflictError && (
              <div style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                gap: '0.6rem'
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Conflict Detected:</strong>
                  <div>{conflictError}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Day of Week</label>
                <select 
                  className="form-select"
                  value={slotData.dayOfWeek}
                  onChange={(e) => setSlotData({ ...slotData, dayOfWeek: e.target.value })}
                >
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    required 
                    value={slotData.startTime}
                    onChange={(e) => setSlotData({ ...slotData, startTime: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    required 
                    value={slotData.endTime}
                    onChange={(e) => setSlotData({ ...slotData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select 
                  className="form-select"
                  required
                  value={slotData.subjectId}
                  onChange={(e) => setSlotData({ ...slotData, subjectId: e.target.value })}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Instructor / Teacher</label>
                <select 
                  className="form-select"
                  required
                  value={slotData.teacherId}
                  onChange={(e) => setSlotData({ ...slotData, teacherId: e.target.value })}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.user.fullName} ({t.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Classroom / Laboratory</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Lecture Hall LT-101"
                  value={slotData.roomName}
                  onChange={(e) => setSlotData({ ...slotData, roomName: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Verifying & Saving...' : 'Save Schedule Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
