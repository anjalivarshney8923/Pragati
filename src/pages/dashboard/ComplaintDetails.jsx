import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ArrowUpCircle, 
  FileText, 
  Image as ImageIcon,
  ExternalLink,
  Info
} from 'lucide-react';
import { complaintService, workProofService } from '../../services/api';
import Loader from '../../components/Loader';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [complaint, setComplaint] = useState(null);
  const [workProof, setWorkProof] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Escalating State
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);

      if (data.status === 'RESOLVED') {
        try {
          const wpData = await workProofService.getWorkProofByComplaintId(id);
          setWorkProof(wpData);
        } catch (wpErr) {
          console.warn("No work proof found or failed to fetch:", wpErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load complaint details. It may not exist or you may not have permission.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async (type) => {
    if (isEscalating) return;
    setIsEscalating(true);
    try {
      const updated = type === 'vibhag'
        ? await complaintService.escalateToVibhag(id)
        : await complaintService.escalateToBDO(id);
      setComplaint(updated);
      alert(`Successfully escalated to ${type === 'vibhag' ? 'Vibhag' : 'BDO'}!`);
    } catch (err) {
      alert(err?.response?.data?.error || `Failed to escalate to ${type}`);
    } finally {
      setIsEscalating(false);
    }
  };


  if (isLoading) {
    return <Loader text="Loading complaint details..." />;
  }

  if (error || !complaint) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="font-semibold text-lg">{error || "Complaint not found"}</p>
          <Link to="/dashboard/complaints" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            <ArrowLeft size={16} /> Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const norm = status?.toUpperCase() || 'PENDING';
    switch (norm) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-tighter">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-tighter">
            <Info className="w-3.5 h-3.5 mr-1" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 uppercase tracking-tighter">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-tighter">
            {norm}
          </span>
        );
    }
  };

  const images = complaint.imageUrl ? complaint.imageUrl.split(',') : [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 font-sans text-slate-800 pb-24">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard/complaints" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1E3A8A] font-bold text-sm transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to List
        </Link>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ref ID: #{complaint.id}</span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-blue-50 text-[#1E3A8A] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                # {complaint.category?.toUpperCase() || "GENERAL"}
              </span>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
                {complaint.complaintToken}
              </span>
              {getStatusBadge(complaint.status)}
            </div>
            
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Submitted {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
            {complaint.title}
          </h1>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Complaint Description</h3>
            <p className="text-slate-700 leading-relaxed font-semibold text-sm whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-100 p-4 rounded-2xl flex gap-3 items-start">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Physical Address</h4>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{complaint.location}</p>
              </div>
            </div>

            <div className="border border-slate-100 p-4 rounded-2xl flex gap-3 items-start">
              <div className="p-2 bg-green-50 rounded-xl text-green-600">
                <Navigation size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">GPS Coordinates</h4>
                <p className="text-sm font-mono font-bold text-slate-700 mt-0.5">
                  Lat: {complaint.latitude?.toFixed(4)}, Lng: {complaint.longitude?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <ImageIcon size={14} /> Uploaded Evidence ({images.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((url, idx) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="relative block group rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img 
                      src={url} 
                      alt={`Evidence ${idx + 1}`} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-black tracking-widest uppercase bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/20">
                        View Image
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Escalation Control Actions */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
          <ArrowUpCircle size={20} className="text-[#1E3A8A]" /> Escalation Status & Actions
        </h2>
        <p className="text-slate-500 text-xs font-medium">If your issue is unresolved within the governance window, you can escalate it to departmental officers or Block Development Officers.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Vibhag Escalation */}
          <div className="border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Level 1: Vibhag Escalation</h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">Escalate complaint to targeted departments (Jal Vibhag, PWD, Swachhta Vibhag, etc.) for direct resolution.</p>
            </div>
            
            <button
              onClick={() => handleEscalate('vibhag')}
              disabled={!complaint.canEscalateToVibhag || isEscalating}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                complaint.canEscalateToVibhag
                  ? 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600 shadow-md active:scale-95'
                  : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
              }`}
            >
              <ArrowUpCircle size={14} />
              {complaint.canEscalateToVibhag ? 'Escalate to Vibhag' : 'Escalated / Unavailable'}
            </button>
          </div>

          {/* BDO Escalation */}
          <div className="border border-slate-100 p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Level 2: BDO Escalation</h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">Escalate directly to Block Development Officer. Available after Level 1 has been completed and the resolution timer expires.</p>
            </div>
            
            <button
              onClick={() => handleEscalate('bdo')}
              disabled={!complaint.canEscalateToBDO || isEscalating}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                complaint.canEscalateToBDO
                  ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-md active:scale-95'
                  : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
              }`}
            >
              <ArrowUpCircle size={14} />
              {complaint.canEscalateToBDO ? 'Escalate to BDO' : 'Escalated / Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Clock size={20} className="text-[#1E3A8A]" /> Complaint Timeline
        </h2>
        
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
          {/* Submission Step */}
          <div className="relative pl-6">
            <div className="absolute -left-[9px] top-1 bg-green-500 w-4.5 h-4.5 rounded-full border-4 border-white flex-shrink-0" />
            <h4 className="text-sm font-bold text-slate-900">Complaint Submitted</h4>
            <p className="text-xs text-slate-500 mt-1">Complaint successfully submitted on public portal and assigned token {complaint.complaintToken}.</p>
            <span className="text-[10px] font-bold text-slate-400 mt-2 block bg-slate-50 px-2.5 py-1 rounded w-fit">
              {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString('en-IN') : 'N/A'}
            </span>
          </div>

          {/* Vibhag Step */}
          {(complaint.escalationLevel >= 1 || complaint.status === 'RESOLVED') && (
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 bg-[#1E3A8A] w-4.5 h-4.5 rounded-full border-4 border-white flex-shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Escalated to Vibhag</h4>
              <p className="text-xs text-slate-500 mt-1">Forwarded to respective Vibhag officials for field resolution.</p>
            </div>
          )}

          {/* BDO Step */}
          {complaint.escalationLevel >= 2 && (
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 bg-orange-500 w-4.5 h-4.5 rounded-full border-4 border-white flex-shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Escalated to BDO</h4>
              <p className="text-xs text-slate-500 mt-1">Escalated to Block Development Officer for executive audit.</p>
            </div>
          )}

          {/* Resolution Step */}
          {complaint.status === 'RESOLVED' && (
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 bg-green-600 w-4.5 h-4.5 rounded-full border-4 border-white flex-shrink-0" />
              <h4 className="text-sm font-bold text-slate-900">Resolved</h4>
              <p className="text-xs text-slate-500 mt-1">The Gram Panchayat and responsible officers resolved the issue. Work proof submitted.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Proof Card */}
      {complaint.status === 'RESOLVED' && workProof && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2 border-b pb-3 border-slate-100">
              <CheckCircle size={22} className="text-green-600" /> Resolution Evidence & Work Proof
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Before Image</h4>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  {workProof.beforeImageUrl ? (
                    <img src={workProof.beforeImageUrl} alt="Before" className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center text-slate-400 flex-col text-xs font-semibold gap-1.5 p-4 text-center">
                      <ImageIcon size={28} className="text-slate-300" /> No initial before image was uploaded.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">After Image</h4>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={workProof.imageUrl} alt="After" className="w-full h-48 object-cover" />
                </div>
              </div>
            </div>

            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
              <h3 className="text-xs font-black uppercase text-green-700 tracking-wider mb-2">Work Execution Summary</h3>
              <p className="text-green-950 font-bold text-sm leading-relaxed whitespace-pre-line">
                {workProof.description}
              </p>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
