import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Download, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function History() {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe = () => {};
    
    try {
      // 1. Try to fetch from Firestore
      const q = query(
        collection(db, "orders"), 
        where("uid", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              time: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : data.time || 'Pending'
            };
          });
          setOrders(items);
        } else {
          // If Firestore is empty, check local storage
          const localOrders = JSON.parse(localStorage.getItem(`mockOrders_${currentUser.uid}`) || '[]');
          setOrders(localOrders);
        }
      }, (error) => {
        console.warn("Firestore History unavailable, falling back to local:", error);
        const localOrders = JSON.parse(localStorage.getItem(`mockOrders_${currentUser.uid}`) || '[]');
        setOrders(localOrders);
      });
    } catch (e) {
      const localOrders = JSON.parse(localStorage.getItem(`mockOrders_${currentUser.uid}`) || '[]');
      setOrders(localOrders);
    }

    // Listen for local updates (from trades)
    const handleLocalUpdate = () => {
      const localOrders = JSON.parse(localStorage.getItem(`mockOrders_${currentUser.uid}`) || '[]');
      setOrders(prev => {
        // If we have Firestore data, don't overwrite it unless local is newer/different
        // For simplicity in practice mode, we show local if it's the primary source
        return localOrders.length > 0 ? localOrders : prev;
      });
    };
    window.addEventListener('mockBalanceUpdate', handleLocalUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('mockBalanceUpdate', handleLocalUpdate);
    };
  }, [currentUser]);

  function handleExportCSV() {
    if (orders.length === 0) return;

    const headers = ["Time", "Type", "Symbol", "Qty", "Price", "Total", "Status"];
    const csvContent = [
      headers.join(","),
      ...orders.map(o => [
        `"${o.time}"`,
        o.type,
        o.symbol,
        o.qty,
        o.price,
        o.total,
        o.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `order_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Order History</h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete log of all your simulated transactions.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary"><Filter size={18} /> Filter</button>
          <button 
            onClick={handleExportCSV} 
            className="btn btn-secondary"
            disabled={orders.length === 0}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: orders.length === 0 ? '2rem' : 0 }}>
        {orders.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No orders recorded yet. Head to the Market to place your first trade!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '1.25rem' }}>TIME</th>
                <th style={{ padding: '1.25rem' }}>TYPE</th>
                <th style={{ padding: '1.25rem' }}>SYMBOL</th>
                <th style={{ padding: '1.25rem', textAlign: 'right' }}>QTY</th>
                <th style={{ padding: '1.25rem', textAlign: 'right' }}>PRICE</th>
                <th style={{ padding: '1.25rem', textAlign: 'right' }}>TOTAL</th>
                <th style={{ padding: '1.25rem', textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{o.time}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      color: o.type === 'BUY' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                      background: o.type === 'BUY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>{o.type}</span>
                  </td>
                  <td style={{ padding: '1.25rem', fontWeight: 600 }}>{o.symbol}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>{o.qty}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>₹{o.price.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 600 }}>₹{o.total.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: o.status === 'EXECUTED' ? 'var(--accent-primary)' : 'var(--accent-gold)' }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
