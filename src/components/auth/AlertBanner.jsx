import React from 'react';
import { ShieldAlert, Info, AlertTriangle, Monitor } from 'lucide-react';

const icons = {
  warning: ShieldAlert,
  info: Info,
  alert: AlertTriangle,
  monitor: Monitor,
};

const AlertBanner = ({ type = "warning", message, title }) => {
  const Icon = icons[type] || icons.info;
  
  const styles = {
    warning: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    alert: "bg-amber-50 border-amber-200 text-amber-800",
    monitor: "bg-slate-50 border-slate-200 text-slate-800",
  };

  const iconStyles = {
    warning: "text-red-500",
    info: "text-blue-500",
    alert: "text-amber-500",
    monitor: "text-slate-500",
  };

  return (
    <div className={`p-4 rounded-xl border-l-4 mb-6 shadow-sm flex items-start space-x-3 transition-all animate-in fade-in slide-in-from-top-2 duration-500 font-sans ${styles[type]}`}>
      <div className={`p-2 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm flex-shrink-0 ${iconStyles[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        {title && <h5 className="font-extrabold text-sm uppercase tracking-wider mb-1">{title}</h5>}
        <p className="text-sm font-medium leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
