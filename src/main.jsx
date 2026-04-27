import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { MarketProvider } from './context/MarketContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MarketProvider>
        <App />
      </MarketProvider>
    </AuthProvider>
  </StrictMode>,
)
