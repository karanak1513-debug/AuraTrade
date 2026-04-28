import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { MarketProvider } from './context/MarketContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <MarketProvider>
          <App />
        </MarketProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
