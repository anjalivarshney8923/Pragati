import React from 'react';

const StatCard = ({ icon, number, label, colorClass = "text-gov-blue", bgClass = "bg-blue-50" }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">
          {number}
        </h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
