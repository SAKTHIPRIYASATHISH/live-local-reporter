import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function IssueCard({ issue, onUpdate }) {
  const { user } = useAuth();
  const hasUpvoted = user && issue.upvotes.includes(user.id);
  const isOwner = user && issue.createdBy?._id === user.id;

  const handleUpvote = async () => {
    if (!user) return alert('Login to upvote');
    await API.patch(`/issues/${issue._id}/upvote`);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await API.delete(`/issues/${issue._id}`);
      onUpdate();
    } catch (err) {
      alert('Failed to delete issue');
    }
  };

  return (
    <div style={styles.card}>
      {issue.images?.[0] && (
        <img src={issue.images[0]} alt="issue" style={styles.img} />
      )}
      <div style={styles.body}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={styles.category}>{issue.category}</span>
          <StatusBadge status={issue.status} />
        </div>
        <Link to={`/issues/${issue._id}`} style={styles.title}>{issue.title}</Link>
        <p style={styles.desc}>{issue.description.slice(0, 100)}...</p>
        <div style={styles.footer}>
          <button onClick={handleUpvote} style={{
            ...styles.upvoteBtn,
            background: hasUpvoted ? '#e94560' : '#f0f0f0',
            color: hasUpvoted ? '#fff' : '#333'
          }}>
            ▲ {issue.upvotes.length} Upvotes
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={styles.meta}>by {issue.createdBy?.name}</span>
            {isOwner && (
              <button onClick={handleDelete} style={styles.deleteBtn}>
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { border:'1px solid #e0e0e0', borderRadius:'10px', overflow:'hidden',
    background:'#fff', marginBottom:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  img: { width:'100%', height:'180px', objectFit:'cover' },
  body: { padding:'16px' },
  category: { background:'#f0f0f0', padding:'3px 10px', borderRadius:'12px',
    fontSize:'12px', textTransform:'uppercase', fontWeight:'600', color:'#555' },
  title: { display:'block', fontSize:'17px', fontWeight:'700', margin:'10px 0 6px',
    color:'#1a1a2e', textDecoration:'none' },
  desc: { fontSize:'14px', color:'#666', margin:'0 0 12px' },
  footer: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  upvoteBtn: { border:'none', padding:'6px 14px', borderRadius:'6px',
    cursor:'pointer', fontWeight:'600', fontSize:'13px' },
  meta: { fontSize:'12px', color:'#999' },
  deleteBtn: { background:'#fff0f0', border:'1px solid #ffcccc', color:'#cc0000',
    padding:'4px 10px', borderRadius:'6px', cursor:'pointer', fontSize:'12px' }
};