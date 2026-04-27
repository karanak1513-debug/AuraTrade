import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Vikram Singh', return: 145.2, accuracy: 92, badge: 'Elite Trader', xp: 4500 },
  { rank: 2, name: 'Priya Sharma', return: 112.5, accuracy: 88, badge: 'Top Performer', xp: 3800 },
  { rank: 3, name: 'Rahul Mehta', return: 98.4, accuracy: 95, badge: 'Quiz Master', xp: 3500 },
  { rank: 4, name: 'Ananya Iyer', return: 76.8, accuracy: 82, badge: 'Smart Investor', xp: 2900 },
  { rank: 5, name: 'Siddharth Rao', return: 64.2, accuracy: 78, badge: 'Active Learner', xp: 2400 },
  { rank: 6, name: 'Sneha Kapur', return: 55.1, accuracy: 85, badge: 'Risk Manager', xp: 2100 },
  { rank: 7, name: 'Arjun Das', return: 42.9, accuracy: 70, badge: 'Beginner', xp: 1800 },
  { rank: 8, name: 'Kabir Bakshi', return: 38.4, accuracy: 72, badge: 'Beginner', xp: 1600 }
];

export default function Leaderboard() {
  const [tab, setTab] = useState('returns');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Leaderboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Compete with thousands of traders worldwide.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '10px' }}>
          <button 
            onClick={() => setTab('returns')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              border: 'none', 
              background: tab === 'returns' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'returns' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: '0.2s'
            }}
          >Returns</button>
          <button 
            onClick={() => setTab('quizzes')}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              border: 'none', 
              background: tab === 'quizzes' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'quizzes' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: '0.2s'
            }}
          >Quizzes</button>
        </div>
      </div>

      {/* Top 3 Spades */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ width: '220px', textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid silver' }}>
          <Medal size={40} color="silver" style={{ marginBottom: '1rem' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{MOCK_LEADERBOARD[1].name}</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0' }}>{MOCK_LEADERBOARD[tab === 'returns' ? 1 : 1].return}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rank 2</div>
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="glass-card" style={{ width: '260px', textAlign: 'center', padding: '3rem 1.5rem', transform: 'translateY(-20px)', borderTop: '4px solid gold' }}>
          <Crown size={48} color="gold" style={{ marginBottom: '1rem' }} />
          <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>{MOCK_LEADERBOARD[0].name}</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0' }}>{MOCK_LEADERBOARD[tab === 'returns' ? 0 : 0].return}%</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Global Champion</div>
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ width: '220px', textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid #cd7f32' }}>
          <Medal size={40} color="#cd7f32" style={{ marginBottom: '1rem' }} />
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{MOCK_LEADERBOARD[2].name}</div>
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0' }}>{MOCK_LEADERBOARD[tab === 'returns' ? 2 : 2].return}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rank 3</div>
        </motion.div>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <th style={{ padding: '1.25rem' }}>RANK</th>
              <th style={{ padding: '1.25rem' }}>USER</th>
              <th style={{ padding: '1.25rem' }}>BADGE</th>
              <th style={{ padding: '1.25rem', textAlign: 'right' }}>ACCURACY</th>
              <th style={{ padding: '1.25rem', textAlign: 'right' }}>RETURN %</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LEADERBOARD.slice(3).map((user) => (
              <tr key={user.rank} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{user.rank}</td>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.xp} XP</div>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.25rem 0.6rem', borderRadius: '50px', border: '1px solid var(--border-color)' }}>
                    {user.badge}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}>{user.accuracy}%</td>
                <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 700 }} className="text-success">+{user.return}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
