import React, { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#6c6a6a] ${
        isScrolled ? 'shadow-md py-3' : 'py-5'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="RiderGuard Home">
          <Shield className="w-8 h-8 text-yellow-500" aria-hidden="true" />
          <span className="text-2xl font-display tracking-tight font-bold text-black">PARASHIELD</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8" role="menubar">
          <Link to="/plans" className="text-sm font-semibold text-black hover:text-yellow-400 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all duration-300" role="menuitem">Plans</Link>
          <a href="#features" className="text-sm font-semibold text-black hover:text-yellow-400 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all duration-300" role="menuitem">Coverage</a>
          <a href="#trust" className="text-sm font-semibold text-black hover:text-yellow-400 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all duration-300" role="menuitem">Partners</a>
          <a href="#support" className="text-sm font-semibold text-black hover:text-yellow-400 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all duration-300" role="menuitem">Support</a>
          <Link to="/admin/login" className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300 focus:ring-4 focus:ring-yellow-200" role="menuitem">Admin Login</Link>
          <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-black hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,0,0,0.6)] transition-all duration-300 focus:ring-4 focus:ring-yellow-400" role="menuitem">
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-black focus:ring-2 focus:ring-yellow-400 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-zinc-100 py-4 px-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-200" role="menu">
          <Link to="/plans" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold py-2 border-b border-zinc-50" role="menuitem">Plans</Link>
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold py-2 border-b border-zinc-50" role="menuitem">Coverage</a>
          <a href="#trust" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold py-2 border-b border-zinc-50" role="menuitem">Partners</a>
          <a href="#support" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold py-2 border-b border-zinc-50" role="menuitem">Support</a>
          <Link 
            to="/admin/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl text-lg font-bold mt-2 text-center"
            role="menuitem"
          >
            Admin Login
          </Link>
          <Link 
            to="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold mt-2 text-center"
            role="menuitem"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
