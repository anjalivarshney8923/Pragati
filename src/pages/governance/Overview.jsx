import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  IndianRupee, 
  TrendingUp, 
  Clock,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import DashboardCard from '../../components/governance/DashboardCard';
import StatusBadge from '../../components/governance/StatusBadge';
import { complaintService } from '../../services/api';

const crore = 10_000_000;

const overviewData = [
  { name: 'Jan', complaints: 45 },
  { name: 'Feb', complaints: 52 },
  { name: 'Mar', complaints: 38 },
  { name: 'Apr', complaints: 65 },
  { name: 'May', complaints: 48 },
  { name: 'Jun', complaints: 59 },
];

const recentComplaints = [
  { id: 'CMP-1024', name: 'Vivek Kumar', category: 'Water Supply', status: 'PENDING', date: '2026-03-30' },
  { id: 'CMP-1025', name: 'Suman Devi', category: 'Sanitation', status: 'IN_PROGRESS', date: '2026-03-29' },
  { id: 'CMP-1026', name: 'Ramesh Singh', category: 'Roads', status: 'RESOLVED', date: '2026-03-28' },
];

const DEPT_LABELS = {
  BDO:         'Block Development Officer',
  PRADHAN:     'Gram Pradhan',
  JAL_VIBHAG:  'Jal Vibhag',
  ELECTRICITY: 'Electricity Vibhag',
  ROAD:        'Road Vibhag',
  SWACHHTA:    'Swachhta Vibhag',
  NAGAR_NIGAM: 'Nagar Nigam',
};

const Overview = () => {
  const [schemeData, setSchemeData] = useState([]);
  const [totalAllocated, setTotalAllocated] = useState('...');
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Read officer details from localStorage
  const officerData = (() => {
    try { return JSON.parse(localStorage.getItem('officer') || '{}'); } catch { return {}; }
  })();
  const officerName = officerData.fullName || 'Officer';
  const deptKey = officerData.department || 'BDO';
  const deptLabel = DEPT_LABELS[deptKey] || deptKey;
  const updateTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    // Live complaint stats
    complaintService.getOfficerStats()
      .then(data => setStats(data))
      .catch(err => console.warn('Stats load failed, using fallback:', err))
      .finally(() => setStatsLoading(false));

    // Fund data from CSV
    fetch('/data/up_large_dataset.csv')
      .then(r => r.text())
      .then(text => {
        const rows = text.trim().split('\n').slice(1).map(l => {
          const [, , , scheme, allocated_fund, used_fund] = l.split(',');
          return { scheme, allocated: parseInt(allocated_fund), used: parseInt(used_fund) };
        });
        const map = {};
        rows.forEach(r => {
          if (!map[r.scheme]) map[r.scheme] = { allocated: 0, used: 0 };
          map[r.scheme].allocated += r.allocated;
          map[r.scheme].used += r.used;
        });
        const total = Object.values(map).reduce((a, v) => a + v.allocated, 0);
        setTotalAllocated((total / crore).toFixed(1));
        setSchemeData(Object.entries(map).map(([name, v]) => ({
          name,
          Allocated: parseFloat((v.allocated / crore).toFixed(1)),
          Used: parseFloat((v.used / crore).toFixed(1)),
        })));
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Pragati Overview</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
              <BadgeCheck className="w-3.5 h-3.5" />
              {deptLabel}
            </span>
          </div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            Namaskar, <span className="text-[#1E3A8A]">{officerName}</span> — Real-time analytical summary
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Updated: {updateTime}</span>
           </div>
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Generate Report
              <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Metric Cards Grid — Live Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Complaints" 
          value={statsLoading ? '...' : (stats.total ?? 0).toString()}
          icon={MessageSquare} 
          trend="up" 
          trendValue="Live Data"
          color="blue" 
        />
        <DashboardCard 
          title="Pending" 
          value={statsLoading ? '...' : (stats.pending ?? 0).toString()}
          icon={Clock} 
          trend="down" 
          trendValue="Needs Action" 
          color="orange" 
        />
        <DashboardCard 
          title="Resolved" 
          value={statsLoading ? '...' : (stats.resolved ?? 0).toString()}
          icon={CheckCircle} 
          trend="up" 
          trendValue="Completed" 
          color="green" 
        />
        <DashboardCard 
          title="Funds Allocated" 
          value={`₹${totalAllocated} Cr`}
          icon={IndianRupee} 
          trend="up" 
          trendValue="+15%" 
          color="blue" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaints Trend */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-blue-600" />
               Complaint Influx Trends
            </h3>
            <select className="bg-slate-50 border-none outline-none text-[10px] font-bold uppercase tracking-widest text-slate-500 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-100 transition-all">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  labelStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#1E3A8A', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="complaints" 
                  stroke="#1E3A8A" 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#FF9933' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fund Usage Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <IndianRupee className="w-4 h-4 text-[#138808]" />
               Budget Utilization (₹ Cr)
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">View Details</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schemeData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} />
                <Tooltip
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  formatter={(val) => [`₹${val} Cr`]}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }} />
                <Bar dataKey="Allocated" fill="#1E3A8A" radius={[6, 6, 0, 0]} animationDuration={2000} />
                <Bar dataKey="Used" fill="#FF9933" radius={[6, 6, 0, 0]} animationDuration={2000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table (Small View) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <MessageSquare className="w-20 h-20 text-slate-200" />
        </div>
        <div className="flex items-center justify-between mb-8 relative z-10">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Priority Complaints</h3>
           <button className="px-4 py-2 bg-slate-50 text-[#1E3A8A] font-extrabold uppercase tracking-widest text-[9px] rounded-xl hover:bg-blue-50 transition-all border border-slate-200 focus:scale-95 active:scale-90">Manage All</button>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Complaint ID</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Citizen</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dept / Category</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</th>
                <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentComplaints.map((item) => (
                <tr key={item.id} className="group/row hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="py-5 font-extrabold text-xs text-blue-900 group-hover/row:translate-x-1 transition-transform">{item.id}</td>
                  <td className="py-5 text-sm font-bold text-slate-700">{item.name}</td>
                  <td className="py-5">
                     <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">{item.category}</span>
                  </td>
                  <td className="py-5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-5 text-xs font-bold text-slate-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
