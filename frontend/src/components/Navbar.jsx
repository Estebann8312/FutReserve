import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">⚽ FutReserve</Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/canchas">Canchas</Link>
          <span style={{ marginLeft: '1.5rem', color: 'var(--text-muted)' }}>|</span>
          <span style={{ marginLeft: '1.5rem' }}>Hola, {user.nombre}</span>
          <button onClick={logout} className="btn btn-danger" style={{ marginLeft: '1.5rem', padding: '0.4rem 1rem' }}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
