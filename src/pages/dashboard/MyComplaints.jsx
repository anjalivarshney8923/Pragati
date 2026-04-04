import React, { useState, useEffect, useRef, Component } from 'react';
import { complaintService } from '../../services/api';
import { CheckCircle, Clock, AlertCircle, MapPin, Navigation, ThumbsUp, Repeat, User as UserIcon, ArrowUpCircle } from 'lucide-react';
import Loader from '../../components/Loader';

// Simple Error Boundary for the component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100 m-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800">Something went wrong with the feed</h2>
          <p className="text-red-600 mt-2">Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MyComplaintsContent = () => {
  const [complaints, setComplaints] = useState([]);
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('my');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supportingIds, setSupportingIds] = useState(new Set());
  const [escalatingIds, setEscalatingIds] = useState(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const pollingRef = useRef({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyComplaints();
    } else {
      fetchNearbyComplaints();
    }
    return () => Object.values(pollingRef.current).forEach(clearInterval);
  }, [activeTab]);

  const startPolling = (complaintId) => {
    if (pollingRef.current[complaintId]) return;
    pollingRef.current[complaintId] = setInterval(async () => {
      try {
        const updated = await complaintService.getComplaintById(complaintId);
        setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...updated } : c));
        if (updated.escalationLevel >= 2) {
          clearInterval(pollingRef.current[complaintId]);
          delete pollingRef.current[complaintId];
        }
      } catch (e) { /* ignore */ }
    }, 3000);
  };

  const fetchMyComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await complaintService.getMyComplaints();
      const arr = Array.isArray(data) ? data : [];
      setComplaints(arr);
      arr.forEach(c => { if (c.escalationLevel < 2) startPolling(c.id); });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNearbyComplaints = async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await complaintService.getNearbyComplaints(latitude, longitude);
          setNearbyComplaints(Array.isArray(data) ? data : []);
        } catch (err) {
          handleApiError(err);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location services.");
        setIsLoading(false);
      }
    );
  };

  const handleEscalate = async (id, type) => {
    if (escalatingIds.has(`${id}-${type}`)) return;
    setEscalatingIds(prev => new Set(prev).add(`${id}-${type}`));
    try {
      const updated = type === 'vibhag'
        ? await complaintService.escalateToVibhag(id)
        : await complaintService.escalateToBDO(id);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    } catch (err) {
      alert(err?.response?.data?.error || `Failed to escalate to ${type}`);
    } finally {
      setEscalatingIds(prev => { const n = new Set(prev); n.delete(`${id}-${type}`); return n; });
    }
  };

  const handleSupport = async (id) => {
    if (!id || supportingIds.has(id)) return;
    
    setSupportingIds(prev => new Set(prev).add(id));
    try {
      const response = await complaintService.supportComplaint(id);
      
      if (activeTab === 'nearby') {
        setNearbyComplaints(prev => prev.map(c => 
          c.id === id 
            ? { ...c, isSupportedByCurrentUser: true, supportCount: response?.supportCount || (c.supportCount || 0) + 1 } 
            : c
        ));
      } else {
        fetchMyComplaints();
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed to support complaint");
    } finally {
      setSupportingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleApiError = (err) => {
    console.error(err);
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message;
    setError(serverMsg ? `${serverMsg} ${status ? `(status ${status})` : ''}` : 'Failed to fetch complaints.');
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toUpperCase() || 'PENDING';
    switch (normalizedStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-tighter">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-tighter">
            <AlertCircle className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 uppercase tracking-tighter">
            <CheckCircle className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-tighter">
             {normalizedStatus}
          </span>
        );
    }
  };

  const currentData = activeTab === 'my' ? complaints : nearbyComplaints;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black italic tracking-tighter text-[#1E3A8A]">Village Feed</h1>
        
        <div className="bg-slate-100 p-1 rounded-xl flex shadow-inner">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${
              activeTab === 'my' ? 'bg-white text-[#1E3A8A] shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${
              activeTab === 'nearby' ? 'bg-white text-[#1E3A8A] shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Nearby Community
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3" /> {error}
        </div>
      )}

      {isLoading ? (
        <Loader text={activeTab === 'my' ? "Loading your history..." : "Scanning village..."} />
      ) : (
        <div className="grid gap-6">
          {(!currentData || currentData.length === 0) ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-20 text-center">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Navigation className="w-12 h-12 text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Nothing to show right now</h2>
              <p className="text-slate-400 font-medium font-sans">Be the first to raise an issue or check back later!</p>
            </div>
          ) : (
            currentData.map((c) => (
              <div key={c?.id || Math.random()} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all hover:border-blue-100">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                          # {c?.category?.toUpperCase() || "GENERAL"}
                        </span>
                        {c?.complaintToken && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
                            {c.complaintToken}
                          </span>
                        )}
                        {getStatusBadge(c?.status)}
                        {activeTab === 'nearby' && (
                          <span className="flex items-center text-[10px] font-black text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded-md uppercase border border-blue-100 tracking-tighter">
                            <Navigation className="w-3 h-3 mr-1" /> {c?.distance || 0} KM
                          </span>
                        )}
                        {activeTab === 'my' && c?.isSupportedByCurrentUser && (
                          <span className="flex items-center text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase border border-purple-100 tracking-tighter">
                            <Repeat className="w-3 h-3 mr-1" /> Supported
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{c?.title || "No Title"}</h3>
                      <p className="text-slate-500 font-semibold leading-relaxed mb-4 text-sm">{c?.description || "No Description"}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <span className="flex items-center gap-1.5 uppercase">
                          <MapPin size={14} className="text-slate-200" /> {c?.location || "Unknown Location"}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock size={14} className="text-slate-200" /> {c?.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1.5 truncate max-w-xs">
                          <UserIcon size={14} className="text-slate-200" /> BY {c?.userFullName?.toUpperCase() || "ANONYMOUS"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl min-w-[120px] border border-slate-100">
                      <div className="text-2xl font-black text-[#1E3A8A]">{c?.supportCount || 0}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">supports</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                    <div className="flex gap-3">
                      {c?.imageUrl && (
                        <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100">
                          View Proof
                        </a>
                      )}
                    </div>

                    {activeTab === 'my' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEscalate(c?.id, 'vibhag')}
                          disabled={!c?.canEscalateToVibhag || escalatingIds.has(`${c?.id}-vibhag`)}
                          title={!c?.canEscalateToVibhag ? 'Available after 5 seconds' : 'Escalate to Vibhag'}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            c?.canEscalateToVibhag
                              ? 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600 shadow active:scale-95'
                              : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <ArrowUpCircle size={13} />
                          {escalatingIds.has(`${c?.id}-vibhag`) ? 'Escalating...' : 'Escalate to Vibhag'}
                        </button>
                        <button
                          onClick={() => handleEscalate(c?.id, 'bdo')}
                          disabled={
                            !c?.canEscalateToBDO || 
                            escalatingIds.has(`${c?.id}-bdo`) || 
                            (c?.bdoEscalationTime && currentTime < new Date(c.bdoEscalationTime))
                          }
                          title={
                            !c?.canEscalateToBDO 
                              ? 'Vibhag escalation required first' 
                              : (c?.bdoEscalationTime && currentTime < new Date(c.bdoEscalationTime) 
                                ? `Available at ${new Date(c.bdoEscalationTime).toLocaleTimeString()}` 
                                : 'Escalate to BDO')
                          }
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            c?.canEscalateToBDO && (!c?.bdoEscalationTime || currentTime >= new Date(c.bdoEscalationTime))
                              ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow active:scale-95'
                              : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <ArrowUpCircle size={13} />
                          {escalatingIds.has(`${c?.id}-bdo`) 
                            ? 'Escalating...' 
                            : (c?.canEscalateToBDO && c?.bdoEscalationTime && currentTime < new Date(c.bdoEscalationTime)
                               ? 'Escalation available soon...'
                               : 'Escalate to BDO')}
                        </button>
                      </div>
                    )}

                    {activeTab === 'nearby' && (
                      <button
                        onClick={() => handleSupport(c?.id)}
                        disabled={c?.isSupportedByCurrentUser || supportingIds.has(c?.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          c?.isSupportedByCurrentUser 
                            ? 'bg-green-50 text-green-600 cursor-default shadow-inner border border-green-100' 
                            : 'bg-[#1E3A8A] text-white hover:bg-blue-900 shadow-lg active:scale-95 disabled:opacity-50 border border-blue-800'
                        }`}
                      >
                        {c?.isSupportedByCurrentUser ? (
                          <><CheckCircle size={14} /> Supported</>
                        ) : (
                          <><ThumbsUp size={14} /> {supportingIds.has(c?.id) ? 'Processing...' : 'Support Issue'}</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const MyComplaints = () => (
  <ErrorBoundary>
    <MyComplaintsContent />
  </ErrorBoundary>
);

export default MyComplaints;
