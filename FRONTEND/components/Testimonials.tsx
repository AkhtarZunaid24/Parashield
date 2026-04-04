import React from 'react';
import { Quote } from 'lucide-react';
import { useTheme } from '../src/ThemeContext';

const testimonials = [
  {
    name: 'Marco S.',
    role: 'Zomato Rider',
    quote: 'RiderGuard is a lifesaver. When the heavy rains hit Patia last week, the parametric trigger kicked in and my payout arrived before the rain even stopped. No paperwork, just instant support.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Sarah J.',
    role: 'Full-time Delivery Driver',
    quote: 'The Regulatory Guard is exactly what I needed. When my zone was restricted due to social unrest, RiderGuard covered my lost earnings automatically. Its affordable and specifically built for our reality.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'David K.',
    role: 'E-commerce Rider',
    quote: 'Finally, an insurance company that uses real-time data. I love that my premium stays low on clear days and only adjusts when the risk is real. The transparency is unlike any other company.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
];

const Testimonials: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-display font-bold mb-4 uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>RIDER VOICES</h2>
          <p className={`text-xl max-w-2xl mx-auto font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Hear from the thousands of professionals who trust RiderGuard every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-3xl border-4 flex flex-col transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]' 
                  : 'bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]'
              }`}
            >
              <div className="mb-6">
                <Quote className="w-10 h-10 text-yellow-400 fill-yellow-400" />
              </div>
              <p className={`text-lg font-bold mb-8 flex-1 leading-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                "{t.quote}"
              </p>
              <div className={`flex items-center gap-4 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className={`w-14 h-14 rounded-full border-2 object-cover ${theme === 'dark' ? 'border-white' : 'border-black'}`}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t.name}</h4>
                  <p className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
