import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  userLat: number;
  userLon: number;
}

const PricingCalculator: React.FC<Props> = ({ userLat, userLon }) => {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/zones')
      .then(res => setZones(res.data))
      .catch(err => console.error("DB Error", err));
  }, []);

  useEffect(() => {
    if (selectedZone) {
      setLoading(true);
      axios.post('http://127.0.0.1:8000/api/v1/pricing/calculate_premium', {
        location_name: selectedZone,
        lat: userLat,
        lon: userLon
      })
      .then(res => {
        setResult(res.data);
        setLoading(false);
      });
    }
  }, [selectedZone, userLat, userLon]);

  return (
    <div className="bg-slate-900 p-8 rounded-[2rem] border border-blue-500/20 shadow-2xl">
      <h2 className="text-2xl font-black mb-2">Dynamic Rate Finder</h2>
      <p className="text-slate-400 text-sm mb-6">Real-time parametric insurance quote</p>

      <select 
        className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 transition-all mb-8"
        onChange={(e) => setSelectedZone(e.target.value)}
      >
        <option value="">Select Location...</option>
        {zones.map(zone => (
          <option key={zone.id} value={zone.id}>{zone.id}</option>
        ))}
      </select>

      {result && (
        <div className="space-y-4">
          <div className="bg-blue-600 p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Weekly Premium</span>
               <h4 className="text-5xl font-black">₹{result.weekly_premium}</h4>
            </div>
            <div className="absolute top-0 right-0 p-4 text-xs opacity-20 font-mono">
              GPS: {userLat.toFixed(2)}, {userLon.toFixed(2)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] block text-slate-500 uppercase font-bold">Multiplier</span>
              <span className="text-lg font-bold">x{result.risk_analysis.zone_multiplier}</span>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <span className="text-[10px] block text-slate-500 uppercase font-bold">Rainfall</span>
              <span className="text-lg font-bold">{result.risk_analysis.rainfall}mm</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;