import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      {/* Decorative Gradient Background */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 bg-${color}-500`}></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex items-center text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {trendValue}
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase whitespace-nowrap overflow-hidden">vs Last Month</span>
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
          color === 'blue' ? 'bg-blue-50 text-[#1E3A8A] shadow-blue-50 group-hover:bg-[#1E3A8A] group-hover:text-white' :
          color === 'green' ? 'bg-green-50 text-[#138808] shadow-green-50 group-hover:bg-[#138808] group-hover:text-white' :
          color === 'orange' ? 'bg-orange-50 text-[#FF9933] shadow-orange-50 group-hover:bg-[#FF9933] group-hover:text-white' :
          'bg-slate-100 text-slate-700 shadow-slate-50 group-hover:bg-slate-800 group-hover:text-white'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
