import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { auth } from '../src/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
        <Shield className="w-10 h-10 text-yellow-500" />
        <span className="text-3xl font-display font-black text-black">RIDERGUARD</span>
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Link to="/login" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-black uppercase text-xs mb-6">
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <h1 className="text-3xl font-black text-black mb-2 uppercase">RESET PASSWORD</h1>
        <p className="text-zinc-500 font-bold mb-8 uppercase tracking-wider">
          {status === 'success' 
            ? 'Check your inbox' 
            : 'Enter your email to receive a reset link'}
        </p>

        {status === 'success' ? (
          <div className="bg-green-50 border-2 border-green-500 p-6 rounded-2xl flex flex-col items-center text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-green-800 font-bold mb-4">
              We've sent a password reset link to <br />
              <span className="font-black underline">{email}</span>
            </p>
            <p className="text-green-600 text-sm font-medium mb-6">
              Please check your spam folder if you don't see it within a few minutes.
            </p>
            <Link 
              to="/login" 
              className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
            >
              RETURN TO LOGIN
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-600">
                <AlertCircle className="shrink-0 w-5 h-5" />
                <p className="text-sm font-bold">{errorMessage}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-black text-zinc-700 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-100 border-2 border-black/10 focus:border-black focus:bg-white rounded-xl outline-none font-bold transition-all text-black placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-zinc-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>
        )}
      </div>
      
      <p className="mt-8 text-zinc-400 text-xs font-black uppercase tracking-widest">
        Secure Password Recovery System
      </p>
    </div>
  );
};

export default ForgotPassword;
