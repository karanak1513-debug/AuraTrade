import React, { useState, useEffect } from 'react';
import { Eye, Plus, Trash2, TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const { stocks } = useMarket();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, "watchlists"), where("uid", "==", currentUser.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (items.length > 0) setWatchlistData(items);
        setLoading(false);
      }, (error) => {
        console.warn("Firestore Watchlist unavailable:", error);
      });
    } catch(e) {}

    // Offline Sync
    const syncLocal = () => {
      const local = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');
      setWatchlistData(prev => local.length > 0 ? local : prev);
      setLoading(false);
    };
    window.addEventListener('mockWatchlistUpdate', syncLocal);
    syncLocal();

    return () => {
      unsubscribe();
      window.removeEventListener('mockWatchlistUpdate', syncLocal);
    };
  }, [currentUser]);

  const removeItem = async (id) => {
    try {
      if (id.startsWith('local_')) {
        const symbol = id.split('_')[1];
        const local = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');
        const updated = local.filter(s => s.symbol !== symbol);
        localStorage.setItem('mockWatchlist', JSON.stringify(updated));
        window.dispatchEvent(new Event('mockWatchlistUpdate'));
        return;
      }
      await deleteDoc(doc(db, "watchlists", id));
    } catch (e) {
      console.error(e);
    }
  };

  // Merge Firestore watchlist with real-time market data
  const watchlistItems = watchlistData.map(item => {
    const marketStock = stocks.find(s => s.symbol === item.symbol);
    return marketStock ? { ...marketStock, watchlistId: item.id } : null;
  }).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Your Watchlist</h1>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of your favorite stocks and alerts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/market')}><Plus size={18} /> Add Stock</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {watchlistItems.map(s => (
          <div key={s.symbol} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{s.symbol}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.name}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => removeItem(s.watchlistId)}
                  className="btn-outline" 
                  style={{ padding: '0.5rem', color: 'var(--accent-secondary)' }}
                ><Trash2 size={16} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{s.price.toLocaleString()}</div>
                <div className={s.change >= 0 ? 'text-success' : 'text-danger'} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  {s.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {s.change}%
                </div>
              </div>
              <div style={{ width: '100px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Mini chart placeholder */}
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%' }}>
                  <path d="M0 30 Q 25 10, 50 35 T 100 5" fill="none" stroke={s.change >= 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'} strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => navigate(`/stock/${s.symbol}`)}
                className="btn btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}
              >Detailed View</button>
              <button 
                onClick={() => navigate(`/stock/${s.symbol}`)}
                className="btn btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}
              >Quick Trade</button>
            </div>
          </div>
        ))}

        <div onClick={() => navigate('/market')} className="glass-card" style={{ border: '2px dashed var(--border-color)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', cursor: 'pointer' }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}><Plus size={24} /></div>
          <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Add more stocks to track</p>
        </div>
      </div>
    </div>
  );
}
