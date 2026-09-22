import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  BookOpen, 
  Clock, 
  FileText, 
  Award, 
  UploadCloud, 
  ChevronRight,
  MapPin,
  User
} from 'lucide-react';

interface AcademicsProps {
  user: any;
}

export const AcademicsScreen: React.FC<AcademicsProps> = ({ user }) => {
  const [subTab, setSubTab] = useState<'attendance' | 'timetable' | 'subjects' | 'assignments' | 'results'>('attendance');
  const [attendance, setAttendance] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    const studentId = user?.student?.id;
    if (!studentId) return;

    const [attRes, ttRes, subRes, assRes, resRes] = await Promise.all([
      apiRequest(`/attendance/student/${studentId}`),
      apiRequest(`/timetable`),
      apiRequest(`/academic/subjects`),
      apiRequest(`/assignments`),
      apiRequest(`/results/student/${studentId}`)
    ]);

    if (attRes.success) setAttendance(attRes.data);
    if (ttRes.success) setTimetable(ttRes.data);
    if (subRes.success) setSubjects(subRes.data);
    if (assRes.success) setAssignments(assRes.data);
    if (resRes.success) setResults(resRes.data);
    setLoading(false);
  }

  async function handleQuickSubmit(assignmentId: string) {
    const res = await apiRequest(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        content: 'Completed laboratory assignment submission with source code.',
        fileUrl: 'https://vgi.ac.in/uploads/submissions/student_work.pdf'
      })
    });

    if (res.success) {
      setSubmitMsg('Assignment submitted successfully!');
      setTimeout(() => setSubmitMsg(null), 3000);
      loadData();
    }
  }

  return (
    <div>
      {/* Sub-navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1rem',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'attendance', label: 'Attendance' },
          { id: 'timetable', label: 'Timetable' },
          { id: 'subjects', label: 'Subjects' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'results', label: 'Results' }
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

      {submitMsg && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          fontSize: '0.8rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          {submitMsg}
        </div>
      )}

      {/* 1. ATTENDANCE TAB */}
      {subTab === 'attendance' && (
        <div>
          {/* Overall Attendance Card */}
          <div className="app-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              AGGREGATE ATTENDANCE
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: (attendance?.overallPercentage || 0) >= 75 ? '#34d399' : '#f87171', margin: '0.25rem 0' }}>
              {attendance?.overallPercentage || 84}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Attended {attendance?.totalPresent || 0} of {attendance?.totalSessions || 0} Lecture Sessions
            </div>
          </div>

          {/* Subject-wise Attendance */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Subject-Wise Attendance Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attendance?.subjectWise?.map((sub: any) => (
              <div key={sub.subjectId} className="app-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-blue" style={{ marginBottom: '0.3rem' }}>{sub.subjectCode}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{sub.subjectName}</h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: sub.percentage >= 75 ? '#34d399' : '#f87171' }}>
                      {sub.percentage}%
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {sub.presentSessions} / {sub.totalSessions} sessions
                    </div>
                  </div>
                </div>

                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${sub.percentage}%`,
                      background: sub.percentage >= 75 ? '#10b981' : '#ef4444'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TIMETABLE TAB */}
      {subTab === 'timetable' && (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Weekly Class Schedule
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {timetable.map((slot) => (
              <div key={slot.id} className="app-card" style={{ marginBottom: 0, borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="badge badge-blue">{slot.dayOfWeek}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    <Clock size={12} />
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{slot.subject.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <User size={12} />
                  <span>{slot.teacher.user.fullName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  <MapPin size={12} />
                  <span>Room: {slot.roomName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUBJECTS & SYLLABUS TAB */}
      {subTab === 'subjects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subjects.map((sub) => (
            <div key={sub.id} className="app-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-blue">{sub.code}</span>
                <span className="badge badge-green">{sub.credits} Credits</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{sub.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                Type: {sub.type} • Semester {sub.semesterNumber}
              </p>

              {sub.syllabusUnits && sub.syllabusUnits.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Syllabus Modules ({sub.syllabusUnits.length} Units)
                  </div>
                  {sub.syllabusUnits.map((u: any) => (
                    <div key={u.id} style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      • Unit {u.unitNumber}: {u.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. ASSIGNMENTS TAB */}
      {subTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {assignments.map((a) => (
            <div key={a.id} className="app-card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-blue">{a.subject?.code}</span>
                <span className={`badge ${a.mySubmission ? 'badge-green' : 'badge-yellow'}`}>
                  {a.mySubmission ? a.mySubmission.status : 'Pending Submission'}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{a.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{a.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                <span>Max Marks: {a.maxMarks}</span>
              </div>

              {a.mySubmission ? (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.75rem' }}>
                  <div style={{ color: '#34d399', fontWeight: 700 }}>
                    Score: {a.mySubmission.marks ? `${a.mySubmission.marks} / ${a.maxMarks}` : 'Awaiting Grading'}
                  </div>
                  {a.mySubmission.feedback && (
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Feedback: {a.mySubmission.feedback}
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => handleQuickSubmit(a.id)}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  <UploadCloud size={15} />
                  Submit Assignment
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 5. RESULTS TAB */}
      {subTab === 'results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.length === 0 ? (
            <div className="app-card" style={{ textAlign: 'center', padding: '2rem' }}>
              No published exam results found yet.
            </div>
          ) : (
            results.map((res) => (
              <div key={res.id} className="app-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Semester {res.semester.number} Grade Card</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Academic Session 2025-26</div>
                  </div>
                  <span className="badge badge-green">PASSED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>SGPA</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{res.sgpa.toFixed(2)}</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#34d399' }}>CGPA</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{res.cgpa.toFixed(2)}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  SUBJECT MARKS BREAKDOWN
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {res.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.subject.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Int: {item.internalMarks} • Ext: {item.externalMarks}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#60a5fa' }}>{item.grade}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{item.totalMarks} / 100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
