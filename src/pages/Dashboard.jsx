import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Activity, 
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { userData, currentUser } = useAuth();
  const { stocks } = useMarket();
  const [watchlistData, setWatchlistData] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, "watchlists"), where("uid", "==", currentUser.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (items.length > 0) setWatchlistData(items);
      }, (error) => {
         console.warn("Firestore Watchlist unavailable:", error);
      });
    } catch(e) {}

    // Offline Sync for Dashboard
    const syncLocal = () => {
      const local = JSON.parse(localStorage.getItem(`mockWatchlist_${currentUser.uid}`) || '[]');
      setWatchlistData(prev => local.length > 0 ? local : prev);
    };
    window.addEventListener('mockWatchlistUpdate', syncLocal);
    syncLocal();

    return () => {
      unsubscribe();
      window.removeEventListener('mockWatchlistUpdate', syncLocal);
    }
  }, [currentUser]);

  const previewStocks = currentUser 
    ? watchlistData.map(item => stocks.find(s => s.symbol === item.symbol)).filter(Boolean).slice(0, 3)
    : stocks.slice(0, 3);

  if (!stocks || stocks.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Initialising market data...</p>
      </div>
    );
  }

  // Sort stocks by change to show gainers/losers
  const topGainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.change - b.change).slice(0, 4);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass-card" style={{ flex: 1, minWidth: '240px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: `rgba(${color}, 0.1)`, 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `rgb(${color})`
        }}>
          <Icon size={20} />
        </div>
        {trend && (
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: trend > 0 ? 'var(--accent-primary)' : trend < 0 ? 'var(--accent-secondary)' : 'var(--text-muted)' }}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, {userData?.name?.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your portfolio today.</p>
        </div>

      </div>

      {/* Primary Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <StatCard 
          title="Virtual Cash" 
          value={`₹${(userData?.balance ?? 0).toLocaleString()}`} 
          icon={Wallet} 
          color="16, 185, 129" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Market Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Market Insights</h2>
              <Link to="/market" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>See All</Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>TOP GAINERS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topGainers.map(s => (
                    <div key={s.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{s.symbol}</div>
                      <div className="text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={14} /> {s.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>TOP LOSERS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topLosers.map(s => (
                    <div key={s.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{s.symbol}</div>
                      <div className="text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingDown size={14} /> {s.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Daily Learning Goal</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Complete today's quiz to maintain your 3-day streak!</p>
              </div>
              <Link to="/quiz" className="btn btn-primary">
                Start Quiz <Zap size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Mini Components */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Watchlist Preview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {previewStocks.length > 0 ? previewStocks.map(s => (
                <Link key={s.symbol} to={`/stock/${s.symbol}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-primary)' }}>{s.symbol}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>₹{s.price}</div>
                    <div style={{ fontSize: '0.75rem' }} className={s.change >= 0 ? 'text-success' : 'text-danger'}>
                      {s.change >= 0 ? '+' : ''}{s.change}%
                    </div>
                  </div>
                </Link>
              )) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  No stocks watched yet.
                </div>
              )}
              <Link to="/watchlist" style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 600, textAlign: 'center', marginTop: '0.5rem' }}>Manage Watchlist</Link>
            </div>
          </div>


        </div>
      </div>
    </motion.div>
  );
}
