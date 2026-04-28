import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBotPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass"
            style={{
              width: '400px',
              height: '600px',
              marginBottom: '1rem',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              padding: '1rem', 
              background: 'var(--bg-tertiary)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AuraTrade Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, background: '#fff' }}>
              <iframe
                src="https://www.chatbase.co/chatbot-iframe/lWBvFS4t4orYMqQkdNP5s"
                width="100%"
                style={{ height: '100%', border: 'none' }}
                allow="microphone"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: isOpen ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
          color: isOpen ? 'var(--text-primary)' : 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          transition: 'background 0.3s ease'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
}
