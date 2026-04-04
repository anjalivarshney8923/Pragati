import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Flame,
  BadgeCheck,
  RefreshCw,
  ExternalLink,
  Shield,
  Camera,
  Lock,
  ArrowRight
} from 'lucide-react';
import StatusBadge from '../../components/governance/StatusBadge';
import { complaintService, workProofService } from '../../services/api';
import Loader from '../../components/Loader';
import WorkProofModal from '../../components/governance/WorkProofModal';

const ALGORAND_EXPLORER = 'https://testnet.algoscan.app/tx/';

// ─── PradhanDashboard: Identical UI to Complaints.jsx, fixed with Work Proof logic ─────
const PradhanDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedForProof, setSelectedForProof] = useState(null);
  const [verificationResults, setVerificationResults] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);

  // Officer info from localStorage
  const officerData = (() => {
    try { return JSON.parse(localStorage.getItem('officer') || '{}'); } catch { return {}; }
  })();
  const officerName = officerData.fullName || 'Pradhan';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getPradhanComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Pradhan complaints:', err);
      setError('Failed to load complaints from database. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await complaintService.updateComplaintStatus(id, newStatus);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyProof = async (item) => {
    try {
      setVerifyingId(item.id);
      const result = await complaintService.verifyComplaintIntegrity(item.id);
      setVerificationResults(prev => ({ ...prev, [item.id]: result.verified }));
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Verification failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.title?.toLowerCase().includes(q) ||
      c.id?.toString().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    highPriority: complaints.filter(c => (c.supportCount || 0) >= 5).length,
  };

  if (loading && complaints.length === 0)
    return <div className="p-20 flex justify-center"><Loader text="Syncing Pradhan grievance data..." /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">
              Gram Pradhan Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border bg-rose-100 text-rose-800 border-rose-200">
              <BadgeCheck className="w-3.5 h-3.5" />
              Gram Pradhan — {officerName}
            </span>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              All village complaints · Sorted by community priority
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, cls: 'bg-blue-50 text-[#1E3A8A]' },
          { label: 'Pending', value: stats.pending, cls: 'bg-amber-50 text-amber-700' },
          { label: 'In Progress', value: stats.inProgress, cls: 'bg-blue-50 text-blue-600' },
          { label: 'Resolved', value: stats.resolved, cls: 'bg-emerald-50 text-emerald-700' },
          { label: '🔥 High Priority', value: stats.highPriority, cls: 'bg-red-50 text-red-600' },
        ].map(({ label, value, cls }) => (
          <div key={label} className={`${cls} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl font-bold text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Filters + Table ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter bar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, category, or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#1E3A8A] focus:bg-white transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s
                    ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-100'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-black uppercase text-sm tracking-widest">
                No complaints found
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Complaint Info</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Community Support</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status Control</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Received</th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Blockchain Proof</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => {
                  const isHighPriority = (item.supportCount || 0) >= 5;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 transition-colors group ${
                        isHighPriority ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="p-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black ${
                          isHighPriority ? 'bg-red-500' : 'bg-[#1E3A8A]'
                        }`}>
                          {item.id}
                        </div>
                      </td>

                      <td className="p-6">
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {item.title || 'No Title'}
                          </p>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {item.category || 'GENERAL'}
                          </span>
                        </div>
                      </td>

                      <td className="p-6 max-w-[200px]">
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {item.description || 'No description provided.'}
                        </p>
                      </td>

                      <td className="p-6 text-xs font-bold text-slate-600 italic">
                        {item.location || '—'}
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-[#1E3A8A]">{item.supportCount || 0}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">supports</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={item.status} />
                          <div className="flex gap-1">
                            {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
                              <button
                                key={s}
                                disabled={updatingId === item.id || item.status === s}
                                onClick={() => handleStatusUpdate(item.id, s)}
                                className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                  item.status === s
                                    ? s === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {updatingId === item.id ? '...' : s.charAt(0)}
                              </button>
                            ))}
                          </div>
                          {item.status === 'RESOLVED' && !item.blockchainTxnId && (
                            <button
                              onClick={() => setSelectedForProof(item)}
                              className="mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase hover:bg-indigo-700 transition-all shadow-sm"
                            >
                              <Camera className="w-3 h-3" /> Proof
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-6">
                        <span className="text-xs font-bold text-slate-600">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}
                        </span>
                      </td>

                      <td className="p-6">
                        {item.blockchainTxnId ? (
                             <div className="flex flex-col gap-1.5">
                               <a
                                href={`${ALGORAND_EXPLORER}${item.blockchainTxnId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-700 hover:text-white transition-all shadow-sm"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Txn
                              </a>
                              
                              <button
                                onClick={() => handleVerifyProof(item)}
                                disabled={verifyingId === item.id}
                                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                                  verificationResults[item.id] === true ? 'bg-green-100 text-green-700 border border-green-200' :
                                  verificationResults[item.id] === false ? 'bg-red-100 text-red-700 border border-red-200' :
                                  'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                } shadow-sm`}
                              >
                                {verifyingId === item.id ? (
                                  <Loader variant="blue" size="small" />
                                ) : verificationResults[item.id] === true ? (
                                  <><Shield className="w-3 h-3" /> Verified</>
                                ) : verificationResults[item.id] === false ? (
                                  <><AlertCircle className="w-3 h-3" /> Tampered</>
                                ) : (
                                  <><BadgeCheck className="w-3 h-3" /> Verify</>
                                )}
                              </button>
                             </div>
                          ) : (
                            <span className="text-[9px] text-slate-300 font-bold uppercase">No Proof</span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selectedForProof && (
          <WorkProofModal 
            complaint={selectedForProof} 
            onClose={() => setSelectedForProof(null)} 
            onRefresh={fetchComplaints}
          />
        )}

        <div className="p-6 border-t border-gray-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Source: PostgreSQL · Blockchain Verified resolution flow</span>
        </div>
      </div>
    </div>
  );
};

export default PradhanDashboard;
