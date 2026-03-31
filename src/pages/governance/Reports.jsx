import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';

const complaintTrends = [
  { month: 'Jan', water: 40, electricity: 24, roads: 10, sanitation: 20 },
  { month: 'Feb', water: 30, electricity: 35, roads: 15, sanitation: 25 },
  { month: 'Mar', water: 50, electricity: 15, roads: 20, sanitation: 18 },
  { month: 'Apr', water: 45, electricity: 30, roads: 25, sanitation: 30 },
  { month: 'May', water: 35, electricity: 45, roads: 30, sanitation: 45 },
  { month: 'Jun', water: 55, electricity: 40, roads: 35, sanitation: 50 },
];

const villageData = [
  { name: 'Miranpur', status: 85, complaints: 120, funds: 45 },
  { name: 'Jalalabad', status: 62, complaints: 240, funds: 32 },
  { name: 'Hapur Rural', status: 94, complaints: 85, funds: 58 },
  { name: 'Dhaulana', status: 78, complaints: 150, funds: 41 },
];

const resolutionEfficiency = [
  { name: 'Water', value: 85, color: '#1E3A8A' },
  { name: 'Power', value: 72, color: '#FF9933' },
  { name: 'Roads', value: 91, color: '#138808' },
  { name: 'Sanitation', value: 65, color: '#ef4444' },
];

const Reports = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Analytical Reports & Insights</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Full state-level statistical oversight and digital audit logs</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-600" />
              Print Record
           </button>
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Dataset (CSV)
           </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Multilayered Trends Chart */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group relative">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-blue-600" />
                 Sector-wise Grievance Trends
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                 <button className="px-4 py-1.5 rounded-lg bg-white text-blue-900 border border-slate-100 text-[9px] font-black uppercase tracking-widest shadow-sm">Monthly</button>
                 <button className="px-4 py-1.5 rounded-lg text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Quarterly</button>
              </div>
           </div>
           
           <div className="h-[350px] w-full relative z-10 transition-all group-hover:scale-[1.01]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complaintTrends}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF9933" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#FF9933" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                    labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', color: '#1E3A8A', marginBottom: '8px' }}
                  />
                  <Area type="monotone" dataKey="water" stroke="#1E3A8A" strokeWidth={4} fillOpacity={1} fill="url(#colorWater)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                  <Area type="monotone" dataKey="electricity" stroke="#FF9933" strokeWidth={4} fillOpacity={1} fill="url(#colorElectricity)" dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{paddingBottom: '30px', textTransform: 'uppercase', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em'}} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Resolution Efficiency Breakdown */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 group">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-green-600" />
                 Departmental Output Ratio
              </h3>
              <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em] transition-colors border-b-2 border-blue-100 pb-0.5">Filter Data</button>
           </div>
           
           <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resolutionEfficiency}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                    stroke="none"
                  >
                    {resolutionEfficiency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                    itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="rect" wrapperStyle={{paddingTop: '20px', textTransform: 'uppercase', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em'}} />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Regional Performance Table */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
           <FileText className="w-24 h-24 text-slate-200" />
        </div>
        <div className="flex items-center justify-between mb-12 relative z-10">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Regional Performance Indices
           </h3>
           <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button className="px-5 py-2 rounded-lg bg-white text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-200">Village-wise</button>
              <button className="px-5 py-2 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-widest">District Highs</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
           {villageData.map((village) => (
              <div key={village.name} className="flex flex-col group/card hover:bg-slate-50/50 p-4 rounded-3xl transition-all border border-transparent hover:border-slate-100">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">{village.name}</span>
                    <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${village.status > 80 ? 'text-green-600' : 'text-orange-500'}`}>
                       {village.status > 80 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                       {village.status}% Eff.
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Resolutions</span>
                       <span className="text-xs font-black text-slate-600">{village.complaints} Cases</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 group-hover/card:shadow-[0_0_10px_rgba(30,58,138,0.3)]`} style={{ width: `${village.status}%`, backgroundColor: village.status > 85 ? '#138808' : '#1E3A8A' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Budget Util.</span>
                       <span className="text-xs font-black text-slate-900 group-hover/card:text-blue-900 transition-colors">₹{village.funds} Cr</span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
