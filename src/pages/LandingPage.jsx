import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, BookOpen, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Animated Background Gradients */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'rgba(16, 185, 129, 0.15)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(59, 130, 246, 0.15)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 0
        }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}
        >
          <div className="glass" style={{ display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Zap size={16} style={{ marginRight: '0.5rem' }} /> New Learning Modules Available
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Practice Trading. <br />
            <span className="text-gradient">Build Skills.</span> <br />
            Master the Market.
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            The ultimate zero-risk stock market simulator. Trade with ₹10,00,000 virtual cash, learn complex strategies, and compete with the best performers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Free Practice <ArrowRight size={20} />
            </Link>
            <Link to="/learning" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Explore Features
            </Link>
          </div>

          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.6, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} /> Zero Risk</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} /> Educational focus</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trophy size={18} /> Global Leaderboard</div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything You Need to Master Trading</h2>
            <p style={{ color: 'var(--text-secondary)' }}>A complete ecosystem for the modern investor-in-training.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}
          >
            <motion.div variants={item} className="glass-card">
              <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Pro Trading Terminal</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Experience a professional-grade trading interface with real-time price updates, limit orders, and deep analytics.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card">
              <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '1.5rem' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Smart MCQ Quizzes</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Test your knowledge with our randomized quiz engine. Get 10 unique questions every session to sharpen your skills.
              </p>
            </motion.div>

            <motion.div variants={item} className="glass-card">
              <div style={{ width: '48px', height: '48px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Global Competition</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Climb the ranks on our leaderboard. Compete based on return percentage and quiz accuracy to earn exclusive badges.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>AURATRADE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Auratrade is for educational and simulation purposes only. No real money trading is supported. No real securities are bought or sold. The virtual balance and portfolio data are strictly for practice. Not financial advice.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © 2026 Auratrade Simulation Platform. Built for learners.
          </div>
        </div>
      </footer>
    </div>
  );
}
