import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🚨 LocalReporter</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.name}>Hi, {user.name}</span>
            {user?.role === 'admin' && (
              <Link to="/admin" style={styles.btn}>🛡️ Admin</Link>
            )}
            <Link to="/report" style={styles.btn}>+ Report Issue</Link>
            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.btn}>Login</Link>
            <Link to="/register" style={styles.btn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'12px 24px', background:'#1a1a2e', color:'#fff' },
  brand: { color:'#fff', textDecoration:'none', fontWeight:'bold', fontSize:'18px' },
  links: { display:'flex', gap:'12px', alignItems:'center' },
  btn: { color:'#fff', textDecoration:'none', background:'#e94560',
    padding:'6px 14px', borderRadius:'6px', fontSize:'14px' },
  logout: { background:'transparent', border:'1px solid #fff', color:'#fff',
    padding:'6px 14px', borderRadius:'6px', cursor:'pointer' },
  name: { fontSize:'14px', color:'#aaa' }
};