import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubmitClaim: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Accident',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-2 border-black rounded-3xl p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="w-20 h-20 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Claim Submitted</h2>
          <p className="text-sm font-bold text-zinc-500 mb-8">
            Your claim has been successfully filed. Our team will review the details and get back to you within 24 hours.
          </p>
          <div className="bg-zinc-50 border-2 border-black rounded-xl p-4 mb-8 text-left">
            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Claim Reference ID</p>
            <p className="text-lg font-black tracking-widest">CLM-{Math.floor(Math.random() * 10000) + 9000}</p>
          </div>
          <Link 
            to="/dashboard"
            className="block w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-black font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-zinc-100 rounded-xl transition-colors border-2 border-transparent hover:border-black">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-black uppercase tracking-tight">File a Claim</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-black uppercase text-yellow-800 mb-1">Emergency Assistance</h3>
            <p className="text-xs font-bold text-yellow-700">
              If you require immediate medical attention or police assistance, please call 112 before filing this claim.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          
          {/* Incident Type */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Type of Incident</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 bg-zinc-50 border-2 border-black rounded-xl font-bold text-sm focus:bg-white outline-none appearance-none cursor-pointer"
              required
            >
              <option value="Weather">Localized Weather Uncertainty</option>
              <option value="Social">Localized Social Unpredictability</option>
              <option value="Market">Localized Market and Operations</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Date of Incident</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl font-bold text-sm focus:bg-white outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Time of Incident</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl font-bold text-sm focus:bg-white outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Exact Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Street address, landmark, or GPS coordinates"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl font-bold text-sm focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Description of Damage / Incident</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
              <textarea 
                placeholder="Please describe exactly what happened and detail any damages or injuries..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl font-bold text-sm focus:bg-white outline-none min-h-[120px] resize-y"
                required
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-[10px] font-black text-zinc-400 uppercase mb-2 block">Evidence & Photos</label>
            <div className="border-2 border-dashed border-black rounded-xl p-8 text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-sm font-black uppercase mb-1">Upload Photos</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Tap to select or drag & drop</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t-2 border-zinc-100">
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <Upload className="w-4 h-4" />
              Submit Claim
            </button>
            <p className="text-center text-[10px] font-bold text-zinc-400 uppercase mt-4">
              By submitting this claim, you confirm that all provided information is accurate and truthful.
            </p>
          </div>

        </form>
      </main>
    </div>
  );
};

export default SubmitClaim;
