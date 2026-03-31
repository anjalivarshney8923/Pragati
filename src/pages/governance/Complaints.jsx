import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  Calendar,
  MoreVertical
} from 'lucide-react';
import StatusBadge from '../../components/governance/StatusBadge';

const allComplaints = [
  { id: 'CMP-1024', citizen: 'Vivek Kumar', mobile: '9876543210', category: 'Water Supply', status: 'PENDING', date: '2026-03-30', priority: 'HIGH' },
  { id: 'CMP-1025', citizen: 'Suman Devi', mobile: '9988776655', category: 'Sanitation', status: 'IN_PROGRESS', date: '2026-03-29', priority: 'MEDIUM' },
  { id: 'CMP-1026', citizen: 'Ramesh Singh', mobile: '8877665544', category: 'Roads', status: 'RESOLVED', date: '2026-03-28', priority: 'LOW' },
  { id: 'CMP-1027', citizen: 'Priya Verma', mobile: '7766554433', category: 'Electricity', status: 'PENDING', date: '2026-03-27', priority: 'HIGH' },
  { id: 'CMP-1028', citizen: 'Amit Patel', mobile: '6655443322', category: 'Water Supply', status: 'RESOLVED', date: '2026-03-26', priority: 'MEDIUM' },
];

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredComplaints = allComplaints.filter(c => {
    const matchesSearch = c.citizen.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Citizen Grievance Management</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage, Track and Resolve village-level issues</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              Export Records
           </button>
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detailed View
           </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Filter className="w-16 h-16 text-slate-200 rotate-12" />
         </div>
         
         <div className="flex-1 max-w-xl relative overflow-hidden z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter by Citizen Name or Complaint ID..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-gray-400 tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         <div className="flex items-center gap-6 z-10">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter By:</span>
               <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        statusFilter === status 
                          ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-100' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
               </div>
            </div>
            
            <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all group">
               <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
         </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unique ID</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Citizen Metadata</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dept / Priority</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Received On</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.map((item) => (
                <tr key={item.id} className="group/row hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="p-6 font-extrabold text-xs text-blue-900 group-hover/row:translate-x-1 transition-transform">{item.id}</td>
                  <td className="p-6">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 tracking-tight">{item.citizen}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest">{item.mobile}</span>
                     </div>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">{item.category}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          item.priority === 'HIGH' ? 'bg-red-500 animate-pulse' :
                          item.priority === 'MEDIUM' ? 'bg-orange-400' : 'bg-green-400'
                        }`} title={item.priority}></span>
                     </div>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-500">{item.date}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm shadow-blue-50/50" title="View Details">
                          <Eye className="w-4 h-4" />
                       </button>
                       <button className="p-2.5 text-orange-600 hover:bg-orange-50 rounded-xl transition-all shadow-sm shadow-orange-50/50" title="Update Progress">
                          <Edit3 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-6 bg-slate-50/30 border-t border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 5 of 156 Complaints</span>
           <div className="flex items-center gap-2">
              <button disabled className="p-2 text-slate-300">Previous</button>
              <button className="w-8 h-8 rounded-lg bg-blue-900 text-white text-[10px] font-bold">1</button>
              <button className="w-8 h-8 rounded-lg bg-white text-slate-600 text-[10px] font-bold border border-slate-200">2</button>
              <button className="p-2 text-slate-600 font-bold text-xs">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
