import React from 'react';

const partners = [
  'ZEPTO CAFE', 'UBER EATS', 'ZOMATO', 'SWIGGY', 'MAGIC-PIN', 'EAT SURE', 'DELIVEROO', 'JUST EAT'
];

const TrustTicker: React.FC = () => {
  return (
    <section id="trust" className="py-16 bg-[#000000] overflow-hidden">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-zinc-500 text-sm font-black tracking-[0.3em] uppercase">OFFICIAL PARTNER NETWORK</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4 bg-[#000000]">
          {partners.concat(partners).map((partner, index) => (
            <span 
              key={index} 
              className="text-4xl md:text-6xl font-display font-bold text-zinc-700 hover:text-white transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>

        {/* Second set for seamless loop */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-4" aria-hidden="true">
           {partners.concat(partners).map((partner, index) => (
            <span 
              key={index} 
              className="text-4xl md:text-6xl font-display font-bold text-zinc-700 hover:text-white transition-colors cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustTicker;
