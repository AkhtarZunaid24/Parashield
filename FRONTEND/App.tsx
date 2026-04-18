import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages & Components
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TermsOfService from './pages/TermsOfService';
import SubmitClaim from './pages/SubmitClaim';
import Support from './pages/Support';
import UpgradePlans from './pages/UpgradePlans';
import CursorFollower from './components/CursorFollower';
import { ThemeProvider } from './src/ThemeContext';

// Smooth Scroll & Styling
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const App: React.FC = () => {
  // 1. GLOBAL STATE FOR PARAMETRIC TRACKING
  const [coords, setCoords] = useState({ lat: 20.2961, lon: 85.8245 }); // Default: Bhubaneswar Core

  useEffect(() => {
    // 2. INITIALIZE SMOOTH SCROLL (LENIS)
    console.log('🚀 RiderGuard Engine: Initializing Smooth Scroll...');
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 3. GEOLOCATION (The "Parametric Nerve")
    // We fetch this once at the app level to feed the AI models
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          console.log(`📍 Location Sync: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.warn("⚠️ GPS Denied. Falling back to default Bhubaneswar Hub coordinates.");
        }
      );
    }

    return () => {
      console.log('🛑 Tearing down Lenis...');
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      {/* Visual Enhancements */}
      <CursorFollower />
      
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Rider Protected Routes */}
          {/* We pass the coords to Plans/Dashboard so the AI knows their live risk */}
          <Route path="/dashboard" element={<Dashboard userLat={coords.lat} userLon={coords.lon} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plans" element={<Plans userLat={coords.lat} userLon={coords.lon} />} />
          <Route path="/upgrade-plans" element={<UpgradePlans />} />
          <Route path="/upgrade" element={<Navigate to="/upgrade-plans" replace />} />
          
          {/* Operational Routes */}
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/support" element={<Support />} />
          
          {/* Admin Infrastructure */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback for redundant paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;