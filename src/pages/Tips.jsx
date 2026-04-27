import React from 'react';
import { 
  Lightbulb, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  BarChart2, 
  Zap, 
  Brain, 
  Lock, 
  Eye, 
  Search,
  Scale,
  Activity,
  Award,
  Layers,
  MousePointer2,
  PieChart,
  Repeat,
  AlertTriangle,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const tips = [
  {
    icon: Target,
    title: "Develop a Formal Trading Plan",
    desc: "Never enter the market without a plan. Define your entry criteria, exit strategy, profit targets, and stop-loss levels before placing a trade.",
    category: "Fundamental"
  },
  {
    icon: ShieldCheck,
    title: "Prioritize Risk Management",
    desc: "Never risk more than 1–2% of your total trading capital on a single trade. This protects your account from catastrophic losses.",
    category: "Fundamental"
  },
  {
    icon: Lock,
    title: "Use Stop-Loss Orders",
    desc: "Always place a stop-loss order to automatically exit a losing position at a predetermined level, preventing small losses from becoming large ones.",
    category: "Fundamental"
  },
  {
    icon: Brain,
    title: "Master Your Psychology",
    desc: "Control your emotions. Avoid the pitfalls of fear (panic selling) and greed (holding too long). Stick to your strategy rather than making impulsive decisions.",
    category: "Fundamental"
  },
  {
    icon: BookOpen,
    title: "Continuous Education",
    desc: "The markets are constantly evolving. Stay updated on global economic events, new analytical tools, and changing market dynamics.",
    category: "General"
  },
  {
    icon: Activity,
    title: "Backtest Everything",
    desc: "Before risking real capital on a new strategy, test it against historical data to ensure it has a statistically sound edge.",
    category: "General"
  },
  {
    icon: AlertTriangle,
    title: "Avoid Overtrading",
    desc: "Action bias can lead you to take poor-quality trades just to be 'in the market.' If there is no clear signal, the best position is no position.",
    category: "General"
  },
  {
    icon: TrendingUp,
    title: "Trend Following",
    desc: "Use moving averages (e.g., 20-day or 50-day) to identify the direction of the trend and only take trades that align with that direction.",
    category: "Strategy"
  },
  {
    icon: Layers,
    title: "Support & Resistance",
    desc: "Identify key price levels where an asset has historically struggled to fall below (support) or rise above (resistance).",
    category: "Strategy"
  },
  {
    icon: Zap,
    title: "Breakout Trading",
    desc: "Wait for the price to break through a established support or resistance level on high volume, signaling the start of a new trend.",
    category: "Strategy"
  },
  {
    icon: BarChart2,
    title: "Range Trading",
    desc: "In markets that lack a clear trend, profit from price fluctuations by buying at the bottom of the range and selling at the top.",
    category: "Strategy"
  },
  {
    icon: MousePointer2,
    title: "Paper Trading First",
    desc: "Use a demo account to practice your strategies in real-time market conditions without risking actual capital until you're proven.",
    category: "General"
  },
  {
    icon: Search,
    title: "Analyze Performance regularly",
    desc: "Review your trade history weekly to identify what is working, what isn't, and where you can refine your process.",
    category: "Fundamental"
  },
  {
    icon: Scale,
    title: "Statistical Arbitrage",
    desc: "Use quantitative models to exploit temporary price discrepancies between correlated assets or across different markets.",
    category: "Advanced"
  },
  {
    icon: Eye,
    title: "Order Flow Analysis",
    desc: "Analyze real-time volume and order book dynamics to spot institutional buying or selling pressure early.",
    category: "Advanced"
  },
  {
    icon: PieChart,
    title: "Options Strategies",
    desc: "Employ advanced structures like Iron Condors or Butterfly Spreads to profit from time decay or specific volatility expectations.",
    category: "Advanced"
  },
  {
    icon: Repeat,
    title: "Algorithmic Trading",
    desc: "Use computer programs to automate trade execution based on complex criteria for high speed and precision.",
    category: "Advanced"
  },
  {
    icon: ArrowUpRight,
    title: "Hedging Your Positions",
    desc: "Use derivatives to protect an existing portfolio from adverse market movements during uncertain times.",
    category: "Advanced"
  },
  {
    icon: Award,
    title: "Realistic Expectations",
    desc: "Focus on consistency and capital preservation rather than 'getting rich quick.' Most retail traders lose money initially.",
    category: "Fundamental"
  },
  {
    icon: Lightbulb,
    title: "Treat Trading as Business",
    desc: "Maintain a detailed trading journal to document every trade, including your reasoning, outcome, and emotions.",
    category: "Fundamental"
  }
];

export default function Tips() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
          Trading Tips & Strategies
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Master the markets with these 20 curated tips and strategies designed for both beginners and advanced traders.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {tips.map((tip, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }}
            className="glass-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '0.75rem', 
              right: '1rem', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {tip.category}
            </div>
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <tip.icon size={22} />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{tip.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Ready to practice?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Apply these strategies in our risk-free market simulator.</p>
        <button className="btn btn-primary" onClick={() => navigate('/market')}>Go to Market</button>
      </div>
    </motion.div>
  );
}
