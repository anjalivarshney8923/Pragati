import React from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Lock, 
  ShieldCheck, 
  Globe, 
  Bell, 
  LogOut, 
  Mail, 
  Smartphone, 
  Briefcase, 
  MapPin,
  CheckCircle2,
  ChevronRight,
  Monitor
} from 'lucide-react';

const Settings = () => {
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Account Administration</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage official profile, security keys and portal preferences</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Save Configuration
              <CheckCircle2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Official Profile Card */}
        <div className="col-span-1 space-y-10">
           <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <ShieldCheck className="w-24 h-24 text-blue-600 rotate-12" />
              </div>

              <div className="flex flex-col items-center justify-center text-center relative z-10">
                 <div className="relative group/avatar cursor-pointer mb-8">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-[#1E3A8A] group-hover/avatar:scale-105 transition-transform duration-500">
                       <User className="w-16 h-16" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#1E3A8A] border-4 border-white text-white flex items-center justify-center shadow-lg group-hover/avatar:scale-110 transition-all cursor-pointer">
                       <Monitor className="w-4 h-4" />
                    </div>
                 </div>
                 
                 <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2 uppercase">{officer.fullName || "Official Admin"}</h2>
                 <span className="px-5 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-blue-100 mb-8 inline-block shadow-sm">{officer.role || "Pradhan"} Member</span>
                 
                 <div className="w-full space-y-5">
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-slate-100 group/line hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all">
                       <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover/line:text-blue-600 shadow-sm transition-colors">
                          <Mail className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest break-all text-left">{officer.email || "officer@nic.in"}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-slate-100 group/line hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all">
                       <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover/line:text-[#138808] shadow-sm transition-colors">
                          <MapPin className="w-4 h-4" />
                       </div>
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-left">Ghaziabad, Uttar Pradesh</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#1E3A8A] p-8 rounded-[3rem] shadow-2xl shadow-blue-100 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Lock className="w-20 h-20 rotate-[15deg]" />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                 <h3 className="text-sm font-black text-blue-200 uppercase tracking-[0.2em] mb-4">Portal Security Status</h3>
                 <div className="px-6 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    Double Encrypted Vault Active
                 </div>
                 <button className="w-full mt-10 py-3.5 bg-white text-[#1E3A8A] rounded-2xl shadow-xl shadow-black/10 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    Rotate Security Keys
                    <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* Right Column: Settings Tabs */}
        <div className="col-span-1 lg:col-span-2 space-y-10">
           {/* Section 1: Security Controls */}
           <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Lock className="w-24 h-24 text-red-500" />
              </div>
              
              <div className="flex items-center gap-4 mb-10 relative z-10 pb-6 border-b border-slate-50">
                 <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-lg shadow-red-50">
                    <Lock className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Master Password Configuration</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">Last rotated 15 days ago by state authority</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Current Password Token</label>
                    <input type="password" placeholder="••••••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-red-200 transition-all font-mono text-sm tracking-[0.3em] text-slate-400" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Proposed New Protocol</label>
                    <input type="password" placeholder="New Secret Password" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-red-200 transition-all text-sm font-bold text-slate-700" />
                 </div>
              </div>

              <button className="mt-10 px-8 py-3.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100">
                 Commit Key Rotation
              </button>
           </div>

           {/* Section 2: Regional Preferences */}
           <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 group relative">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-50">
                    <Globe className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Administrative Locality Settings</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">Regional server endpoint: ASIA-SOUTH-PRIMARY</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Display Language</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-200 transition-all text-xs font-black uppercase tracking-widest text-[#1E3A8A]">
                       <option>Official Hindi (Bilingual)</option>
                       <option>Official English</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Regional Timeframe Cluster</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-200 transition-all text-xs font-black uppercase tracking-widest text-slate-700">
                       <option>(UTC+05:30) India Standard Time</option>
                       <option>(UTC-05:00) Eastern Time</option>
                    </select>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 md:col-span-2 hover:bg-blue-50/30 transition-all duration-300">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                          <Bell className="w-4 h-4 text-blue-600" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-[0.1em]">Grievance SMS Push Notifications</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Automatic mobile alert dispatch upon citizen registry</span>
                       </div>
                    </div>
                    <div className="w-14 h-8 bg-[#1E3A8A] rounded-full relative p-1 cursor-pointer shadow-inner">
                       <div className="absolute right-1 top-1 bottom-1 w-6 bg-white rounded-full shadow-lg border-2 border-[#1E3A8A]"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Logout Command Center */}
           <div className="p-8 bg-red-50/30 rounded-[3rem] border-2 border-dashed border-red-200/50 flex flex-col md:flex-row items-center justify-between gap-6 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-red-50 to-red-50/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white text-red-500 shadow-xl shadow-red-100 flex items-center justify-center animate-pulse">
                    <LogOut className="w-6 h-6" />
                 </div>
                 <div className="flex flex-col">
                    <h4 className="text-sm font-black text-red-700 uppercase tracking-tighter leading-none mb-1">Session Termination Vault</h4>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest italic">Ensure all official records are saved before vault closure</p>
                 </div>
              </div>
              <button className="px-10 py-4 bg-red-600 text-white rounded-[1.5rem] shadow-2xl shadow-red-100 font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 hover:shadow-red-200 transition-all relative z-10">
                 Secure Sign-Out
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
