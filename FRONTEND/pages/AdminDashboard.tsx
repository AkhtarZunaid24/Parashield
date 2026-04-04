import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Map as MapIcon, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Wallet,
  Activity,
  ChevronRight,
  UserCheck,
  Upload,
  Cpu // Added icon for the AI Test
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Legend
} from 'recharts';

// Mock Data
const POLICY_DATA = [
  { name: 'Mon', new: 4, renewals: 3 },
  { name: 'Tue', new: 5, renewals: 3 },
  { name: 'Wed', new: 4, renewals: 4 },
  { name: 'Thu', new: 6, renewals: 3 },
  { name: 'Fri', new: 5, renewals: 4 },
  { name: 'Sat', new: 6, renewals: 5 },
  { name: 'Sun', new: 4, renewals: 3 },
];

const REVENUE_BY_CITY = [
  { name: 'Mumbai', value: 450000, accidents: 12 },
  { name: 'Delhi', value: 380000, accidents: 15 },
  { name: 'Bangalore', value: 320000, accidents: 8 },
  { name: 'Hyderabad', value: 280000, accidents: 10 },
  { name: 'Pune', value: 210000, accidents: 5 },
];

const ML_ACCURACY_DATA = [
  { time: '08:00', actual: 45, predicted: 42, accuracy: 93 },
  { time: '10:00', actual: 52, predicted: 55, accuracy: 94 },
  { time: '12:00', actual: 89, predicted: 85, accuracy: 95 },
  { time: '14:00', actual: 110, predicted: 115, accuracy: 95 },
  { time: '16:00', actual: 105, predicted: 100, accuracy: 95 },
  { time: '18:00', actual: 130, predicted: 125, accuracy: 96 },
  { time: '20:00', actual: 85, predicted: 90, accuracy: 94 },
];

const ALL_CLAIMS = [
  { id: 'CLM-9021', rider: 'Rahul Sharma', type: 'RAINFALL TRIGGER (18mm)', status: 'Urgent', time: '2 mins ago', amount: '₹800', policy: 'RG-8821-W' },
  { id: 'CLM-9020', rider: 'Amit Patel', type: 'CURFEW DISRUPTION', status: 'Pending', time: '15 mins ago', amount: '₹450', policy: 'RG-8820-X' },
  { id: 'CLM-9019', rider: 'Suresh Kumar', type: 'HEATWAVE PROTECTION', status: 'Review', time: '1 hour ago', amount: '₹850', policy: 'RG-8819-Y' },
  { id: 'CLM-9018', rider: 'Priya Das', type: 'Accident', status: 'Approve', time: '2 hours ago', amount: '₹5,000', policy: 'RG-8818-Z' },
  { id: 'CLM-9017', rider: 'Vikram Singh', type: 'Damage', status: 'Reject', time: '5 hours ago', amount: '₹2,500', policy: 'RG-8817-A' },
  { id: 'CLM-9016', rider: 'Arjun Reddy', type: 'Theft', status: 'Pending', time: '1 day ago', amount: '₹50,000', policy: 'RG-8816-B' },
  { id: 'CLM-9015', rider: 'Neha Gupta', type: 'Medical', status: 'Urgent', time: '1 day ago', amount: '₹15,000', policy: 'RG-8815-C' },
];

const RIDERS = [
  { id: 'RD-101', name: 'Vikram Singh', email: 'vikram.s@example.com', vehicle: 'Honda Activa', kyc: 'Verified', score: 92, balance: '₹1,250', status: 'Active' },
  { id: 'RD-102', name: 'Priya Das', email: 'priya.d@example.com', vehicle: 'TVS XL100', kyc: 'Pending', score: 78, balance: '₹450', status: 'Active' },
  { id: 'RD-103', name: 'Arjun Reddy', email: 'arjun.r@example.com', vehicle: 'Bajaj Pulsar', kyc: 'Verified', score: 55, balance: '₹2,100', status: 'Inactive' },
];

