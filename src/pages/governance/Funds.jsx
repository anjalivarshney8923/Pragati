import React, { useState } from 'react';
import { 
  Plus, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart, 
  ArrowRight, 
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

const mockSchemes = [
  { id: 'SCM-301', name: 'Gramin Sadak Yojana', budget: 50.0, used: 35.5, remaining: 14.5, status: 'ACTIVE', progress: 71, lastAlloc: '2026-03-30' },
  { id: 'SCM-302', name: 'Swachh Bharat Village 2.0', budget: 25.0, used: 12.8, remaining: 12.2, status: 'ACTIVE', progress: 51, lastAlloc: '2026-03-29' },
  { id: 'SCM-303', name: 'Panchayat Digital Initative', budget: 15.0, used: 14.2, remaining: 0.8, status: 'COMPLETED', progress: 100, lastAlloc: '2026-03-25' },
  { id: 'SCM-304', name: 'Krishi Jal Shakti', budget: 40.0, used: 10.5, remaining: 29.5, status: 'IN_PROGRESS', progress: 26, lastAlloc: '2026-03-20' },
];

const Funds = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Budgetary Funds & Regional Schemes</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Financial oversight and development project tracking</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-2.5 bg-green-50 border border-green-100 text-[#138808] rounded-2xl shadow-sm flex items-center gap-3">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">₹12.4 Cr Disbursed in Q1</span>
           </div>
           <button 
             onClick={() => setShowForm(!showForm)}
             className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group active:scale-95"
           >
              <Plus className={`w-4 h-4 transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} />
              Draft New Scheme
           </button>
        </div>
      </div>

      {/* New Scheme Form UI overlay logic here - kept minimal for now */}
      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50 animate-in zoom-in-95 duration-300 relative overflow-hidden group mb-10">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <IndianRupee className="w-32 h-32 text-blue-600" />
           </div>
           
           <div className="mb-10">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Draft Scheme Proposal</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Submit new development project for state-level financial clearance</p>
           </div>

           <form className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proposed Name</label>
                 <input type="text" placeholder="E.g. Village Solar Grid" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 transition-all text-xs font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Allocated Budget (₹ Cr)</label>
                 <input type="number" placeholder="00.00" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 transition-all text-xs font-bold text-slate-700" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                 <select className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 transition-all text-xs font-bold text-slate-700 uppercase tracking-widest">
                    <option>Rural Development</option>
                    <option>Sanitation</option>
                    <option>IT & Digital</option>
                 </select>
              </div>
           </form>

           <div className="flex items-center gap-4 relative z-10 pt-4">
              <button 
                type="button" 
                className="px-10 py-3.5 bg-blue-900 text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-950 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 active:scale-[0.98]"
              >
                 <CheckCircle2 className="w-4 h-4" />
                 Initialize Project
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-xs"
              >
                 Cancel Draft
              </button>
           </div>
        </div>
      )}

      {/* Financial Summaries Bar Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <BarChart className="w-24 h-24 text-blue-600" />
              </div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    High-Budget Active Schemes
                 </h3>
                 <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Search className="w-4 h-4" />
                 </button>
              </div>

              <div className="space-y-6 relative z-10">
                 {mockSchemes.map((scheme) => (
                    <div key={scheme.id} className="p-6 bg-slate-50/50 rounded-3xl group/item hover:bg-blue-50/50 transition-all border-2 border-transparent hover:border-blue-100/50">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white border-2 border-white shadow-sm flex items-center justify-center font-black text-[9px] text-blue-900 shadow-blue-50">
                                {scheme.id.split('-')[1]}
                             </div>
                             <div>
                                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none mb-1 group-hover/item:text-blue-900 transition-colors uppercase">{scheme.name}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                   <Calendar className="w-2.5 h-2.5" />
                                   Last Transfer: {scheme.lastAlloc}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-sm font-black text-slate-900">₹{scheme.used}Cr</span>
                             <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase block">Expended of ₹{scheme.budget}Cr</span>
                          </div>
                       </div>
                       
                       <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner">
                          <div 
                             className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full transition-all duration-1000 group-hover/item:shadow-[0_0_15px_rgba(29,78,216,0.3)]" 
                             style={{ width: `${scheme.progress}%` }}
                          ></div>
                       </div>
                       
                       <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className={`${scheme.progress > 80 ? 'text-orange-500' : 'text-blue-600'}`}>{scheme.progress}% Consumed</span>
                          <span className="text-slate-400 flex items-center gap-1">Remaining: <span className="text-slate-700">₹{scheme.remaining}Cr</span></span>
                       </div>
                    </div>
                 ))}
              </div>

              <button className="w-full mt-8 py-3 bg-white border-2 border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 hover:text-blue-900 hover:border-blue-100 transition-all flex items-center justify-center gap-3 group">
                 Review Full Financial Portfolio
                 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {/* Funds Allocation Insights Card */}
        <div className="space-y-8">
           <div className="bg-[#1E3A8A] p-10 rounded-[3.5rem] shadow-2xl shadow-blue-100 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                 <PieChart className="w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-12">
                 <div>
                    <h3 className="text-sm font-black text-blue-200 uppercase tracking-[0.2em] mb-3">Total Quarterly Allotment</h3>
                    <div className="flex items-baseline gap-3">
                       <h2 className="text-5xl font-black tracking-tighter">₹158.5</h2>
                       <span className="text-xl font-bold text-blue-300">Cr</span>
                    </div>
                    <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mt-2 flex items-center gap-2">
                       <TrendingUp className="w-3 h-3 text-green-400" />
                       +22.4% vs Previous Term
                    </p>
                 </div>

                 <div className="space-y-10">
                    <div>
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">
                          <span>Infrastructure</span>
                          <span>65%</span>
                       </div>
                       <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                          <div className="w-[65%] h-full bg-[#FF9933] rounded-full"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">
                          <span>Citizen Tech</span>
                          <span>20%</span>
                       </div>
                       <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                          <div className="w-[20%] h-full bg-green-400 rounded-full"></div>
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">
                          <span>Contingency</span>
                          <span>15%</span>
                       </div>
                       <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                          <div className="w-[15%] h-full bg-red-400 rounded-full"></div>
                       </div>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all">
                    Generate Allocation Ledger
                 </button>
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center group">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF9933] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
                 <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Budget Utilization Alert</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-4 italic leading-relaxed">
                 Infrastructure budget is within 5% of ceiling. Plan realignment is recommended by next week.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;
