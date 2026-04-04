import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle2, Info, AlertTriangle, MessageSquare, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { notificationService } from '../../services/api';

import { toast } from 'react-toastify';

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleTestEmail = async () => {
    try {
      const defaultEmail = prompt("Enter an email to test Google SMTP:", "test@example.com");
      if (!defaultEmail) return;
      const response = await fetch(`http://localhost:8080/api/test-email?email=${defaultEmail}`);
      if (response.ok) {
        toast.success("Test Email triggered successfully!");
      } else {
        toast.error("Failed to trigger email.");
      }
    } catch (e) {
      toast.error("Network error triggering email.");
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'ESCALATION':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'UPDATE':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'SYSTEM':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgForType = (type) => {
    switch (type) {
      case 'ESCALATION':
        return 'bg-orange-50 border-orange-100';
      case 'UPDATE':
        return 'bg-blue-50 border-blue-100';
      case 'SYSTEM':
        return 'bg-green-50 border-green-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin text-[#1E3A8A]">
          <RefreshCw size={32} />
        </div>
        <p className="text-slate-500 font-medium">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center shadow-sm">
        <AlertTriangle className="w-8 h-8 mx-auto xl mb-3" />
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 bg-gradient-to-r from-gov-blue/5 to-transparent relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center shadow-lg shadow-blue-200">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Notifications</h2>
                <p className="text-slate-500 text-xs font-semibold">Track your complaint status and official responses</p>
              </div>
            </div>
            <button 
              onClick={handleTestEmail}
              className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-4 py-2 transition-all shadow-sm"
            >
              Test Email Delivery
            </button>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mt-3">
             Stay updated on the progress of your active complaints. System alerts and officer responses are automatically logged here and mirrored to your registered email address.
          </p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-gov-blue/5 rounded-full blur-2xl z-0" />
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border text-center border-slate-200 p-12 rounded-3xl shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Notifications Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
            When you raise a complaint or when an officer updates your complaint status, the notifications will appear right here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => markAsRead(notif.id, notif.isRead)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm flex items-start gap-4 
                ${notif.isRead ? 'bg-white border-slate-200 opacity-75' : 'bg-white border-blue-200 ring-2 ring-blue-50'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${getBgForType(notif.type)}`}>
                {getIconForType(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] flex items-center gap-1 text-slate-400 font-medium whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    {formatDate(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                  {notif.message}
                </p>
                {notif.relatedComplaintId && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-200">
                      Ref #{notif.relatedComplaintId}
                    </span>
                  </div>
                )}
              </div>

              {!notif.isRead && (
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-4 shadow-sm shadow-blue-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
