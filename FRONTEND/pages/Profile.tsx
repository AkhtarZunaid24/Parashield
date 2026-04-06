import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, // Changed from CreditCard for the location parameter
  Shield, 
  Smartphone, 
  ChevronLeft, 
  Save, 
  CheckCircle2,
  ExternalLink,
  Plus,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../src/ThemeContext';

const Profile: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  
  // 1. Updated Profile State: Replaced license with primaryZone
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.s@delivery.com',
    phone: '+91 98765 43210',
    primaryZone: 'Acharya Vihar', // Placeholder based on our previous logic
    vehicle: 'Honda Activa 6G (MH-01-AB-1234)'
  });

  // 2. Updated Policy Details Logic
  // Base 34 * Nayapalli Multiplier (1.5) = ₹51
  // Coverage = 85% of 51 = ₹43.35
  const policyDetails = {
    id: 'RG-8821-W',
    weeklyPremium: '₹51.00', // The "Multiplier Amount" he is paying
    coverage: '₹43.35',      // 85% of weekly payment per payout
    nextRenewal: 'April 11, 2026',
    status: 'Active'
  };

  const themeClass = theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-black';
  const cardClass = theme === 'dark' ? 'bg-zinc-900 border-white/10 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]' : 'bg-white border-zinc-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]';
  const inputClass = theme === 'dark' ? 'bg-zinc-800 border-white/10 text-white focus:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-black focus:bg-white';

  const [linkedApps] = useState([
    { name: 'Swiggy', status: 'Connected', icon: 'https://picsum.photos/seed/swiggy/40/40' },
    { name: 'Zomato', status: 'Connected', icon: 'https://picsum.photos/seed/zomato/40/40' },
    { name: 'Dunzo', status: 'Not Linked', icon: 'https://picsum.photos/seed/dunzo/40/40' }
  ]);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen font-sans pb-12 transition-colors duration-300 ${themeClass}`}>
      {/* Header */}
      <header className={`border-b-2 sticky top-0 z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className={`p-2 rounded-xl transition-colors border-2 border-transparent ${theme === 'dark' ? 'hover:bg-zinc-800 hover:border-white/10' : 'hover:bg-zinc-100 hover:border-zinc-200'}`}>
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-black uppercase tracking-tight">Rider Profile</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'border-white/10 hover:bg-zinc-800 text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                isEditing 
                  ? 'bg-green-500 text-white border-green-600' 
                  : (theme === 'dark' ? 'bg-yellow-400 text-black border-white' : 'bg-yellow-400 text-black border-black')
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        {/* Profile Section */}
        <section className={`border-2 rounded-3xl p-8 transition-colors duration-300 ${cardClass}`}>
          <div className="flex items-center gap-6 mb-8">
            <div className={`w-24 h-24 border-2 rounded-2xl flex items-center justify-center relative overflow-hidden group ${theme === 'dark' ? 'bg-zinc-800 border-white/10' : 'bg-zinc-100 border-zinc-200'}`}>
              <img src="https://picsum.photos/seed/rider/200/200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{profile.name}</h2>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">Verified Rider • {profile.primaryZone} Sector</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-green-500/20">KYC Verified</span>
                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-500/20">Risk-Adjusted</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase mb-1 block opacity-50">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl font-bold text-sm outline-none disabled:opacity-50 transition-all ${inputClass}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase mb-1 block opacity-50">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl font-bold text-sm outline-none disabled:opacity-50 transition-all ${inputClass}`}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase mb-1 block opacity-50">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl font-bold text-sm outline-none disabled:opacity-50 transition-all ${inputClass}`}
                  />
                </div>
              </div>
              {/* CHANGE: Driving License -> Primary Delivery Zone */}
              <div>
                <label className="text-[10px] font-black uppercase mb-1 block opacity-50">Primary Delivery Zone</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-yellow-500" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={profile.primaryZone}
                    onChange={(e) => setProfile({...profile, primaryZone: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl font-bold text-sm outline-none disabled:opacity-50 transition-all ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Linked Apps Section remains the same... */}
        <section className={`border-2 rounded-3xl p-8 transition-colors duration-300 ${cardClass}`}>
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
               <Smartphone className="w-5 h-5 text-blue-500" />
               Linked Delivery Apps
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {linkedApps.map((app) => (
               <div key={app.name} className={`p-4 border-2 rounded-2xl flex items-center justify-between group transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                 <div className="flex items-center gap-3">
                   <img src={app.icon} alt={app.name} className="w-8 h-8 rounded-lg border border-black/5" />
                   <div>
                     <p className="text-xs font-black uppercase">{app.name}</p>
                     <p className={`text-[10px] font-bold uppercase ${app.status === 'Connected' ? 'text-green-500' : 'opacity-40'}`}>
                       {app.status}
                     </p>
                   </div>
                 </div>
                 {app.status === 'Connected' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Plus className="w-4 h-4 opacity-40" />}
               </div>
             ))}
           </div>
         </section>

        {/* Insurance Policy Section - UPDATED CARD */}
        <section className={`border-2 rounded-3xl p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 border-white/10 text-white' : 'bg-zinc-900 border-black/10 text-white'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl text-black">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Policy Overview</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Parametric Active</p>
              </div>
            </div>
            <Link to="/plans" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors">
              Manage Rates
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Policy ID stays the same */}
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Policy ID</p>
              <p className="text-sm font-black text-yellow-400">{policyDetails.id}</p>
            </div>
            
            {/* CHANGE: Plan Type -> Weekly Premium (Multiplier Amount) */}
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Weekly Premium</p>
              <p className="text-sm font-black">{policyDetails.weeklyPremium}</p>
              <p className="text-[8px] font-bold text-zinc-600 uppercase">Multiplier Applied</p>
            </div>
            
            {/* CHANGE: Coverage -> 85% of Weekly Payment */}
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Payout Coverage</p>
              <p className="text-sm font-black text-green-400">{policyDetails.coverage}</p>
              <p className="text-[8px] font-bold text-zinc-600 uppercase">85% of Premium</p>
            </div>
            
            {/* Next Renewal */}
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Next Renewal</p>
              <p className="text-sm font-black">{policyDetails.nextRenewal}</p>
            </div>
          </div>

          <div className={`mt-8 p-4 rounded-2xl flex items-center justify-between border ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-zinc-800 border-white/5'}`}>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-yellow-400" />
              <p className="text-xs font-bold uppercase text-zinc-300 tracking-tight">
                Current Risk Multiplier for {profile.primaryZone}: <span className="text-yellow-400 font-black">1.5x</span>
              </p>
            </div>
            <button className="text-[10px] font-black text-yellow-400 uppercase underline">Get Invoice</button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className={`pt-8 border-t-2 ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
          <button className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline opacity-50 hover:opacity-100 transition-opacity">
            Deactivate Account & Cancel Policy
          </button>
        </section>
      </main>
    </div>
  );
};

export default Profile;