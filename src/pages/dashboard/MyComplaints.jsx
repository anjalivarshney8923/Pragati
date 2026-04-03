import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/api';
import { CheckCircle, Clock, AlertCircle, MapPin, Navigation } from 'lucide-react';
import Loader from '../../components/Loader';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'nearby'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyComplaints();
    } else {
      fetchNearbyComplaints();
    }
  }, [activeTab]);

  const fetchMyComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
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
          setNearbyComplaints(data);
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

  const handleApiError = (err) => {
    console.error(err);
    const status = err?.response?.status;
    const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
    setError(serverMsg ? `${serverMsg} ${status ? `(status ${status})` : ''}` : 'Failed to fetch complaints.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertCircle className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const currentData = activeTab === 'my' ? complaints : nearbyComplaints;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-slate-800">Complaints Feed</h1>
        
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'my' ? 'bg-white text-[#1E3A8A] shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Complaints
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'nearby' ? 'bg-white text-[#1E3A8A] shadow-sm' : 'text-slate-500 hover:text-slate-700'
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
        <Loader text={activeTab === 'my' ? "Loading your complaints..." : "Scanning nearby area..."} />
      ) : currentData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-16 text-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Navigation className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            {activeTab === 'my' ? "You haven't reported anything" : "No nearby reports found"}
          </h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            {activeTab === 'my' 
              ? "Your dashboard is clean. Raise a complaint if you face any issues in the village." 
              : "There are no complaints within your 5km radius. Your neighborhood seems peaceful!"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {currentData.map((c) => (
              <li key={c.id} className="p-6 transition-all hover:bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 leading-tight">{c.title}</h3>
                      {activeTab === 'nearby' && (
                        <span className="flex items-center text-xs font-black text-white bg-[#1E3A8A] px-2 py-0.5 rounded-full italic animate-pulse">
                          <MapPin className="w-3 h-3 mr-1" /> {c.distance} KM AWAY
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed mb-4">{c.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase font-black tracking-wider text-slate-400">
                      <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                        FOLDER: <span className="text-[#1E3A8A] ml-1">{c.category}</span>
                      </span>
                      <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                        LOCATION: <span className="text-slate-800 ml-1">{c.location}</span>
                      </span>
                      <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                        DATE: <span className="text-slate-800 ml-1">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end flex-shrink-0 min-w-[120px] justify-between gap-4">
                    {getStatusBadge(c.status)}
                    {c.imageUrl && (
                      <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#1E3A8A] hover:underline bg-blue-50 px-3 py-2 rounded-lg flex items-center transition-all">
                        IMAGE PROOF
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
