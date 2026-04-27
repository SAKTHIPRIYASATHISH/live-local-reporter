import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit" style={styles.btn}>Login</button>
        </form>
        <p style={{ textAlign:'center', marginTop:'12px', fontSize:'14px' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center',
    minHeight:'90vh', background:'#f5f5f5' },
  card: { background:'#fff', padding:'36px', borderRadius:'12px', width:'360px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  heading: { marginBottom:'20px', color:'#1a1a2e', textAlign:'center' },
  input: { display:'block', width:'100%', padding:'10px 12px', margin:'0 0 14px',
    border:'1px solid #ddd', borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' },
  btn: { width:'100%', padding:'11px', background:'#e94560', color:'#fff',
    border:'none', borderRadius:'6px', fontSize:'15px', cursor:'pointer', fontWeight:'600' },
  error: { color:'red', fontSize:'13px', marginBottom:'10px', textAlign:'center' }
};