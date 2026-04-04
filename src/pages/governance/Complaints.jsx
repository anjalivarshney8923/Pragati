import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  Image as ImageIcon,
  Flame,
  BadgeCheck
} from 'lucide-react';
import StatusBadge from '../../components/governance/StatusBadge';
import { complaintService } from '../../services/api';
import Loader from '../../components/Loader';

const DEPT_LABELS = {
  BDO:         { label: 'BDO — Sab Vibhag', color: 'bg-blue-100 text-blue-800' },
  JAL_VIBHAG:  { label: 'Jal Vibhag', color: 'bg-cyan-100 text-cyan-800' },
  ELECTRICITY: { label: 'Electricity Vibhag', color: 'bg-yellow-100 text-yellow-800' },
  ROAD:        { label: 'Road Vibhag', color: 'bg-orange-100 text-orange-800' },
  SWACHHTA:    { label: 'Swachhta Vibhag', color: 'bg-green-100 text-green-800' },
  NAGAR_NIGAM: { label: 'Nagar Nigam', color: 'bg-purple-100 text-purple-800' },
  PRADHAN:     { label: 'Gram Pradhan', color: 'bg-rose-100 text-rose-800' },
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  // Read officer department from localStorage (stored at login)
  const officerData = (() => {
    try { return JSON.parse(localStorage.getItem('officer') || '{}'); } catch { return {}; }
  })();
  const deptKey = officerData.department || 'BDO';
  const deptInfo = DEPT_LABELS[deptKey] || { label: deptKey, color: 'bg-slate-100 text-slate-700' };

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await complaintService.updateComplaintStatus(id, newStatus);
      // Optimistically update or just re-fetch
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
        console.error("Status update failed:", err);
        alert("Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
        setUpdatingId(null);
    }
  }

  const filteredComplaints = complaints.filter(c => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchString) || 
      c.id?.toString().includes(searchString) ||
      c.category?.toLowerCase().includes(searchString);
    
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && complaints.length === 0) return <div className="p-20 flex justify-center"><Loader text="Syncing real-time grievance data..." /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Citizen Grievance Management</h1>
           </div>
           <div className="flex items-center gap-3">
             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${deptInfo.color}`}>
               <BadgeCheck className="w-3.5 h-3.5" />
               {deptInfo.label}
             </span>
             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Real-time database integration: Anonymized villager data</p>
           </div>
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
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Community</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status Control</th>
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
                  <tr key={item.id} className="group/row hover:bg-slate-50/80 transition-all">
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
                    {/* Community Support Count */}
                    <td className="p-6">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-black text-[#1E3A8A]">{item.supportCount || 0}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">supports</span>
                        </div>
                        {(item.supportCount || 0) >= 5 && (
                          <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                            <Flame className="w-3 h-3" /> High Priority
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="relative group/status flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        {updatingId === item.id ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <select 
                                value={item.status}
                                onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                className="opacity-0 group-hover/status:opacity-100 absolute inset-0 w-full cursor-pointer bg-transparent appearance-none text-[0px]"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-[10px] font-bold text-slate-500 uppercase">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-6">
                      {item.attachmentPath ? (
                        <div className="flex items-center gap-2">
                           <a 
                             href={item.attachmentPath} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="p-2.5 bg-blue-50 text-[#1E3A8A] rounded-xl hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm flex items-center gap-2 group/doc"
                           >
                              {item.attachmentPath.match(/\.(jpg|jpeg|png|gif)$/i) ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              <span className="text-[9px] font-black uppercase hidden group-hover/doc:block transition-all">Open File</span>
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
                         <div className="flex flex-col gap-1">
                            {['PENDING', 'IN_PROGRESS', 'RESOLVED'].filter(s => s !== item.status).map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => handleStatusUpdate(item.id, s)}
                                    className={`px-2 py-1 text-[8px] font-black uppercase rounded-lg border transition-all ${
                                        s === 'RESOLVED' ? 'border-green-200 text-green-600 hover:bg-green-600 hover:text-white' :
                                        s === 'IN_PROGRESS' ? 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white' :
                                        'border-slate-200 text-slate-600 hover:bg-slate-600 hover:text-white'
                                    }`}
                                >
                                    To {s.replace('_', ' ')}
                                </button>
                            ))}
                         </div>
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
