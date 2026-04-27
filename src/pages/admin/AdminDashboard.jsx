import React from 'react';
import { 
  Users, 
  Database, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  LayoutDashboard,
  ShieldAlert,
  AlertOctagon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const StatCard = ({ title, value, sub, icon: Icon, color }) => (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ color: `rgb(${color})`, background: `rgba(${color}, 0.1)`, padding: '10px', borderRadius: '10px' }}>
          <Icon size={20} />
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-secondary)', padding: '0.75rem', borderRadius: '12px' }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Secure access to platform metrics and management.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Users" value="1,248" sub="+12 today" icon={Users} color="59, 130, 246" />
        <StatCard title="Active Stocks" value="20" sub="All Syncing" icon={TrendingUp} color="16, 185, 129" />
        <StatCard title="MCQ Bank" value="150" sub="10 Topics" icon={Database} color="251, 191, 36" />
        <StatCard title="Reports" value="4" sub="Pending" icon={AlertOctagon} color="239, 68, 68" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} /> User Management
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>User #{1000 + i}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined 2h ago</div>
                </div>
                <button className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>View</button>
              </div>
            ))}
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>Manage All Users</button>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Announcements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed var(--accent-blue)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>No active global announcements.</p>
              <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Create New</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
