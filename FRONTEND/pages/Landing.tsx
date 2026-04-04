import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TrustTicker from '../components/TrustTicker';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <TrustTicker />
        <Testimonials />
        <Features />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-black mb-8">
              READY TO RIDE WITH PEACE OF MIND?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/login"
                className="w-full sm:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-black hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.6)] transition-all duration-300 text-center"
              >
                GET STARTED NOW
              </Link>
              <Link 
                to="/plans"
                className="w-full sm:w-auto border-4 border-black text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.6)] transition-all duration-300 text-center"
              >
                VIEW ALL PLANS
              </Link>
            </div>
          </div>
        </section>

        {/* Accessibility Note for Outdoor Use */}
        <div className="bg-[#ffffff] py-4 text-center text-xs font-black tracking-widest text-zinc-400 uppercase border-t border-white/5">
          High-Contrast Mode Optimized for Outdoor Viewing
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
