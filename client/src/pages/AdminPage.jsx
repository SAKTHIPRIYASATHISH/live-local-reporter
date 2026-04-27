import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    API.get('/issues').then(res => setIssues(res.data));
  }, [user, navigate]);

  const updateStatus = async (id, status) => {
    await API.patch(`/issues/${id}/status`, { status });
    setIssues(issues.map(i => i._id === id ? {...i, status} : i));
  };

  const counts = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛡️ Admin Dashboard</h1>

      <div style={styles.statsRow}>
        {[['Total', counts.total, '#1a1a2e'],
          ['Pending', counts.pending, '#856404'],
          ['In Progress', counts.in_progress, '#004085'],
          ['Resolved', counts.resolved, '#155724']
        ].map(([label, count, color]) => (
          <div key={label} style={styles.statCard}>
            <div style={{ fontSize:'28px', fontWeight:'700', color }}>{count}</div>
            <div style={{ fontSize:'13px', color:'#666' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX:'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background:'#f5f5f5' }}>
              {['Title','Category','Reporter','Upvotes','Status','Action'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue._id}>
                <td style={styles.td}>{issue.title}</td>
                <td style={styles.td}>{issue.category}</td>
                <td style={styles.td}>{issue.createdBy?.name}</td>
                <td style={styles.td}>{issue.upvotes.length}</td>
                <td style={styles.td}><StatusBadge status={issue.status} /></td>
                <td style={styles.td}>
                  <select value={issue.status}
                    onChange={e => updateStatus(issue._id, e.target.value)}
                    style={styles.select}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'1000px', margin:'0 auto', padding:'24px 16px' },
  heading: { color:'#1a1a2e', marginBottom:'24px' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',
    gap:'16px', marginBottom:'32px' },
  statCard: { background:'#fff', padding:'20px', borderRadius:'10px', textAlign:'center',
    boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  table: { width:'100%', borderCollapse:'collapse', background:'#fff',
    borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.07)' },
  th: { padding:'12px 14px', textAlign:'left', fontSize:'13px',
    fontWeight:'700', color:'#555', borderBottom:'1px solid #eee' },
  td: { padding:'12px 14px', fontSize:'13px', color:'#333',
    borderBottom:'1px solid #f0f0f0' },
  select: { padding:'6px 10px', borderRadius:'6px', border:'1px solid #ddd',
    fontSize:'13px', cursor:'pointer' }
};