import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ChevronDown, Info, Zap, CloudRain, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../src/ThemeContext';

// 1. Updated Data Structure with EDF and SDF from your spreadsheet
const AREA_DATA: Record<string, { edf: number, sdf: number, total: number }> = {
  "Acharya Vihar": { edf: 0.28, sdf: 0.18, total: 1.46 },
  "Nayapalli": { edf: 0.27, sdf: 0.16, total: 1.43 },
  "Patia": { edf: 0.20, sdf: 0.22, total: 1.42 },
  "Old Town": { edf: 0.25, sdf: 0.12, total: 1.37 },
  "Rasulgarh": { edf: 0.22, sdf: 0.15, total: 1.37 },
  "Jayadev Vihar": { edf: 0.20, sdf: 0.15, total: 1.35 },
  "Laxmisagar": { edf: 0.18, sdf: 0.12, total: 1.30 },
  "Saheed Nagar": { edf: 0.12, sdf: 0.18, total: 1.30 },
  "Khandagiri": { edf: 0.15, sdf: 0.12, total: 1.27 },
  "Vani Vihar": { edf: 0.14, sdf: 0.12, total: 1.26 },
  "Kalpana": { edf: 0.16, sdf: 0.10, total: 1.26 },
  "VSS Nagar": { edf: 0.15, sdf: 0.08, total: 1.23 },
  "Satyanagar": { edf: 0.10, sdf: 0.10, total: 1.20 },
  "Sailashree Vihar": { edf: 0.08, sdf: 0.06, total: 1.14 },
  "Kalinga Vihar": { edf: 0.06, sdf: 0.04, total: 1.10 }
};

const BASE_PRICE = 34;

const Plans: React.FC = () => {
  const { theme } = useTheme();
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Logic: Multiplier = 1.0 (Default) + EDF + SDF
  const areaInfo = AREA_DATA[selectedArea];
  const multiplier = areaInfo ? areaInfo.total : 1.0;
  const finalPremium = Math.round(BASE_PRICE * multiplier);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-black'}`}>
      <Navbar />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-display font-black uppercase mb-4 leading-none tracking-tighter">
              RISK <span className="text-yellow-500">TRANSPARENCY</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">
              Environmental & Social Risk Factor Breakdown
            </p>
          </div>

          <div className={`relative border-4 rounded-[40px] p-8 md:p-12 transition-all ${
            theme === 'dark' 
              ? 'bg-zinc-900 border-white/10 shadow-[24px_24px_0px_0px_rgba(255,255,255,0.02)]' 
              : 'bg-white border-black/10 shadow-[24px_24px_0px_0px_rgba(0,0,0,0.04)]'
          }`}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-6">Plan Identity</h3>
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-yellow-400 rounded-2xl text-black">
                      <ShieldCheck size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-black text-3xl tracking-tighter leading-none uppercase">Para-Shield Alpha</p>
                      <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-1 italic">Calculated Weekly Rate</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Geographic Input</h3>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={20} />
                    <select 
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className={`w-full pl-12 pr-10 py-5 rounded-2xl border-2 font-black uppercase text-xs appearance-none outline-none transition-all cursor-pointer ${
                        theme === 'dark' 
                          ? 'bg-black border-white/10 focus:border-yellow-500' 
                          : 'bg-zinc-100 border-black/5 focus:border-black'
                      }`}
                    >
                      <option value="" disabled>Select Delivery Zone</option>
                      {Object.keys(AREA_DATA).map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={18} />
                  </div>
                  
                  {/* MULTIPLIER BREAKDOWN DISPLAY */}
                  {selectedArea && areaInfo && (
                    <div className="p-5 rounded-2xl bg-yellow-400/5 border border-yellow-400/10 space-y-3 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-yellow-500" />
                          <span className="text-[10px] font-black uppercase opacity-70 tracking-tight">Zone Multiplier</span>
                        </div>
                        <span className="text-sm font-black text-yellow-500">{multiplier}x</span>
                      </div>
                      
                      <div className="grid grid-cols-3 text-center items-center">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase opacity-40 leading-none">Base</p>
                            <p className="text-xs font-black">1.0</p>
                        </div>
                        <div className="text-yellow-500 font-bold opacity-40">+</div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase opacity-40 leading-none">EDF (Env)</p>
                            <p className="text-xs font-black">+{areaInfo.edf.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 text-center items-center pt-1">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase opacity-40 leading-none">SDF (Social)</p>
                            <p className="text-xs font-black">+{areaInfo.sdf.toFixed(2)}</p>
                        </div>
                        <div className="text-yellow-500 font-bold opacity-40">=</div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase opacity-40 leading-none">Result</p>
                            <p className="text-xs font-black text-yellow-500">{multiplier}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className={`p-12 rounded-[32px] text-center flex flex-col justify-center items-center ${
                theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Calculated Premium</p>
                
                <div className="flex items-start justify-center">
                  <span className="text-3xl font-black mt-4 mr-1">₹</span>
                  <span className="text-[120px] font-black tracking-tighter leading-none">
                    {finalPremium}
                  </span>
                </div>

                <div className="mt-8 w-full space-y-4">
                  <Link 
                    to={`/signup?area=${selectedArea}&price=${finalPremium}`}
                    className={`block w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all shadow-lg ${
                      !selectedArea 
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-50' 
                        : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {selectedArea ? "Confirm Calculation" : "Pick Delivery Zone"}
                  </Link>
                  <p className="text-[9px] font-bold uppercase opacity-40 tracking-tighter">
                    Price = Base (₹34) × Multiplier ({multiplier}x)
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className={`p-6 rounded-3xl border-2 transition-colors ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5'}`}>
                <div className="text-yellow-500 mb-3 flex items-center gap-2">
                    <CloudRain size={20}/>
                    <h4 className="font-black uppercase text-xs">Environmental Factor (EDF)</h4>
                </div>
                <p className="text-[10px] font-bold opacity-50 leading-relaxed">Adjusts premium based on local waterlogging, heat island intensity, and drainage infrastructure stress.</p>
              </div>
              <div className={`p-6 rounded-3xl border-2 transition-colors ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5'}`}>
                <div className="text-yellow-500 mb-3 flex items-center gap-2">
                    <Zap size={20}/>
                    <h4 className="font-black uppercase text-xs">Social Factor (SDF)</h4>
                </div>
                <p className="text-[10px] font-bold opacity-50 leading-relaxed">Calculated by real-time rally frequency, VIP transit delays, and commercial footfall disruptions.</p>
              </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Plans;