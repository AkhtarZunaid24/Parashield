import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Facebook, Chrome } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('riderguard_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('riderguard_remembered_email', email);
    } else {
      localStorage.removeItem('riderguard_remembered_email');
    }
    // In a real app, we would validate credentials here
    navigate('/dashboard');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if rider document exists
      const riderDoc = await getDoc(doc(db, 'riders', user.uid));
      
      if (!riderDoc.exists()) {
        // Create initial rider profile if it doesn't exist
        await setDoc(doc(db, 'riders', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'rider',
          createdAt: serverTimestamp(),
          vehicleType: 'E-bike' // Default
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity" aria-label="RiderGuard Home">
        <Shield className="w-10 h-10 text-yellow-500" aria-hidden="true" />
        <span className="text-3xl font-display font-bold text-black">PARASHIELD</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 id="login-heading" className="text-3xl font-black text-black mb-2 uppercase">WELCOME BACK</h1>
        <p className="text-zinc-500 font-bold mb-8 uppercase tracking-wider">Enter your rider credentials</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin} aria-labelledby="login-heading">
          <div>
            <label htmlFor="email" className="block text-sm font-black text-zinc-700 uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" aria-hidden="true" />
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@example.com"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black text-zinc-700 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" aria-hidden="true" />
              <input 
                id="password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-black/20 bg-zinc-100 text-black focus:ring-black cursor-pointer transition-all"
              />
              <label htmlFor="remember-me" className="text-xs font-black text-zinc-500 uppercase cursor-pointer select-none">
                Remember Me
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-xs font-black text-zinc-500 hover:text-black uppercase tracking-widest transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black disabled:opacity-50"
          >
            {isLoading ? 'LOADING...' : 'LOG IN'}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-black/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-zinc-500 font-bold uppercase tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 py-4 border-2 border-black/10 rounded-xl font-black text-black hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            GOOGLE
          </button>
          <button 
            disabled={isLoading}
            className="flex items-center justify-center gap-3 py-4 border-2 border-black/10 rounded-xl font-black text-black hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            <Facebook className="w-5 h-5" />
            FACEBOOK
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link 
            to="/admin/login" 
            className="w-full text-center py-3 border-2 border-black/10 rounded-xl text-xs font-black text-zinc-500 hover:border-black/30 hover:text-black uppercase tracking-widest transition-all"
          >
            Admin Login
          </Link>
          
          <p className="text-center text-zinc-500 font-bold">
            NEW RIDER?{' '}
            <Link to="/signup" className="text-black underline hover:text-zinc-600 transition-colors">
              CREATE ACCOUNT
            </Link>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-400 text-xs font-black uppercase tracking-widest">
        Secure 256-bit Encrypted Login
      </p>
    </div>
  );
};

export default Login;
