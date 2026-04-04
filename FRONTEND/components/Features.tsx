import React from 'react';
import { HeartPulse, ShieldAlert, Bike } from 'lucide-react';

const features = [
  {
    title: 'Localized Environmental & Safety Guard',
    description: 'Instant income replacement when extreme weather—like heavy rainfall, waterlogging, or severe heatwaves.',
    icon: HeartPulse,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    title: 'Social & Regulatory Income Protection',
    description: 'Guaranteed daily payout during government-mandated curfews, localized social unrest, or zone-wide restrictions that prevent you from fulfilling orders.',
    icon: ShieldAlert,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Localized Market & Operations Guard',
    description: 'Protection against road chaos. Automated payouts for traffic gridlock, smog, and logistical downtime.',
    icon: Bike,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">BUILT FOR THE ROAD</h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            We understand the risks you face every day. Our plans are designed specifically for the gig economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-10 rounded-3xl border-2 border-zinc-100 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl bg-white"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">{feature.title}</h3>
              <p className="text-zinc-600 leading-relaxed font-medium">
                {feature.description}
              </p>
              <button 
                className="mt-8 text-black font-bold flex items-center gap-2 hover:gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md px-2 py-1 -ml-2"
                aria-label={`Learn more about ${feature.title}`}
              >
                Learn more <span className="text-yellow-500" aria-hidden="true">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
