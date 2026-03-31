import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck,
  Globe,
  Settings,
  ChevronRight,
  MoreVertical,
  MousePointer2
} from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'COMPLAINT', title: 'New Urgent Complaint', desc: 'Critical water leakage reported in Miranpur Sector 4.', time: '2 mins ago', status: 'UNREAD', icon: MessageSquare, color: 'blue' },
  { id: 2, type: 'APPROVAL', title: 'Officer Approval Pending', desc: 'Arvind Sharma (Pradhan) requested access to the portal.', time: '15 mins ago', status: 'UNREAD', icon: UserPlus, color: 'orange' },
  { id: 3, type: 'SYSTEM', title: 'Security Audit Success', desc: 'Monthly biometric database integrity check completed.', time: '1 hour ago', status: 'READ', icon: ShieldCheck, color: 'green' },
  { id: 4, type: 'ALERT', title: 'Budget Threshold Warning', desc: 'Infrastructure fund usage reached 85% of Q1 ceiling.', time: '3 hours ago', status: 'READ', icon: AlertTriangle, color: 'red' },
  { id: 5, type: 'COMPLAINT', title: 'Grievance Resolved', desc: 'Electricity issue in Jalalabad (ID: CMP-1026) marked as resolved.', time: '5 hours ago', status: 'READ', icon: CheckCircle2, color: 'green' },
];

const Notifications = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Notification Command Center</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Real-time administrative alerts and system activities</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              Mark all as Read
           </button>
           <button className="p-2.5 bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden group/list relative">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/list:opacity-10 transition-opacity">
            <Bell className="w-32 h-32 text-blue-600 rotate-12" />
         </div>

         <div className="flex items-center gap-6 p-10 bg-slate-50/50 border-b border-slate-100 relative z-10">
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
               <button className="px-6 py-2 rounded-xl bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Recent Feed</button>
               <button className="px-6 py-2 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Audit Logs</button>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic ml-auto">
               <Clock className="w-3.5 h-3.5" />
               Live Synchronizing...
            </div>
         </div>

         <div className="divide-y divide-slate-100 relative z-10">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className={`group p-8 flex items-start gap-8 hover:bg-slate-50/50 transition-all cursor-pointer relative ${notif.status === 'UNREAD' ? 'bg-blue-50/20' : ''}`}>
                 {notif.status === 'UNREAD' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF9933] group-hover:w-2 transition-all"></div>
                 )}
                 
                 {/* Icon Grid */}
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-white shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3 ${
                    notif.color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-100/50' :
                    notif.color === 'orange' ? 'bg-orange-50 text-orange-500 shadow-orange-100/50' :
                    notif.color === 'green' ? 'bg-green-50 text-green-600 shadow-green-100/50' :
                    'bg-red-50 text-red-500 shadow-red-100/50'
                 }`}>
                    <notif.icon className="w-6 h-6" />
                 </div>

                 {/* Content Grid */}
                 <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Globe className="w-3 h-3 text-blue-600" />
                          {notif.type}
                       </span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                       </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-blue-900 transition-colors uppercase">{notif.title}</h3>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-2xl">{notif.desc}</p>
                 </div>

                 {/* Action Grid */}
                 <div className="flex items-center gap-4 self-center ml-auto opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                    <button className="px-6 py-3 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                       Take Action
                       <ChevronRight className="w-3 h-3" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-slate-800 transition-colors rounded-xl bg-white border border-slate-100 shadow-sm">
                       <MoreVertical className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            ))}
         </div>

         {/* Empty State / Footer */}
         <div className="p-8 bg-slate-50/50 text-center flex flex-col items-center justify-center group overflow-hidden border-t border-slate-100 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 via-blue-50/0 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] relative z-10 flex items-center gap-3">
               <MousePointer2 className="w-3 h-3 animate-bounce" />
               Scroll for Archived Alerts
            </p>
         </div>
      </div>
    </div>
  );
};

export default Notifications;
