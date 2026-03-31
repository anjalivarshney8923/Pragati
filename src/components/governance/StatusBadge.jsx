import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-50 shadow-amber-50 cursor-pointer';
      case 'IN_PROGRESS':
      case 'ACTIVE':
        return 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-50 shadow-blue-50 cursor-wait';
      case 'RESOLVED':
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-100 ring-green-50 shadow-green-50 cursor-default';
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-100 ring-red-50 shadow-red-50 cursor-not-allowed';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 ring-slate-50 shadow-slate-50 cursor-default';
    }
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-inner ring-4 transition-all hover:scale-105 inline-block ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
