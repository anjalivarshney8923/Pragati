import React, { useState, useEffect } from 'react';
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
  MoreVertical,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../../components/governance/StatusBadge';
import { complaintService } from '../../services/api';
import Loader from '../../components/Loader';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getOfficerComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints from database.");
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchString) || 
      c.id?.toString().includes(searchString) ||
      c.category?.toLowerCase().includes(searchString);
    
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-20 flex justify-center"><Loader text="Syncing real-time grievance data..." /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Citizen Grievance Management</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Real-time database integration: Anonymized villager data</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={fetchComplaints} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Refresh Feed
           </button>
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Records
           </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Filter className="w-16 h-16 text-slate-200 rotate-12" />
         </div>
         
         <div className="flex-1 max-w-xl relative overflow-hidden z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Title, Category, or ID..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-gray-400 tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         <div className="flex items-center gap-6 z-10">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Filter:</span>
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
         </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Basic Info</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Received</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Docs</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No complaints found in database matching criteria</td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="group/row hover:bg-slate-50/80 transition-all cursor-pointer">
                    <td className="p-6 font-extrabold text-xs text-blue-900">#{item.id}</td>
                    <td className="p-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 tracking-tight">{item.title}</span>
                          <span className="text-[10px] font-black text-[#1E3A8A] uppercase opacity-60 tracking-wider">{item.category}</span>
                       </div>
                    </td>
                    <td className="p-6 max-w-[200px]">
                        <p className="text-xs text-slate-500 font-medium truncate" title={item.description}>{item.description}</p>
                    </td>
                    <td className="p-6 text-xs font-bold text-slate-600 italic">{item.location}</td>
                    <td className="p-6">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-6 text-[10px] font-bold text-slate-500 uppercase">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-6">
                      {item.attachmentUrl ? (
                        <div className="flex items-center gap-2">
                           <a 
                             href={item.attachmentUrl} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="p-2 bg-slate-100 rounded-lg text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm"
                           >
                              {item.attachmentUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                           </a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold">NONE</span>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm shadow-blue-50/50" title="Full Record Analysis">
                            <Eye className="w-4 h-4" />
                         </button>
                         <button className="p-2.5 text-orange-600 hover:bg-orange-50 rounded-xl transition-all shadow-sm shadow-orange-50/50" title="Modify Status">
                            <Edit3 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/30 border-t border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">DB POOL: {filteredComplaints.length} Records Loaded Successfully</span>
           <div className="flex items-center gap-2">
              <button disabled className="p-2 text-slate-300 text-[10px] uppercase font-bold tracking-widest">Prev</button>
              <button className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white text-[10px] font-bold">1</button>
              <button className="p-2 text-slate-600 font-bold text-xs">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
