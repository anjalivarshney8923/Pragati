import React from 'react';
import { Wallet, PieChart, Landmark, IndianRupee } from 'lucide-react';

const VillageFunds = () => {
  // Dummy Data
  const totalAllocated = 600000;
  const fundsUsed = 180000;
  const remaining = totalAllocated - fundsUsed;
  
  const progressPercentage = (fundsUsed / totalAllocated) * 100;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
              <Landmark size={24} />
            </div>
            Village Funds
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Real-time overview of Gram Panchayat fund allocation and usage.</p>
        </div>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Budget Allocated (2023-24)</h3>
              <div className="text-4xl lg:text-5xl font-extrabold text-gov-blue tracking-tight">
                ₹{totalAllocated.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-sm font-bold text-slate-700">
                <span>Funds Utilization</span>
                <span>{progressPercentage.toFixed(1)}% Used</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-gov-blue to-blue-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>₹0</span>
                <span>₹{totalAllocated.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col justify-center space-y-4 md:border-l md:border-slate-100 md:pl-8">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 transition-all hover:shadow-md">
              <p className="text-xs font-bold text-green-600 uppercase mb-1">Remaining Balance</p>
              <p className="text-2xl font-bold text-slate-800">₹{remaining.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 transition-all hover:shadow-md">
              <p className="text-xs font-bold text-orange-600 uppercase mb-1">Funds Used</p>
              <p className="text-2xl font-bold text-slate-800">₹{fundsUsed.toLocaleString('en-IN')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Breakdowns */}
      <h3 className="text-xl font-bold text-slate-800 pt-4 flex items-center gap-2">
        <PieChart className="text-gov-blue" size={24} />
        Fund Categories
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Infrastructure", amount: "₹2,50,000", color: "blue" },
          { title: "Water Management", amount: "₹1,20,000", color: "teal" },
          { title: "Sanitation", amount: "₹80,000", color: "orange" },
          { title: "Education", amount: "₹1,00,000", color: "purple" },
          { title: "Healthcare", amount: "₹50,000", color: "rose" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-center gap-4 hover:border-slate-300 transition-colors">
            <div className={`p-4 rounded-full bg-${item.color}-50 text-${item.color}-600`}>
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{item.title}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{item.amount}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VillageFunds;
