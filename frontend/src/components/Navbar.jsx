import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Briefcase, FolderGit, User, LogOut, Award, Compass, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Award className="logo-icon" />
          <span>Amrita KTP</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Home size={18} />
            <span>Home</span>
          </NavLink>

          {user && (
            <>
              <NavLink to="/resources" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <BookOpen size={18} />
                <span>Resources</span>
              </NavLink>

              <NavLink to="/experiences" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Briefcase size={18} />
                <span>Careers</span>
              </NavLink>

              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <FolderGit size={18} />
                <span>Projects</span>
              </NavLink>
              <NavLink to="/guidance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Compass size={18} />
                <span>Guidance</span>
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                  <Shield size={18} />
                  <span>Admin</span>
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                <User size={18} />
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className="user-role-badge">{user.role}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary nav-btn">Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Register</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background: rgba(12, 13, 18, 0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-glass);
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-primary);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.35rem;
          letter-spacing: -0.01em;
        }

        .logo-icon {
          color: var(--color-amrita-red-light);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-item.active {
          color: var(--color-amrita-red-light);
          background: rgba(179, 25, 66, 0.08);
        }

        .navbar-auth {
          display: flex;
          align-items: center;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .profile-link:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-glass-focused);
        }

        .user-name {
          font-weight: 500;
        }

        .user-role-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(179, 25, 66, 0.15);
          color: var(--color-amrita-red-light);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .logout-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
          transition: var(--transition-smooth);
        }

        .logout-btn:hover {
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .nav-btn {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
        }

        @media (max-width: 768px) {
          .navbar-links span, .profile-link .user-name, .profile-link .user-role-badge {
            display: none;
          }
          .navbar-container {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
