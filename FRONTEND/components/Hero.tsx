import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const Hero: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [premium, setPremium] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Zones mapped with Bhubaneswar coordinates for the Backend
  const zones = [
    { id: 'patia', name: 'Patia', lat: 20.353, lon: 85.826 },
    { id: 'khandagiri', name: 'Khandagiri', lat: 20.267, lon: 85.783 },
    { id: 'jaydev_vihar', name: 'Jaydev Vihar', lat: 20.296, lon: 85.824 },
    { id: 'saheed_nagar', name: 'Saheed Nagar', lat: 20.286, lon: 85.842 },
    { id: 'rasulgarh', name: 'Rasulgarh', lat: 20.288, lon: 85.859 },
    { id: 'acharya_vihar', name: 'Acharya Vihar', lat: 20.294, lon: 85.834 },
    { id: 'vss_nagar', name: 'VSS Nagar', lat: 20.312, lon: 85.861 },
    { id: 'kalinga_vihar', name: 'Kalinga Vihar', lat: 20.239, lon: 85.765 },
    { id: 'laxmisagar', name: 'Laxmisagar', lat: 20.274, lon: 85.850 },
    { id: 'kalpana', name: 'Kalpana', lat: 20.258, lon: 85.840 },
    { id: 'sailashree_vihar', name: 'Sailashree Vihar', lat: 20.339, lon: 85.815 },
    { id: 'vani_vihar', name: 'Vani Vihar', lat: 20.292, lon: 85.848 },
    { id: 'satyanagar', name: 'Satyanagar', lat: 20.282, lon: 85.841 },
    { id: 'old_town', name: 'Old Town', lat: 20.234, lon: 85.838 }
  ];

  const handleCheckRate = async () => {
    if (!selectedZone) return;

    setLoading(true);
    setPremium(null);

    const zoneData = zones.find(z => z.id === selectedZone);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/pricing/calculate_premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_name: zoneData?.name,
          lat: zoneData?.lat,
          lon: zoneData?.lon
        })
      });

      const data = await response.json();
      setPremium(data.daily_premium);
    } catch (error) {
      console.error("Failed to fetch premium:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626228067612-81092d79477b?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#2d2d2d]/80 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-none mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          PROTECTING THE <br />
          <span className="text-yellow-400">PULSE OF THE CITY</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
           Guard against income loss from extreme weather and localized environmental disruptions.
        </p>

        {/* --- Input Container --- */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-3 rounded-3xl md:rounded-full shadow-[0_0_50px_rgba(250,204,21,0.15)] border border-white/20">
          
          <div className="relative w-full" ref={dropdownRef}>
            {isOpen && (
              <div className="absolute bottom-[105%] left-0 w-full bg-white border border-zinc-100 rounded-2xl shadow-2xl z-[100] max-h-[250px] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
                <ul className="py-2 flex flex-col w-full text-left">
                  {zones.map((zone) => (
                    <li key={zone.id} className="w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedZone(zone.id);
                          setIsOpen(false);
                          setPremium(null); // Reset premium when location changes
                        }}
                        className={`w-full text-left px-6 py-3 transition-colors hover:bg-zinc-50 hover:text-yellow-600 block ${
                          selectedZone === zone.id ? 'bg-zinc-50 text-yellow-600 font-semibold' : 'text-zinc-600 font-medium'
                        }`}
                      >
                        {zone.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-6 py-4 text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-2xl md:rounded-full bg-white hover:bg-zinc-50 transition-all shadow-lg"
            >
              <span className={selectedZone ? "text-black text-lg" : "text-zinc-500 text-lg"}>
                {selectedZone ? zones.find(z => z.id === selectedZone)?.name : 'Select delivery zone'}
              </span>
              <ChevronDown 
                size={20} 
                className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          <button 
            onClick={handleCheckRate}
            disabled={loading || !selectedZone}
            className="w-full md:w-auto bg-[#facc15] text-black px-8 py-4 rounded-xl md:rounded-full font-black text-lg hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:-translate-y-1"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'CHECK YOUR RATE'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>

        {/* --- PREMIUM RESULT REVEAL --- */}
        {premium && (
          <div className="mt-8 max-w-md mx-auto animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-[1px] rounded-3xl">
              <div className="bg-zinc-900/90 backdrop-blur-2xl rounded-[23px] p-6 text-left border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} /> AI Calculated Premium
                    </p>
                    <h3 className="text-white text-2xl font-bold mt-1">Ready to Cover.</h3>
                  </div>
                  <ShieldCheck className="text-yellow-400" size={32} />
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-white">₹{premium}</span>
                  <span className="text-zinc-400 font-medium">/ daily shift</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Max Payout</span>
                      <span className="text-white font-bold">₹720</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Risk Assessment</span>
                      <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-tighter bg-emerald-400/10 px-2 py-1 rounded-full">Live Verified</span>
                   </div>
                </div>

                <button className="w-full mt-4 bg-white text-black py-3 rounded-2xl font-black hover:bg-zinc-200 transition-colors">
                  ACTIVATE PROTECTION
                </button>
              </div>
            </div>
          </div>
        )}
        
        <p className="mt-6 text-zinc-400 text-sm font-bold uppercase tracking-widest">
          Trusted by 50,000+ riders nationwide
        </p>
      </div>
    </section>
  );
};

export default Hero;