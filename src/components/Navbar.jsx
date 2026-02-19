import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { username, logout } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (href) => {
    if (href === '/') {
      return (
        path === '/' ||
        path === '/add' ||
        path === '/edit'
      ) &&
        !path.startsWith('/websites') &&
        !path.startsWith('/tasks') &&
        !path.startsWith('/appointments') &&
        !path.startsWith('/stocks') &&
        !path.startsWith('/settings');
    }
    return path.startsWith(href);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-icon">📞</span>
        <span className="nav-title">MaiGration Master</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          Contacts
        </Link>
        <Link
          to="/appointments"
          className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
        >
          Appointments
        </Link>
        <Link
          to="/tasks"
          className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
        >
          Tasks
        </Link>
        <Link
          to="/stocks"
          className={`nav-link ${isActive('/stocks') ? 'active' : ''}`}
        >
          Stocks
        </Link>
        <Link
          to="/websites"
          className={`nav-link ${isActive('/websites') ? 'active' : ''}`}
        >
          Websites
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/settings" className="btn btn-ghost nav-settings" title="Settings">
          ⚙️
        </Link>
        <span className="nav-user">👤 {username}</span>
        <button onClick={logout} className="btn btn-ghost">
          Logout
        </button>
      </div>
    </nav>
  );
};
