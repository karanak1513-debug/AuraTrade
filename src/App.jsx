import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages - to be created
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Watchlist from './pages/Watchlist';
import Leaderboard from './pages/Leaderboard';
import LearningCenter from './pages/LearningCenter';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import Wallet from './pages/Wallet';
import Tips from './pages/Tips';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { currentUser, userData } = useAuth();
  return currentUser && userData?.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = useAuth();

  if (!currentUser) return children;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flex: 1 }}>
        {sidebarOpen && <Sidebar />}
        <main style={{ 
          flex: 1, 
          padding: '1.5rem', 
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/market" element={<PrivateRoute><Market /></PrivateRoute>} />
          <Route path="/stock/:symbol" element={<PrivateRoute><StockDetail /></PrivateRoute>} />
          <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          
          <Route path="/learning" element={<PrivateRoute><LearningCenter /></PrivateRoute>} />
          <Route path="/tips" element={<PrivateRoute><Tips /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/quiz/result/:attemptId" element={<PrivateRoute><QuizResult /></PrivateRoute>} />
          
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
