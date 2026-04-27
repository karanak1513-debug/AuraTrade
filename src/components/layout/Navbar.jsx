import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Bell, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout, userData } = useAuth();

  return (
    <nav className="glass" style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 12px 12px',
      margin: '0 1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-outline" onClick={onMenuClick} style={{ padding: '0.5rem', borderRadius: '8px', display: 'flex', md: 'none' }}>
          <Menu size={20} />
        </button>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold' }}>A</div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-gradient">AURATRADE</span>
        </Link>
      </div>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search stocks, modules, users..." 
          style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            padding: '0.5rem 1rem 0.5rem 2.5rem',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/profile">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="profile" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-primary)' }} />
              ) : (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} />
                </div>
              )}
            </Link>
            <button onClick={logout} className="btn-outline" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
