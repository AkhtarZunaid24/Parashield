import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { ThemeProvider } from './src/ThemeContext';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import UpgradePlans from './pages/UpgradePlans';
import CursorFollower from './components/CursorFollower';

const App: React.FC = () => {
  useEffect(() => {
    console.log('Initializing Lenis...');
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      console.log('Destroying Lenis...');
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <CursorFollower />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/submit-claim" element={<SubmitClaim />} />
          <Route path="/support" element={<Support />} />
          <Route path="/upgrade-plans" element={<UpgradePlans />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/upgrade" element={<UpgradePlans />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
