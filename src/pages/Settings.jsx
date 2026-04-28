import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, RefreshCcw, Trash2, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { currentUser, resetTradingData, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);


  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all trading data? This will wipe your portfolio and reset your balance to ₹10,00,000.")) {
      setLoading(true);
      try {
        await resetTradingData();
        setMessage({ type: 'success', text: 'Trading data reset successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to reset data.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("CRITICAL ACTION: This will permanently delete your account and all associated data. This cannot be undone. Proceed?")) {
      setLoading(true);
      try {
        await deleteAccount();
        await logout();
        navigate('/signup');
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete account. Please re-login and try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const Toggle = ({ active, onToggle, color = 'var(--accent-primary)' }) => (
    <div 
      onClick={onToggle}
      style={{ 
        width: '44px', 
        height: '24px', 
        background: active ? color : 'var(--bg-tertiary)', 
        border: !active ? '1px solid var(--border-color)' : 'none',
        borderRadius: '20px', 
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ 
        width: '18px', 
        height: '18px', 
        background: '#fff', 
        borderRadius: '50%', 
        position: 'absolute', 
        left: active ? '24px' : '3px', 
        top: '2.5px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </div>
  );

  const SettingRow = ({ icon: Icon, title, desc, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}><Icon size={20} /></div>
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{desc}</div>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem' }}>Settings</h1>
        {message && (
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <CheckCircle2 size={16} /> {message.text}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px 16px 0 0', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Preferences</div>
        
        <SettingRow 
          icon={isDarkMode ? Moon : Sun} 
          title="Dark Mode" 
          desc="Toggle between light and dark atmosphere." 
          action={<Toggle active={isDarkMode} onToggle={toggleTheme} />}
        />
        
        <SettingRow 
          icon={Bell} 
          title="Push Notifications" 
          desc="Get alerts for order execution and price hits." 
          action={<Toggle active={notifications} onToggle={() => setNotifications(!notifications)} />}
        />

      </div>

      <div className="glass-card" style={{ padding: 0, marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px 16px 0 0', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Security & Data</div>
        


        <SettingRow 
          icon={RefreshCcw} 
          title="Reset Trading Data" 
          desc="Permanently wipe all trades and balance to default ₹10L." 
          action={
            <button 
              disabled={loading}
              onClick={handleReset} 
              className="btn btn-secondary" 
              style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem' }}
            >
              {loading ? 'Processing...' : 'Reset'}
            </button>
          }
        />

        <SettingRow 
          icon={Trash2} 
          title="Delete Account" 
          desc="Permanently delete your profile and all associated data." 
          action={
            <button 
              disabled={loading}
              onClick={handleDelete} 
              className="btn btn-outline" 
              style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem', borderColor: 'var(--accent-secondary)' }}
            >
              Delete
            </button>
          }
        />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        App Version 1.0.0 (BETA) <br />
        Auratrade Simulation Engine v2.4
      </div>
    </div>
  );
}
