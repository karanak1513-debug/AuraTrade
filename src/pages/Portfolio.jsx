import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarket } from '../context/MarketContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, RefreshCcw, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const { currentUser, userData } = useAuth();
  const { stocks } = useMarket();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const q = query(collection(db, `holdings/${currentUser.uid}/items`));
        const querySnapshot = await getDocs(q);
        const holdingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHoldings(holdingsData);
      } catch (e) {
        console.error("Error fetching holdings:", e);
        // Fallback demo data
        setHoldings([
          { symbol: 'RELIANCE', quantity: 10, avgPrice: 2850.50 },
          { symbol: 'TCS', quantity: 5, avgPrice: 4050.20 },
          { symbol: 'INFY', quantity: 15, avgPrice: 1580.00 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchHoldings();
  }, [currentUser]);

  // Calculate real-time values based on current market prices
  const enrichedHoldings = holdings.map(h => {
    const marketStock = stocks.find(s => s.symbol === h.symbol);
    const currentPrice = marketStock ? marketStock.price : h.avgPrice;
    const investedValue = h.quantity * h.avgPrice;
    const currentValue = h.quantity * currentPrice;
    const pnl = currentValue - investedValue;
    const pnlPercent = (pnl / investedValue) * 100;

    return {
      ...h,
      currentPrice,
      investedValue,
      currentValue,
      pnl,
      pnlPercent
    };
  });

  const totalCurrentValue = enrichedHoldings.reduce((acc, h) => acc + h.currentValue, 0);
  const totalInvested = enrichedHoldings.reduce((acc, h) => acc + h.investedValue, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const COLORS = ['#10b981', '#3b82f6', '#fbbf24', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Your Portfolio</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time breakdown of your virtual investments.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary"><Download size={18} /> Export</button>
          <button className="btn btn-secondary" style={{ color: 'var(--accent-secondary)' }}><RefreshCcw size={18} /> Reset Simulator</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Invested</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{totalInvested.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Value</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{totalCurrentValue.toLocaleString()}</div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Unrealized P/L</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className={totalPnL >= 0 ? 'text-success' : 'text-danger'}>
            ₹{totalPnL.toLocaleString()} ({totalPnLPercent.toFixed(2)}%)
          </div>
        </div>
        <div className="glass-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Available Cash</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{userData?.balance?.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Holdings ({enrichedHoldings.length})</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Avg Price</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>CMP</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Curr Value</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>P/L</th>
              </tr>
            </thead>
            <tbody>
              {enrichedHoldings.map(h => (
                <tr key={h.symbol} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>{h.symbol}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>{h.quantity}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>₹{h.avgPrice.toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>₹{h.currentPrice.toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>₹{h.currentValue.toLocaleString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className={h.pnl >= 0 ? 'text-success' : 'text-danger'} style={{ fontWeight: 600 }}>
                      ₹{h.pnl.toLocaleString()} <br />
                      <span style={{ fontSize: '0.7rem' }}>{h.pnlPercent.toFixed(2)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Asset Allocation</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrichedHoldings.map(h => ({ name: h.symbol, value: h.currentValue }))}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrichedHoldings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {enrichedHoldings.map((h, i) => (
              <div key={h.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                  {h.symbol}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>{((h.currentValue / totalCurrentValue) * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
