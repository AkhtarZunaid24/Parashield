import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronLeft, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../src/ThemeContext';

const TermsOfService: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-zinc-50'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-8 h-8 text-yellow-500" />
            <span className={`text-2xl font-display font-bold uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>RIDERGUARD</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'border-white/10 hover:bg-zinc-800 text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/signup" className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
              <ChevronLeft size={18} />
              Back to Signup
            </Link>
          </div>
        </div>

        <div className={`p-8 md:p-12 rounded-3xl border-4 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-zinc-900 border-white/10 shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)]' 
            : 'bg-white border-black/10 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]'
        }`}>
          <h1 className={`text-4xl font-black mb-4 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Terms of Service</h1>
          <p className={`font-bold mb-10 uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Last Updated: March 14, 2026</p>

          <div className="space-y-10">
            {[
              {
                title: "1. Acceptance of Terms",
                content: "By accessing and using RiderGuard, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service."
              },
              {
                title: "2. Eligibility",
                content: "You must be at least 18 years old and hold a valid operator's license for your vehicle type to register as a rider."
              },
              {
                title: "3. Insurance Coverage",
                content: "Coverage is only active while you are 'Clocked In' on the platform. RiderGuard provides supplemental insurance and does not replace mandatory third-party liability insurance."
              },
              {
                title: "4. Rider Conduct",
                content: "Riders are expected to follow all traffic laws. Reckless driving, as determined by our AI safety scoring, may result in policy termination or premium increases."
              },
              {
                title: "5. Claims Process",
                content: "Claims must be reported within 24 hours of the incident. Accurate evidence, including photos and police reports, is required for processing."
              },
              {
                title: "6. Privacy & Data",
                content: "We collect GPS and vehicle data to provide real-time protection and risk assessment. Your data is encrypted and handled according to our Privacy Policy."
              }
            ].map((term, index) => (
              <section key={index} className="relative pl-8">
                <div className="absolute left-0 top-1">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className={`text-xl font-black mb-3 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{term.title}</h2>
                <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {term.content}
                </p>
              </section>
            ))}
          </div>

          <div className={`mt-16 pt-10 border-t-2 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
            <p className={`text-sm font-bold text-center uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
              By creating an account, you acknowledge that you have read and understood these terms.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/signup" 
            className={`inline-block px-10 py-4 rounded-xl font-black text-lg transition-all shadow-lg uppercase tracking-widest ${
              theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            I Understand, Let's Ride
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
