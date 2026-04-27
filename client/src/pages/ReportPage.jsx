import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  if (!user) return (
    <p style={{ textAlign:'center', marginTop:'40px' }}>
      Please <a href="/login">login</a> to report an issue.
    </p>
  );

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => { alert('Location access denied'); setLocLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const data = new FormData();
        data.append('image', image);
        const res = await API.post('/issues/upload', data);
        imageUrl = res.data.url;
      }
      await API.post('/issues', {
        ...form,
        images: imageUrl ? [imageUrl] : [],
        location: location || {}
      });
      navigate('/');
    } catch (err) {
      alert('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📍 Report an Issue</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Title</label>
          <input style={styles.input}
            placeholder="e.g. Broken street light on MG Road"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} required />

          <label style={styles.label}>Category</label>
          <select style={styles.input} value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}>
            {['garbage','water','electricity','road','other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label style={styles.label}>Description</label>
          <textarea style={{...styles.input, height:'100px', resize:'vertical'}}
            placeholder="Describe the problem in detail..."
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} required />

          <label style={styles.label}>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleImage}
            style={{ marginBottom:'12px' }} />
          {preview && (
            <img src={preview} alt="preview" style={styles.preview} />
          )}

          <label style={styles.label}>Location</label>
          <button type="button" onClick={getLocation} style={styles.locBtn}>
            {locLoading ? 'Getting location...' : location
              ? `✅ Got: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : '📍 Use My Location'}
          </button>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Uploading & Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', padding:'24px 16px',
    background:'#f5f5f5', minHeight:'90vh' },
  card: { background:'#fff', padding:'36px', borderRadius:'12px', width:'100%',
    maxWidth:'540px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  heading: { color:'#1a1a2e', marginBottom:'24px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'#555', marginBottom:'6px' },
  input: { display:'block', width:'100%', padding:'10px 12px', margin:'0 0 16px',
    border:'1px solid #ddd', borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' },
  preview: { width:'100%', maxHeight:'200px', objectFit:'cover',
    borderRadius:'8px', marginBottom:'14px' },
  locBtn: { display:'block', width:'100%', padding:'10px', background:'#f0f0f0',
    border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer',
    marginBottom:'16px', fontSize:'14px' },
  submitBtn: { width:'100%', padding:'12px', background:'#e94560', color:'#fff',
    border:'none', borderRadius:'6px', fontSize:'15px', cursor:'pointer', fontWeight:'600' }
};