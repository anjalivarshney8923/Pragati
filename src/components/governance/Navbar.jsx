import React from 'react';
import { Bell, Search, User, LogOut, ChevronDown, Activity, Globe } from 'lucide-react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  return (
    <header className="bg-white border-b border-gray-200 h-16 md:h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
      {/* Search Input */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-full border border-gray-100 group focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#1E3A8A] transition-colors" />
        <input 
          type="text" 
          placeholder="Lookup IDs, Names, Complaints..." 
          className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-700 placeholder:text-gray-400"
        />
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-4 md:gap-7 ml-auto">
        {/* Quick Stats/Alert Toggle */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 animate-pulse">
           <Activity className="w-4 h-4" />
           <span className="text-[10px] uppercase font-extrabold tracking-tighter">System Live</span>
        </div>

        {/* Global Access Language Toggle */}
        <button className="p-2.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-50 rounded-xl transition-all relative">
          <Globe className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button className="p-2.5 text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-50 rounded-xl transition-all relative group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-gray-200 ml-2 py-1.5">
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight line-clamp-1">{officer.fullName || "Admin Officer"}</span>
            <span className="text-[9px] text-[#138808] font-black uppercase tracking-widest">{officer.role || "Governance Head"}</span>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
               <User className="w-5 h-5" />
            </div>
            <div className="absolute top-full right-0 w-48 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
               <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Profile Settings</span>
               </div>
               <button className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 text-xs font-bold flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  Sign Out Securely
               </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
