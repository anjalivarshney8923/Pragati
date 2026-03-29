import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Loader from '../../components/Loader';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch complaints. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
            <AlertCircle className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
            <CheckCircle className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <Loader text="Loading your complaints..." />;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">My Complaints</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 shadow-sm border border-red-100 flex items-center font-medium">
          <AlertCircle className="w-5 h-5 mr-3" /> {error}
        </div>
      )}

      {complaints.length === 0 && !error ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-16 text-center animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5 drop-shadow-md" />
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">No Complaints Yet</h2>
          <p className="text-slate-500 text-lg">You haven't raised any complaints. Everything looks perfectly fine!</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <li key={c.id} className="p-6 transition-all duration-300 hover:bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1 leading-tight">{c.title}</h3>
                    <p className="text-slate-600 line-clamp-2 md:line-clamp-3 leading-relaxed">{c.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Cat: <span className="text-[#1E3A8A] uppercase">{c.category}</span></span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Loc: <span className="text-slate-800">{c.location}</span></span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Date: <span className="text-slate-800">{new Date(c.createdAt).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end flex-shrink-0 min-w-[120px] justify-between h-full">
                    {getStatusBadge(c.status)}
                    {c.imageUrl && (
                      <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#1E3A8A] hover:text-blue-500 transition-colors mt-4 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                        View Attachment
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