const RIDER_ACTIVITY_LOG = [
  { id: 1, rider: 'Vikram Singh', action: 'Login', details: 'Logged in from App v2.4', time: '10 mins ago', type: 'system' },
  { id: 2, rider: 'Priya Das', action: 'Safety Incident', details: 'Hard braking detected (Speed: 45km/h)', time: '25 mins ago', type: 'alert' },
  { id: 3, rider: 'Arjun Reddy', action: 'Policy Update', details: 'Upgraded to Pro Rider Plus', time: '1 hour ago', type: 'policy' },
  { id: 4, rider: 'Rahul Sharma', action: 'Login', details: 'Logged in from App v2.4', time: '2 hours ago', type: 'system' },
  { id: 5, rider: 'Amit Patel', action: 'Safety Incident', details: 'Speeding alert (72km/h in 50 zone)', time: '3 hours ago', type: 'alert' },
];

const exportToCSV = (ridersList: any[]) => {
  const headers = ['Rider ID', 'Name', 'Email', 'KYC Status', 'Safety Score', 'Wallet Balance'];
  const csvRows = [
    headers.join(','),
    ...ridersList.map(rider => [
      rider.id,
      `"${rider.name}"`,
      `"${rider.email}"`,
      rider.kyc,
      rider.score,
      `"${rider.balance}"`
    ].join(','))
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'riders_export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

const AdminDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'ops' | 'crm' | 'claims' | 'finance'>('ops');
  const [crmTab, setCrmTab] = useState<'list' | 'activity'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>('All');
  const [claimTypeFilter, setClaimTypeFilter] = useState<string>('All');
  const [selectedClaim, setSelectedClaim] = useState(ALL_CLAIMS[0]);
  const [ridersList, setRidersList] = useState(RIDERS);
  const [selectedKycRider, setSelectedKycRider] = useState<any>(null);

  const [mapFilterType, setMapFilterType] = useState<string>('All');
  const [mapFilterSeverity, setMapFilterSeverity] = useState<string>('All');
  const [mapPins, setMapPins] = useState<any[]>([]);

  // --- ADDED FOR FASTAPI CONNECTION TEST ---
  const [claimResponse, setClaimResponse] = useState<any>(null);
  const [loadingBackend, setLoadingBackend] = useState(false);
  // -----------------------------------------

  useEffect(() => {
    const types = ['Accident', 'Weather', 'Theft'];
    const severities = ['High', 'Medium', 'Low'];
    const initialPins = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
    }));
    setMapPins(initialPins);

    const interval = setInterval(() => {
      setMapPins(prev => {
        const newPins = [...prev];
        for (let i = 0; i < 5; i++) {
          const idx = Math.floor(Math.random() * newPins.length);
          newPins[idx] = {
            ...newPins[idx],
            x: Math.max(5, Math.min(95, newPins[idx].x + (Math.random() * 4 - 2))),
            y: Math.max(5, Math.min(95, newPins[idx].y + (Math.random() * 4 - 2))),
          };
        }
        return newPins;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredPins = useMemo(() => {
    return mapPins.filter(pin => {
      const matchType = mapFilterType === 'All' || pin.type === mapFilterType;
      const matchSeverity = mapFilterSeverity === 'All' || pin.severity === mapFilterSeverity;
      return matchType && matchSeverity;
    });
  }, [mapPins, mapFilterType, mapFilterSeverity]);

  const filteredClaims = useMemo(() => {
    return ALL_CLAIMS.filter(claim => {
      const matchStatus = claimStatusFilter === 'All' || claim.status.toLowerCase() === claimStatusFilter.toLowerCase();
      const matchType = claimTypeFilter === 'All' || claim.type.toLowerCase() === claimTypeFilter.toLowerCase();
      return matchStatus && matchType;
    });
  }, [claimStatusFilter, claimTypeFilter]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // --- ADDED FASTAPI TEST FUNCTION ---
  const testFraudAI = async () => {
    setLoadingBackend(true);
    setClaimResponse(null); // Clear previous response
    try {
      const response = await fetch("http://localhost:8000/api/v1/claims/submit_claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distance_from_trigger_zone_km: 0.1,
          time_since_last_claim_hr: 140.0,
          weather_api_mismatch_score: 0.0,
          claim_hour_of_day: 14,
          accelerometer_flatline_index: 0.95 // The Emulator "Smoking Gun"
        }),
      });

      const data = await response.json();
      setClaimResponse(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setClaimResponse({ 
        status: "CONNECTION ERROR", 
        reason: "Failed to fetch. Ensure FastAPI is running on port 8000.", 
        risk_score: 0 
      });
    } finally {
      setLoadingBackend(false);
    }
  };
  // -----------------------------------

  const themeClass = isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900';
  const cardClass = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${themeClass}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
        <div className="p-6 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-yellow-500" />
          <span className="font-black text-xl tracking-tighter uppercase">GIGGUARD</span> {/* Updated to GigGuard! */}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('ops')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'ops' ? 'bg-black text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            <LayoutDashboard size={18} />
            Operations
          </button>
          <button 
            onClick={() => setActiveTab('crm')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'crm' ? 'bg-black text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            <Users size={18} />
            Rider CRM
          </button>
          <button 
            onClick={() => setActiveTab('claims')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'claims' ? 'bg-black text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            <FileText size={18} />
            Claims
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'finance' ? 'bg-black text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            <BarChart3 size={18} />
            Financials
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">All Systems Nominal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-20 border-b flex items-center justify-between px-8 ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Rider, Policy ID, or License Plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800 focus:border-yellow-500' : 'bg-zinc-50 border-zinc-200 focus:border-black'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-100'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-900' : 'border-zinc-200 hover:bg-zinc-100'}`}>
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
              </button>
            </div>
            <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black uppercase tracking-tighter">Super Admin</p>
                <p className="text-[10px] font-bold text-zinc-400">Enterprise Access</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center font-black text-black">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`p-6 rounded-3xl border shadow-sm ${cardClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-emerald-500">+12% vs LW</span>
              </div>
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">Active Riders</p>
              <h3 className="text-3xl font-black tracking-tighter">3,482</h3>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${cardClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-bold text-emerald-500">+5.2%</span>
              </div>
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">Payout efficiency</p>
              <h3 className="text-3xl font-black tracking-tighter">42.8%</h3>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${cardClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl">
                  <Wallet className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs font-bold text-zinc-400">Forecasted</span>
              </div>
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">Automated Dispersals</p>
              <h3 className="text-3xl font-black tracking-tighter">₹8.4L</h3>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm ${cardClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg animate-pulse">LIVE</span>
              </div>
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">Trigger Events</p>
              <h3 className="text-3xl font-black tracking-tighter">142</h3>
            </div>
          </div>

          {/* --- ADDED UI: FASTAPI CONNECTION TESTER --- */}
          <div className={`mb-8 p-6 rounded-3xl border shadow-sm flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-all ${isDarkMode ? 'bg-zinc-900/50 border-yellow-500/30' : 'bg-yellow-50/50 border-yellow-500/30'}`}>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-500 text-black rounded-2xl">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight uppercase mb-1">Phase 2: FastAPI AI Connection Test</h3>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xl">
                  Click the button to send a mock "Emulator Spoofer" payload to your Python backend. It will run through the Isolation Forest model and return a live prediction.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
              {claimResponse && (
                <div className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold w-full xl:w-auto animate-in fade-in slide-in-from-right-4 ${
                  claimResponse.status === 'REJECTED' || claimResponse.status.includes('ERROR') 
                    ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                }`}>
                  <p className="font-black uppercase tracking-widest mb-1 text-[10px] opacity-70">Backend Response</p>
                  {claimResponse.status}: {claimResponse.reason} <br/> 
                  <span className="opacity-80 font-medium">Risk Score: {claimResponse.risk_score}/100</span>
                </div>
              )}
              
              <button 
                onClick={testFraudAI}
                disabled={loadingBackend}
                className={`w-full sm:w-auto whitespace-nowrap px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  loadingBackend 
                    ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-800' 
                    : 'bg-yellow-500 text-black hover:bg-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105'
                }`}
              >
                {loadingBackend ? "Running Pipeline..." : "Test Fraud API"}
              </button>
            </div>
          </div>
          {/* ------------------------------------------- */}

          {activeTab === 'ops' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Policy Volume Chart */}
                <div className={`lg:col-span-2 p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black tracking-tight uppercase">Policy Volume</h3>
                      <p className="text-sm text-zinc-400 font-medium">New Sign-ups vs Renewals</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold">7 Days</button>
                      <button className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400">30 Days</button>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={POLICY_DATA}>
                        <defs>
                          <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                            border: 'none', 
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Area type="monotone" dataKey="new" stroke="#EAB308" fillOpacity={1} fill="url(#colorNew)" strokeWidth={3} />
                        <Area type="monotone" dataKey="renewals" stroke="#000" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Claim Alerts */}
                <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black tracking-tight uppercase">Live Alerts</h3>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-4">
                    {ALL_CLAIMS.slice(0, 3).map((claim) => (
                      <div key={claim.id} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${claim.status === 'Urgent' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'}`}>
                            {claim.status}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">{claim.time}</span>
                        </div>
                        <h4 className="font-black text-sm mb-1">{claim.rider}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{claim.type} • {claim.id}</p>
                          <p className="text-sm font-black">{claim.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all">
                    View All Incidents
                  </button>
                </div>
              </div>

              {/* Active Riders Map Placeholder */}
              <div className={`p-8 rounded-3xl border shadow-sm overflow-hidden relative ${cardClass}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-black tracking-tight uppercase">Regional Risk Map</h3>
                    <p className="text-sm text-zinc-400 font-medium">Real-time simulated disaster & risk zones</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <select 
                      value={mapFilterType}
                      onChange={(e) => setMapFilterType(e.target.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                    >
                      <option value="All">All Types</option>
                      <option value="Accident">Accident</option>
                      <option value="Weather">Weather</option>
                      <option value="Theft">Theft</option>
                    </select>
                    <select 
                      value={mapFilterSeverity}
                      onChange={(e) => setMapFilterSeverity(e.target.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                    >
                      <option value="All">All Severities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl relative overflow-hidden">
                  {/* Decorative Map Elements */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />
                  
                  {/* Real-time Simulated Pins */}
                  {filteredPins.map((pin) => (
                    <div 
                      key={pin.id}
                      className={`absolute w-3 h-3 rounded-full transition-all duration-1000 ${
                        pin.severity === 'High' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 
                        pin.severity === 'Medium' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : 
                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                      }`}
                      style={{ 
                        top: `${pin.y}%`, 
                        left: `${pin.x}%` 
                      }}
                    />
                  ))}

                  <div className="absolute bottom-6 left-6 p-4 bg-black/80 backdrop-blur-md text-white rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black font-black">
                        {filteredPins.length}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400">Active Risks</p>
                        <p className="text-sm font-bold">Currently Tracked</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ML Model Accuracy Chart */}
              <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-black tracking-tight uppercase">ML Model Accuracy</h3>
                    <p className="text-sm text-zinc-400 font-medium">Predicted vs Actual Claims (Time Series)</p>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ML_ACCURACY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                          border: 'none', 
                          borderRadius: '16px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '12px' }} />
                      <Area type="monotone" dataKey="actual" name="Actual Claims" fill="#3b82f6" stroke="#2563eb" fillOpacity={0.1} strokeWidth={2} />
                      <Line type="monotone" dataKey="predicted" name="Predicted Claims" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">Rider Management</h2>
                <div className="flex flex-wrap gap-3">
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                    <button 
                      onClick={() => setCrmTab('list')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${crmTab === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
                    >
                      Rider List
                    </button>
                    <button 
                      onClick={() => setCrmTab('activity')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${crmTab === 'activity' ? 'bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}
                    >
                      Activity Log
                    </button>
                  </div>
                  <button 
                    onClick={() => exportToCSV(ridersList)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Download size={16} /> Export CSV
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">
                    <Filter size={16} /> Advanced Filter
                  </button>
                </div>
              </div>

              {crmTab === 'list' && (
                <div className={`rounded-3xl border shadow-sm overflow-hidden ${cardClass}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                        <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Rider Details</th>
                        <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">KYC Status</th>
                        <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest"> Reliability Index</th>
                        <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Wallet Balance</th>
                        <th className="p-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ridersList.map((rider) => (
                        <tr key={rider.id} className={`border-b last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black">
                                {rider.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-black text-sm">{rider.name}</p>
                                <p className="text-xs text-zinc-400 font-bold">{rider.email} • {rider.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${rider.kyc === 'Verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                              {rider.kyc}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${rider.score > 80 ? 'bg-emerald-500' : rider.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden max-w-[100px]">
                                <div 
                                  className={`h-full rounded-full ${rider.score > 80 ? 'bg-emerald-500' : rider.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${rider.score}%` }}
                                />
                              </div>
                              <span className={`text-sm font-black ${rider.score > 80 ? 'text-emerald-600 dark:text-emerald-400' : rider.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{rider.score}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <p className="text-sm font-black">{rider.balance}</p>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              {rider.kyc === 'Pending' && (
                                <button 
                                  onClick={() => setSelectedKycRider(rider)}
                                  className="px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 transition-colors"
                                >
                                  Verify KYC
                                </button>
                              )}
                              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                <MoreVertical size={16} className="text-zinc-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {crmTab === 'activity' && (
                <div className={`rounded-3xl border shadow-sm overflow-hidden p-6 ${cardClass}`}>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-6">Recent Rider Activity</h3>
                  <div className="space-y-4">
                    {RIDER_ACTIVITY_LOG.map(log => (
                      <div key={log.id} className={`p-4 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50'}`}>
                        <div className={`p-3 rounded-xl ${
                          log.type === 'alert' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                          log.type === 'policy' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                          'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          {log.type === 'alert' ? <AlertTriangle size={20} /> : log.type === 'policy' ? <ShieldCheck size={20} /> : <Clock size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-sm">{log.rider}</h4>
                            <span className="text-[10px] font-bold text-zinc-400">{log.time}</span>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">{log.action}</p>
                          <p className="text-sm font-medium">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">Claims Management</h2>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-zinc-400" />
                    <select 
                      value={claimStatusFilter}
                      onChange={(e) => setClaimStatusFilter(e.target.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Pending">Pending</option>
                      <option value="Review">Review</option>
                      <option value="Approve">Approve</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                  <select 
                    value={claimTypeFilter}
                    onChange={(e) => setClaimTypeFilter(e.target.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                  >
                    <option value="All">All Types</option>
                    <option value="Accident">Accident</option>
                    <option value="Theft">Theft</option>
                    <option value="Medical">Medical</option>
                    <option value="Damage">Damage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Claims List */}
                <div className={`col-span-1 p-6 rounded-3xl border shadow-sm flex flex-col h-[800px] ${cardClass}`}>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-6">Claims List</h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {filteredClaims.length > 0 ? filteredClaims.map(claim => (
                      <div 
                        key={claim.id} 
                        onClick={() => setSelectedClaim(claim)} 
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedClaim?.id === claim.id ? (isDarkMode ? 'border-yellow-500 bg-zinc-800' : 'border-black bg-zinc-100') : (isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/50' : 'border-zinc-200 hover:bg-zinc-50')}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                            claim.status === 'Urgent' ? 'bg-red-500 text-white' : 
                            claim.status === 'Approve' ? 'bg-emerald-500 text-white' :
                            claim.status === 'Reject' ? 'bg-zinc-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {claim.status}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400">{claim.time}</span>
                        </div>
                        <h4 className="font-black text-sm mb-1">{claim.rider}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{claim.type} • {claim.id}</p>
                          <p className="text-sm font-black">{claim.amount}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold">No claims found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Column */}
                <div className="col-span-1 lg:col-span-2 space-y-8">
                  {/* Evidence Viewer */}
                  <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                    <h3 className="text-xl font-black tracking-tight uppercase mb-6">Evidence Viewer</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <img src={`https://picsum.photos/seed/${selectedClaim?.id}1/400/400`} alt="Evidence 1" className="w-full h-full object-cover rounded-xl mb-2" referrerPolicy="no-referrer" />
                        <p className="text-[10px] font-black uppercase text-zinc-400">Vehicle Damage</p>
                      </div>
                      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                        <img src={`https://picsum.photos/seed/${selectedClaim?.id}2/400/400`} alt="Evidence 2" className="w-full h-full object-cover rounded-xl mb-2" referrerPolicy="no-referrer" />
                        <p className="text-[10px] font-black uppercase text-zinc-400">Police Report</p>
                      </div>
                    </div>
                    {selectedClaim?.status === 'Urgent' && (
                      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className="text-red-500 w-4 h-4" />
                          <p className="text-xs font-black uppercase text-red-500">Fraud Detection Flag</p>
                        </div>
                        <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                          GPS coordinates at time of incident match a known high-fraud zone. Incident reported 45 minutes after occurrence.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Approval Workflow */}
                  <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                    <h3 className="text-xl font-black tracking-tight uppercase mb-6">Claim Processing</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-black font-black">
                          {selectedClaim?.rider.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black">{selectedClaim?.rider}</p>
                          <p className="text-xs text-zinc-400 font-bold">Policy: {selectedClaim?.policy} • Claim: {selectedClaim?.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Claim Amount</p>
                          <p className="text-xl font-black">{selectedClaim?.amount}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Incident Time</p>
                          <p className="text-xl font-black">{selectedClaim?.time}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                          <CheckCircle2 size={20} /> Approve Payout
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                          <XCircle size={20} /> Reject Claim
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-black dark:border-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                          <Clock size={20} /> Request Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Heatmap */}
                <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-8">Revenue vs Risk Heatmap</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={REVENUE_BY_CITY}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                          cursor={{fill: isDarkMode ? '#27272a' : '#f4f4f5'}}
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                            border: 'none', 
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {REVENUE_BY_CITY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.accidents > 12 ? '#ef4444' : '#EAB308'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-xs font-bold">High Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-bold">High Loss Ratio</span>
                    </div>
                  </div>
                </div>

                {/* Payout Forecasting */}
                <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-8">Payout Forecasting</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Approved', value: 45 },
                            { name: 'Pending', value: 30 },
                            { name: 'Reserve', value: 25 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#eab308" />
                          <Cell fill="#3b82f6" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Approved</p>
                      <p className="text-lg font-black">₹4.2L</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Pending</p>
                      <p className="text-lg font-black">₹2.8L</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Reserve</p>
                      <p className="text-lg font-black">₹1.4L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* KYC Verification Modal */}
      {selectedKycRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="p-6 border-b flex justify-between items-center sticky top-0 z-10 bg-inherit border-inherit">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">KYC Verification</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Rider: {selectedKycRider.name}</p>
              </div>
              <button 
                onClick={() => setSelectedKycRider(null)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-zinc-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-black uppercase text-zinc-500">Government ID (Aadhaar)</h4>
                    <label className="cursor-pointer text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1">
                      <Upload size={12} /> Upload New
                      <input type="file" className="hidden" accept="image/*,.pdf" />
                    </label>
                  </div>
                  <div className="aspect-[1.6] bg-zinc-100 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden relative group">
                    <img src="https://picsum.photos/seed/idcard/600/400" alt="ID Card" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-black rounded-xl text-xs font-black uppercase">View Full</button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-black uppercase text-zinc-500">Driving License</h4>
                    <label className="cursor-pointer text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1">
                      <Upload size={12} /> Upload New
                      <input type="file" className="hidden" accept="image/*,.pdf" />
                    </label>
                  </div>
                  <div className="aspect-[1.6] bg-zinc-100 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden relative group">
                    <img src="https://picsum.photos/seed/license/600/400" alt="Driving License" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-black rounded-xl text-xs font-black uppercase">View Full</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <h4 className="text-xs font-black uppercase text-zinc-500 mb-3">Extracted Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Name Match</p>
                    <p className="text-sm font-black text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14} /> 98% Match</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">License Validity</p>
                    <p className="text-sm font-black text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14} /> Valid till 2032</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-6 border-t flex gap-4 sticky bottom-0 bg-inherit border-inherit`}>
              <button 
                onClick={() => {
                  setRidersList(prev => prev.map(r => r.id === selectedKycRider.id ? { ...r, kyc: 'Verified' } : r));
                  setSelectedKycRider(null);
                }}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck size={20} /> Approve KYC
              </button>
              <button 
                onClick={() => setSelectedKycRider(null)}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <XCircle size={20} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
 



