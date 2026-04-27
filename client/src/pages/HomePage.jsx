import { useEffect, useState } from 'react';
import API from '../api/axios';
import IssueCard from '../components/IssueCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function HomePage() {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchIssues = async () => {
    const res = await API.get('/issues');
    setIssues(res.data);
  };

  useEffect(() => { fetchIssues(); }, []);

  const categories = ['all', 'garbage', 'water', 'electricity', 'road', 'other'];
  const filtered = filter === 'all' ? issues
    : issues.filter(i => i.category === filter);

  const issuesWithLocation = issues.filter(i => i.location?.lat);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🗺️ Issues Near You</h1>

      {issuesWithLocation.length > 0 && (
        <MapContainer
          center={[issuesWithLocation[0].location.lat, issuesWithLocation[0].location.lng]}
          zoom={13}
          style={{ height:'340px', borderRadius:'12px', marginBottom:'28px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {issuesWithLocation.map(issue => (
            <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
              <Popup>
                <strong>{issue.title}</strong><br />
                {issue.category} — {issue.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div style={styles.filters}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            ...styles.filterBtn,
            background: filter === cat ? '#e94560' : '#f0f0f0',
            color: filter === cat ? '#fff' : '#333'
          }}>{cat}</button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.map(issue => (
          <IssueCard key={issue._id} issue={issue} onUpdate={fetchIssues} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign:'center', color:'#999', marginTop:'40px' }}>
          No issues found. Be the first to report one!
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'24px 16px' },
  heading: { color:'#1a1a2e', marginBottom:'16px' },
  filters: { display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px' },
  filterBtn: { border:'none', padding:'6px 16px', borderRadius:'20px',
    cursor:'pointer', fontSize:'13px', fontWeight:'600', textTransform:'capitalize' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }
};