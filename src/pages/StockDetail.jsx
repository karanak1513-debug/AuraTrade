import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Info, 
  Zap,
  ArrowLeft,
  Activity,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';
import CryptoChart from '../components/CryptoChart';

export default function StockDetail() {
  const { symbol } = useParams();
  const { getStock } = useMarket();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  
  const [stock, setStock] = useState(null);
  const [qty, setQty] = useState(1);
  const [type, setType] = useState('BUY'); // BUY or SELL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = getStock(symbol);
    if (s) setStock(s);
  }, [symbol, getStock]);



  if (!stock) return <div style={{ padding: '2rem' }}>Loading stock details...</div>;

  // Transaction Logic
  const handleTrade = async () => {
    if (!currentUser) return alert("Please Login to trade.");
    setLoading(true);
    
    const totalCost = stock.price * qty;
    const currentBalance = userData?.balance ?? Number(localStorage.getItem('mockBalance')) ?? 1000000;
    
    try {
      // 1. Online attempt with Timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout (Database Offline)")), 2000)
      );

      await Promise.race([
        runTransaction(db, async (transaction) => {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await transaction.get(userRef);
          
          let dbBalance = 1000000;
          if (userSnap.exists() && userSnap.data().balance !== undefined) {
             dbBalance = userSnap.data().balance;
          }

          if (type === 'BUY' && dbBalance < totalCost) {
            throw new Error("Insufficient Balance. Mint tokens in your Wallet.");
          }

          const newBalance = dbBalance + (type === 'BUY' ? -totalCost : totalCost);

          if (!userSnap.exists()) {
            transaction.set(userRef, { 
              uid: currentUser.uid,
              balance: newBalance,
              totalTrades: 1,
              joinedAt: serverTimestamp(),
              name: currentUser.displayName || 'Trader'
            }, { merge: true });
          } else {
            transaction.update(userRef, {
              balance: newBalance,
              totalTrades: increment(1)
            });
          }

          const orderRef = doc(collection(db, "orders"));
          transaction.set(orderRef, {
            uid: currentUser.uid,
            symbol: stock.symbol,
            qty,
            price: stock.price,
            total: totalCost,
            type,
            status: 'EXECUTED',
            createdAt: serverTimestamp()
          });
        }),
        timeoutPromise
      ]);

      alert(`${type} Success: ${qty} shares of ${stock.symbol}`);
    } catch (e) {
      if (e.message?.includes("Database") || 
          e.message?.includes("database") || 
          e.message?.includes("not exist") || 
          e.message?.includes("not found") || 
          e.message?.includes("Timeout")) {
        console.warn("Firestore Database Not Found. Switching to Offline practice mode.");
        const fallback = Number(localStorage.getItem('mockBalance') || currentBalance);
        
        if (type === 'BUY' && fallback < totalCost) {
           alert("Insufficient Balance. Mint tokens in your Wallet.");
           setLoading(false);
           return;
        }
        
        const newLocalBalance = fallback + (type === 'BUY' ? -totalCost : totalCost);
        localStorage.setItem('mockBalance', newLocalBalance);
        
        // Record Offline Order History
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        mockOrders.unshift({
          id: Date.now().toString(),
          symbol: stock.symbol,
          type,
          side: 'MARKET',
          qty,
          price: stock.price,
          total: totalCost,
          time: new Date().toLocaleString(),
          status: 'EXECUTED'
        });
        localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
        
        // Record Offline Wallet Transaction History
        const mockTransactions = JSON.parse(localStorage.getItem('mockTransactions') || '[]');
        mockTransactions.unshift({
          id: Date.now().toString(),
          type: type === 'BUY' ? 'TRADE_DEDUCTION' : 'TRADE_REVENUE',
          description: `${type} ${qty} shares of ${stock.symbol}`,
          amount: type === 'BUY' ? -totalCost : totalCost,
          time: new Date().toLocaleString()
        });
        localStorage.setItem('mockTransactions', JSON.stringify(mockTransactions));
        
        // Update local state and trigger UI refreshes
        window.dispatchEvent(new Event('mockBalanceUpdate'));
        
        alert(`(Offline Mode) ${type} Success: ${qty} shares of ${stock.symbol}`);
      } else {
        alert("Error: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ width: 'fit-content', border: 'none' }}>
        <ArrowLeft size={18} /> Back to Market
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header Info */}
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stock.symbol}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{stock.name} • {stock.sector}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹{stock.price.toLocaleString()}</div>
              <div className={stock.change >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-card" style={{ height: '400px', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} className="text-gradient" /> Price Performance
            </h3>
            <div style={{ height: '85%', width: '100%' }}>
              <CryptoChart symbol={stock.symbol} />
            </div>
          </div>

          <div className="glass-card">
            <h3>Key Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Market Cap</div>
                <div style={{ fontWeight: 600 }}>₹4.5T</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>52w High</div>
                <div style={{ fontWeight: 600 }}>₹{ (stock.price * 1.2).toFixed(2) }</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>52w Low</div>
                <div style={{ fontWeight: 600 }}>₹{ (stock.price * 0.8).toFixed(2) }</div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy/Sell Terminal */}
        <div className="glass-card" style={{ sticky: 'top', top: '100px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '0.25rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => setType('BUY')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: type === 'BUY' ? 'var(--accent-primary)' : 'transparent', color: type === 'BUY' ? '#fff' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}
            >BUY</button>
            <button 
              onClick={() => setType('SELL')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: type === 'SELL' ? 'var(--accent-secondary)' : 'transparent', color: type === 'SELL' ? '#fff' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer' }}
            >SELL</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>QUANTITY</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '12px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn-outline" style={{ padding: '0.5rem' }}><Minus size={16} /></button>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  style={{ flex: 1, textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800, outline: 'none' }}
                />
                <button onClick={() => setQty(q => q + 1)} className="btn-outline" style={{ padding: '0.5rem' }}><Plus size={16} /></button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Price</span>
                <span>₹{stock.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Order Type</span>
                <span>Market</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Amount</span>
                <span className={type === 'BUY' ? 'text-success' : 'text-danger'}>₹{(stock.price * qty).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <Info size={14} /> Available Balance: ₹{(userData?.balance ?? 1000000).toLocaleString()}
            </div>

            <button 
              disabled={loading}
              onClick={handleTrade}
              className="btn btn-primary" 
              style={{ 
                padding: '1.25rem', 
                fontSize: '1.1rem', 
                background: type === 'BUY' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                boxShadow: `0 8px 24px -8px ${type === 'BUY' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
              }}
            >
              {loading ? 'Processing...' : `Place ${type} Order`} <Zap size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
