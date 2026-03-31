import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  XCircle, 
  AlertCircle,
  Clock,
  Briefcase,
  MapPin,
  Mail,
  Smartphone,
  CheckCircle2,
  Lock
} from 'lucide-react';

const mockPendingOfficers = [
  { id: 'OFF-101', name: 'Arvind Sharma', email: 'arvind.sharma@up.gov.in', role: 'Pradhan', department: 'Rural Development', state: 'Uttar Pradesh', district: 'Ghaziabad', status: 'PENDING', date: '2026-03-30' },
  { id: 'OFF-102', name: 'Suman Lata', email: 'suman.lata@nic.in', role: 'Block Officer', department: 'Panchayat Raj', state: 'Uttar Pradesh', district: 'Hapur', status: 'PENDING', date: '2026-03-29' },
  { id: 'OFF-103', name: 'Ravi Prakash', email: 'ravi.prakash@gov.in', role: 'District Magistrate', department: 'Revenue', state: 'Uttar Pradesh', district: 'Ghaziabad', status: 'PENDING', date: '2026-03-28' },
];

const Approvals = () => {
  const [officers, setOfficers] = useState(mockPendingOfficers);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = (id, status) => {
    setActionLoading(id);
    setTimeout(() => {
      setOfficers(prev => prev.filter(o => o.id !== id));
      setActionLoading(null);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Officer Access Control</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Review and Approve restricted governance portal credentials</p>
        </div>
        <div className="px-6 py-2.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl shadow-sm flex items-center gap-3">
           <AlertCircle className="w-4 h-4 animate-pulse" />
           <span className="text-xs font-black uppercase tracking-widest">{officers.length} Pending Requests</span>
        </div>
      </div>

      {/* Grid of Approval Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {officers.map((officer) => (
          <div key={officer.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
             {/* Decorative Identity Shield */}
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-slate-200" />
             </div>

             <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-white flex items-center justify-center text-[#1E3A8A] shadow-xl shadow-blue-50 group-hover:scale-105 transition-transform">
                      <UserCheck className="w-8 h-8" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1.5">{officer.name}</span>
                      <span className="text-[10px] font-black text-[#138808] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg border border-green-100 inline-block w-fit">
                         {officer.role}
                      </span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Received {officer.date}
                   </span>
                   <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-100 italic">Pending Verification</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-y-6 mb-10 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                      <Mail className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{officer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#FF9933] transition-colors">
                      <Briefcase className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{officer.department}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#138808] transition-colors">
                      <MapPin className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter line-clamp-1">{officer.district}, {officer.state}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#1E3A8A] transition-colors">
                      <Lock className="w-4 h-4" />
                   </div>
                   <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50/50 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors underline decoration-dotted decoration-blue-200">View Documents</button>
                </div>
             </div>

             <div className="flex items-center gap-4 relative z-10 border-t border-slate-50 pt-8">
                <button 
                  onClick={() => handleAction(officer.id, 'APPROVED')}
                  disabled={actionLoading === officer.id}
                  className={`flex-1 py-4 bg-blue-900 text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-950 transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 group active:scale-[0.98] ${
                    actionLoading === officer.id ? 'opacity-50 cursor-wait' : ''
                  }`}
                >
                   {actionLoading === officer.id ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Approve Credentials
                      </>
                   )}
                </button>
                <button 
                  onClick={() => handleAction(officer.id, 'REJECTED')}
                  disabled={actionLoading === officer.id}
                  className="px-6 py-4 bg-white border border-red-100 text-red-500 rounded-2xl shadow-sm hover:bg-red-50 transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                   <XCircle className="w-4 h-4" />
                </button>
             </div>
          </div>
        ))}
        {officers.length === 0 && (
          <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200/50">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-green-500 shadow-xl mb-6 ring-8 ring-green-50">
                <ShieldCheck className="w-10 h-10" />
             </div>
             <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Queue Clear</h3>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 max-w-md mx-auto">No pending officer registration requests detected. System verification is up to date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
