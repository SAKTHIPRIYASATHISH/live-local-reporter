import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function IssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    API.get(`/issues/${id}`).then(res => setIssue(res.data));
  }, [id]);

  if (!issue) return <p style={{ textAlign:'center', marginTop:'40px' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.body}>
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:'12px' }}>
          <span style={styles.category}>{issue.category}</span>
          <StatusBadge status={issue.status} />
        </div>
        <h1 style={styles.title}>{issue.title}</h1>
        <p style={styles.desc}>{issue.description}</p>
        <p style={styles.meta}>
          Reported by <strong>{issue.createdBy?.name}</strong> •{' '}
          {new Date(issue.createdAt).toLocaleDateString()} •{' '}
          {issue.upvotes.length} upvotes
        </p>
        {issue.location?.lat && (
          <p style={styles.meta}>
            📍 {issue.location.lat.toFixed(5)}, {issue.location.lng.toFixed(5)}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth:'700px', margin:'40px auto', padding:'0 16px' },
  body: { background:'#fff', padding:'28px', borderRadius:'12px',
    boxShadow:'0 2px 16px rgba(0,0,0,0.08)' },
  category: { background:'#f0f0f0', padding:'4px 12px', borderRadius:'20px',
    fontSize:'12px', fontWeight:'700', textTransform:'uppercase', color:'#555' },
  title: { fontSize:'26px', color:'#1a1a2e', margin:'14px 0 12px' },
  desc: { fontSize:'15px', color:'#444', lineHeight:'1.7', marginBottom:'20px' },
  meta: { fontSize:'13px', color:'#888' }
};