import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Briefcase,
  BarChart3, 
  History, 
  Eye, 
  Trophy, 
  BookOpen, 
  HelpCircle,
  User,
  Settings,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Market', path: '/market' },
  { icon: History, label: 'Orders', path: '/history' },
  { icon: Eye, label: 'Watchlist', path: '/watchlist' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
];

const learningItems = [
  { icon: BookOpen, label: 'Learning Center', path: '/learning' },
  { icon: Lightbulb, label: 'Tips & Strategy', path: '/tips' },
  { icon: HelpCircle, label: 'Take a Quiz', path: '/quiz' },
];

const accountItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';

  const NavItem = ({ item }) => (
    <NavLink 
      to={item.path}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        borderRadius: '10px',
        background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
        transition: 'all 0.2s',
        marginBottom: '4px',
        fontWeight: isActive ? 600 : 400
      })}
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <aside style={{
      width: '260px',
      height: 'calc(100vh - 80px)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      overflowY: 'auto'
    }}>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>Main</p>
        {navItems.map(item => <NavItem key={item.path} item={item} />)}
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>Education</p>
        {learningItems.map(item => <NavItem key={item.path} item={item} />)}
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>Account</p>
        {accountItems.map(item => <NavItem key={item.path} item={item} />)}
      </div>

      {isAdmin && (
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>Administration</p>
          <NavItem item={{ icon: ShieldCheck, label: 'Admin Panel', path: '/admin' }} />
        </div>
      )}

      <div className="glass-card" style={{ marginTop: isAdmin ? '1rem' : 'auto', padding: '1rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Practice Only</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          This is a simulated platform. No real money or securities are involved. <strong>Not financial advice.</strong>
        </p>
      </div>
    </aside>
  );
}
