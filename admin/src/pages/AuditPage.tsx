import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';
import { ShieldCheck, Filter, Clock, User, Terminal } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    const res = await apiRequest('/audit');
    if (res.success && res.data) {
      setLogs(res.data);
    }
    setLoading(false);
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Institutional Security & Audit Logs</h1>
        <p className="page-subtitle">Immutable compliance and audit trail documenting all critical administrative and academic transactions</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action Code</th>
              <th>Entity Type</th>
              <th>Actor Identity</th>
              <th>Operation Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Loading immutable audit events...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      log.action.includes('CREATE') ? 'badge-success' :
                      log.action.includes('DELETE') ? 'badge-danger' :
                      'badge-primary'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#fff' }}>{log.entityType}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.user?.fullName || 'System Event'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{log.user?.email || 'N/A'}</div>
                  </td>
                  <td>
                    <code style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)',
                      color: '#93c5fd',
                      display: 'inline-block',
                      maxWidth: '400px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {log.details || 'No payload'}
                    </code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
