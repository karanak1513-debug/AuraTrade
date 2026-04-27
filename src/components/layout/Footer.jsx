import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '2rem', 
      background: 'var(--bg-secondary)', 
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto' }}>
          <strong>DISCLAIMER:</strong> This platform is for educational and simulation purposes only. No real money trading is supported. 
          No real securities are bought or sold. All financial data is simulated. 
          The information provided does not constitute financial, investment, or trading advice. 
          Auratrade is not responsible for any decisions made based on the information provided on this platform.
        </p>
        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          © 2026 Auratrade Simulators. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
