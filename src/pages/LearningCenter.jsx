import React, { useState } from 'react';
import { learningModules } from '../utils/seedData';
import { BookOpen, CheckCircle2, PlayCircle, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LearningCenter() {
  const [selectedModule, setSelectedModule] = useState(null);

  const ModuleCard = ({ module, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card"
      onClick={() => setSelectedModule(module)}
      style={{ cursor: 'pointer', borderLeft: '4px solid var(--accent-primary)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
          Module {module.id}
        </div>
        <Star size={16} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>{module.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{module.lesson}</p>
      
      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
        Continue <ArrowRight size={16} />
      </div>
    </motion.div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Learning Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Master the markets with our structured lessons and quizzes.</p>
        </div>
        <div className="glass" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Star size={20} style={{ color: 'var(--accent-gold)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill Score</div>
            <div style={{ fontWeight: 800 }}>850 XP</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {learningModules.map((m, i) => <ModuleCard key={m.id} module={m} index={i} />)}
      </div>

      <AnimatePresence>
        {selectedModule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.8)', 
              zIndex: 1000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setSelectedModule(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card" 
              style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{selectedModule.title}</h2>
                <button onClick={() => setSelectedModule(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section>
                  <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{selectedModule.lesson}</p>
                </section>

                <section style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} className="text-success" /> Key Takeaways
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {selectedModule.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </section>

                <section>
                  <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlayCircle size={18} style={{ color: 'var(--accent-blue)' }} /> Real-World Example
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-blue)' }}>
                    {selectedModule.example}
                  </p>
                </section>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedModule(null)} style={{ flex: 1 }}>Mark as Read</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heavily Expanded Fundamental Section in Pointers */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={24} className="text-gradient" /> The Trader's Compendium
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Comprehensive market definitions and the absolute basis of trading in clear pointers.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Category 1: Market Core */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--accent-primary)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '0.5rem' }}>• Market Essentials</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0' }}>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Stock Market:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>The ecosystem where shares and bonds are traded. Regulated in India by SEBI.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Nifty & Sensex:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Benchmark indices tracking the top 50 (NSE) and top 30 (BSE) companies by value.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Demat Account:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>A digital locker for holding your shares in electronic form. Mandatory for trading.</p>
              </li>
            </ul>
          </div>

          {/* Category 2: Candlestick basics */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#8b5cf6', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '0.5rem' }}>• Candlestick Charts</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0' }}>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>OHLC:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Each candle shows 4 points: Open (start), High (peak), Low (dip), and Close (end) price.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Body & Wicks:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>The thick 'Body' is the Open-to-Close range. 'Wicks' show the High and Low reached.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Green vs Red:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Green means price rose (Close &gt; Open). Red means price fell (Close &lt; Open).</p>
              </li>
            </ul>
          </div>

          {/* Category 3: Market Hours */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#ec4899', borderBottom: '1px solid rgba(236, 72, 153, 0.2)', paddingBottom: '0.5rem' }}>• Market Functioning</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0' }}>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Trading Hours:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Normal market runs from 9:15 AM to 3:30 PM, Monday to Friday (excluding holidays).</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Pre-Opening:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>9:00 AM to 9:15 AM. Orders are matched to settle the opening price of the day.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Post-Closing:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>3:30 PM to 3:40 PM. Used to calculate the official closing price of a stock.</p>
              </li>
            </ul>
          </div>

          {/* Category 4: Styles */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: '#fbbf24', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', paddingBottom: '0.5rem' }}>• Trading Styles & Basis</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0' }}>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Intraday vs Delivery:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Intraday is same-day exit. Delivery is holding for days or years (Investing).</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Fundamental vs Technical:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Fundamentals look at money/stats. Technicals look at charts/patterns.</p>
              </li>
              <li style={{ listStyleType: 'none' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Bull vs Bear:</strong> 
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Bulls push UP (optimism); Bears pull DOWN (pessimism).</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
