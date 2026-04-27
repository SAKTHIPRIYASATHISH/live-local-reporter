export default function StatusBadge({ status }) {
  const colors = {
    pending: { bg: '#fff3cd', color: '#856404' },
    in_progress: { bg: '#cce5ff', color: '#004085' },
    resolved: { bg: '#d4edda', color: '#155724' }
  };
  const style = colors[status] || colors.pending;
  return (
    <span style={{ ...style, padding:'3px 10px', borderRadius:'12px',
      fontSize:'12px', fontWeight:'600' }}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}