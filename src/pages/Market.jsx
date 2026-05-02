import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { Search, Filter, ArrowUpDown, PlusCircle, ShoppingCart, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export default function Market() {
  const { stocks } = useMarket();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const addToWatchlist = async (stock) => {
    if (!currentUser) return alert('Please login to add items to your watchlist');
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (Database Offline)")), 1500));
      
      const q = query(collection(db, "watchlists"), where("uid", "==", currentUser.uid), where("symbol", "==", stock.symbol));
      const snap = await Promise.race([getDocs(q), timeoutPromise]);
      
      if (!snap.empty) return alert('Already in watchlist');

      await Promise.race([addDoc(collection(db, "watchlists"), {
        uid: currentUser.uid,
        symbol: stock.symbol,
        name: stock.name,
        addedAt: serverTimestamp()
      }), timeoutPromise]);
      
      alert(`Added ${stock.symbol} to watchlist`);
      } catch (e) {
      if (e.message?.includes("Database") || 
          e.message?.includes("database") || 
          e.message?.includes("not exist") || 
          e.message?.includes("not found") || 
          e.message?.includes("Timeout")) {
        const localWatchlist = JSON.parse(localStorage.getItem(`mockWatchlist_${currentUser.uid}`) || '[]');
        if (localWatchlist.find(s => s.symbol === stock.symbol)) return alert('Already in watchlist');
        
        localWatchlist.push({ id: 'local_' + stock.symbol, symbol: stock.symbol, name: stock.name });
        localStorage.setItem(`mockWatchlist_${currentUser.uid}`, JSON.stringify(localWatchlist));
        window.dispatchEvent(new Event('mockWatchlistUpdate'));
        alert(`(Offline Mode) Added ${stock.symbol} to watchlist`);
      } else {
        console.error(e);
      }
    }
  };

  if (!stocks || stocks.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', flex: 1 }}>
        <p style={{ color: 'var(--text-muted)' }}>Synchronizing with market data...</p>
      </div>
    );
  }

  const sectors = ['All', ...new Set(stocks.map(s => s.sector))];

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Market Explore</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time simulated data for top Indian stocks.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or symbol..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            style={{ 
              background: 'var(--bg-primary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              outline: 'none'
            }}
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Symbol & Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Sector</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Price</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>24h Change</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock.symbol} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <Link to={`/stock/${stock.symbol}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                  </Link>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                  <span style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{stock.sector}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>
                  ₹{stock.price.toLocaleString()}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div className={stock.change >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                    {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stock.change}%
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}
                    >
                      <ShoppingCart size={14} /> Buy
                    </button>
                    <button 
                      onClick={() => addToWatchlist(stock)}
                      className="btn-outline" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}
                    >
                      <PlusCircle size={14} /> Watch
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStocks.length === 0 && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No stocks found matching your criteria.
          </div>
        )}
      </div>
    </motion.div>
  );
}
