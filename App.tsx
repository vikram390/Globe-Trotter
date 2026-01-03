
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import Community from './pages/Community';
import TripListing from './pages/TripListing';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import Login from './pages/Login';
import CalendarView from './pages/CalendarView';
import Search from './pages/Search';
import { ApiService } from './services/apiService';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(ApiService.getCurrentUser());

  const handleLogin = () => {
    setUser(ApiService.getCurrentUser());
  };

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <Layout onLogout={handleLogout}>{children}</Layout>;
  };

  return (
    <Router>
      <Routes>
        {/* Auth Flow */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        
        {/* Main Application Shell */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><TripListing /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Standalone Planning Screens - Also need Layout for Navigation/Logout access */}
        <Route path="/trip/:id" element={user ? <ProtectedRoute><TripPlanner /></ProtectedRoute> : <Navigate to="/login" replace />} />
        <Route path="/create-trip" element={user ? <ProtectedRoute><CreateTrip /></ProtectedRoute> : <Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
