import React from 'react';
import { ShieldCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
  secure: ShieldCheck,
};

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-orange-50 text-orange-800 border-orange-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  secure: 'bg-slate-50 text-slate-700 border-slate-200',
};

const iconColors = {
  success: 'text-green-600',
  warning: 'text-orange-600',
  info: 'text-blue-600',
  secure: 'text-slate-600',
};

const AlertBox = ({ type = 'info', children, className = '' }) => {
  const Icon = icons[type] || Info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${styles[type]} shadow-sm ${className}`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
      <div className="text-sm font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default AlertBox;
