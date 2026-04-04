import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Bike, Chrome, Facebook } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1: return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2: return { score: 50, label: 'Fair', color: 'bg-yellow-500' };
      case 3: return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4: return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
      default: return { score: 0, label: '', color: 'bg-zinc-200' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    // In a real app, we would handle registration here
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
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-4 py-12">
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity" aria-label="RiderGuard Home">
        <Shield className="w-10 h-10 text-yellow-500" aria-hidden="true" />
        <span className="text-3xl font-display font-bold text-black">RIDERGUARD</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 id="signup-heading" className="text-3xl font-black text-black mb-2 uppercase">JOIN THE FLEET</h1>
        <p className="text-zinc-500 font-bold mb-8 uppercase tracking-wider">Start protecting your ride today</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSignup} aria-labelledby="signup-heading">
          <div>
            <label htmlFor="full-name" className="block text-sm font-black text-zinc-700 uppercase mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" aria-hidden="true" />
              <input 
                id="full-name"
                type="text" 
                required
                placeholder="John Rider"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-black text-zinc-700 uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" aria-hidden="true" />
              <input 
                id="email"
                type="email" 
                required
                placeholder="rider@example.com"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="vehicle-type" className="block text-sm font-black text-zinc-700 uppercase mb-2">Vehicle Type</label>
            <div className="relative">
              <Bike className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" aria-hidden="true" />
              <select 
                id="vehicle-type"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all appearance-none cursor-pointer text-black"
              >
                <option className="bg-white">E-bike</option>
                <option className="bg-white">Scooter</option>
                <option className="bg-white">Motorcycle</option>
                <option className="bg-white">Car</option>
                <option className="bg-white">Bicycle</option>
              </select>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
                aria-describedby="password-strength"
              />
            </div>
            {password && (
              <div id="password-strength" className="mt-3 space-y-2" aria-live="polite">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Strength</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                    role="progressbar"
                    aria-valuenow={strength.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Password strength: ${strength.label}`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3">
            <div className="relative flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-black/20 bg-zinc-100 text-black focus:ring-black cursor-pointer transition-all"
                required
              />
            </div>
            <label htmlFor="terms" className="text-xs font-bold text-zinc-500 uppercase leading-tight cursor-pointer select-none">
              I agree to the <Link to="/terms" className="text-black underline">Terms and Conditions</Link> and <Link to="/terms" className="text-black underline">Privacy Policy</Link>.
            </label>
          </div>

          <button 
            type="submit"
            disabled={!agreedToTerms || isLoading}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${
              agreedToTerms && !isLoading
                ? 'bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer' 
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50 shadow-none border-black/10'
            }`}
          >
            {isLoading ? 'JOINING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-black/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-zinc-500 font-bold uppercase tracking-widest">Or join with</span>
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

        <p className="mt-10 text-center text-zinc-500 font-bold">
          ALREADY A RIDER?{' '}
          <Link to="/login" className="text-black underline hover:text-zinc-600 transition-colors">
            LOG IN
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
