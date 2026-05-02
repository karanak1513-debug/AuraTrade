import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { Wallet as WalletIcon, Zap, Activity, Info, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Wallet() {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    // Attempt offline simulation fetch
    const syncMockTx = () => {
      const mockTx = JSON.parse(localStorage.getItem(`mockTransactions_${currentUser.uid}`) || '[]');
      setTransactions(mockTx);
    };
    syncMockTx();
    
    // Listen for cross-page live updates
    window.addEventListener('mockBalanceUpdate', syncMockTx);
    return () => window.removeEventListener('mockBalanceUpdate', syncMockTx);
  }, [currentUser]);

  // Fallback to 0 if undefined to avoid undefined UI errors across the app
  const currentBalance = userData?.balance ?? 0;

  const handleTopUp = async (amount) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout (Database Offline)")), 2000)
      );

      const userRef = doc(db, 'users', currentUser.uid);
      
      await Promise.race([
        setDoc(userRef, { 
          balance: increment(amount),
          uid: currentUser.uid,
          name: currentUser.displayName || 'Trader'
        }, { merge: true }),
        timeoutPromise
      ]);

      alert(`₹${amount.toLocaleString()} successfully minted for practice!`);
    } catch(e) {
      if (e.message?.includes("Database") || 
          e.message?.includes("database") || 
          e.message?.includes("not exist") || 
          e.message?.includes("not found") || 
          e.message?.includes("Timeout")) {
        const fallback = Number(localStorage.getItem(`mockBalance_${currentUser.uid}`) || currentBalance);
        const newBalance = fallback + amount;
        localStorage.setItem(`mockBalance_${currentUser.uid}`, newBalance);
        
        // Log to Wallet Transaction History
        const mockTransactions = JSON.parse(localStorage.getItem(`mockTransactions_${currentUser.uid}`) || '[]');
        mockTransactions.unshift({
          id: Date.now().toString(),
          type: 'MANUAL_DEPOSIT',
          description: 'Minted Practice Tokens',
          amount: amount,
          time: new Date().toLocaleString()
        });
        localStorage.setItem(`mockTransactions_${currentUser.uid}`, JSON.stringify(mockTransactions));
        
        window.dispatchEvent(new Event('mockBalanceUpdate'));
        alert(`(Offline Mode) ₹${amount.toLocaleString()} successfully minted for practice!`);
      } else {
        alert("Failed to add funds: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}
    >
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <WalletIcon size={28} className="text-success" /> Practice Wallet
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Mint infinite tokens to simulate real market experiences without financial risk.</p>
      </div>

      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Available Trading Balance</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{currentBalance.toLocaleString()}</div>
          </div>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981'
          }}>
            <Activity size={32} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Mint Practice Tokens</h3>
          <p style={{ color: 'var(--text-muted)' }}>Enter the amount of virtual currency you want to add to your trading balance.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px', flexDirection: 'column' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-muted)' }}>₹</span>
            <input 
              type="number" 
              defaultValue={1000000}
              id="mint-amount"
              min="1"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '8px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'white',
                fontSize: '1.1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
             onClick={() => {
               const val = document.getElementById('mint-amount').value;
               handleTopUp(Number(val) || 1000000);
             }}
             disabled={loading}
             className="btn btn-primary" 
             style={{ padding: '0.75rem 2rem', background: 'var(--accent-primary)', width: '100%', justifyContent: 'center' }}
          >
            {loading ? <RefreshCw className="spin" size={18} /> : (
              <>Mint Custom Amount <Zap size={18} /></>
            )}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '1rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={16} /> About Practice mode</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Your wallet allows you to experience real stock fluctuations. To preserve the "realistic experience," try simulating actual budgets. However, you are always given the flexibility to generate infinite tokens ensuring your educational boundary is never halted by lack of virtual capital.
        </p>
      </div>

      <div className="glass-card" style={{ marginTop: '1rem', padding: '1.5rem', flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Transaction History</h3>
        
        {transactions.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No transactions recorded yet. Mint tokens or buy/sell stocks to see history!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '1rem 1.25rem' }}>TIME</th>
                <th style={{ padding: '1rem 1.25rem' }}>TYPE</th>
                <th style={{ padding: '1rem 1.25rem' }}>DETAILS</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t.time || t.timestamp ? new Date(t.timestamp || t.time).toLocaleString() : ''}</td>
                  <td style={{ padding: '1.25rem', fontSize: '0.875rem', fontWeight: 600, color: t.amount >= 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>{t.type}</td>
                  <td style={{ padding: '1.25rem', fontSize: '0.875rem' }}>{t.description}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 700, color: t.amount >= 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                    {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
