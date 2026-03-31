import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Download,
  Filter,
  UserPlus
} from 'lucide-react';

const mockCitizens = [
  { id: 'CIT-5021', name: 'Anjali Varshney', mobile: '9988776655', village: 'Miranpur', district: 'Ghaziabad', aadhaar: 'XXXX-XXXX-1234', status: 'VERIFIED' },
  { id: 'CIT-5022', name: 'Saurabh Gupta', mobile: '8877665544', village: 'Jalalabad', district: 'Ghaziabad', aadhaar: 'XXXX-XXXX-5678', status: 'VERIFIED' },
  { id: 'CIT-5023', name: 'Rahul Sharma', mobile: '7766554433', village: 'Miranpur', district: 'Ghaziabad', aadhaar: 'XXXX-XXXX-9012', status: 'PENDING' },
  { id: 'CIT-5024', name: 'Priya Verma', mobile: '6655443322', village: 'Hapur', district: 'Hapur', aadhaar: 'XXXX-XXXX-3456', status: 'VERIFIED' },
  { id: 'CIT-5025', name: 'Amit Kumar', mobile: '5544332211', village: 'Jalalabad', district: 'Ghaziabad', aadhaar: 'XXXX-XXXX-7890', status: 'VERIFIED' },
];

const Citizens = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCitizens = mockCitizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Citizen Master Repository</h1>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Secured database of registered village residents</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              Download Registry
           </button>
           <button className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#1a3278] transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Manual Enrollment
           </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-slate-200" />
         </div>
         
         <div className="flex-1 max-w-xl relative z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Primary Search: Name, Mobile or Citizen ID..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-gray-400 tracking-wide"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         <div className="flex items-center gap-4 z-10">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-blue-900 shadow-sm border border-slate-200">Village List</button>
               <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">District Map</button>
            </div>
            
            <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all group">
               <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
         </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">UID / Identity</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Legal Name</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Communication</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Native Location</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Aadhaar Mask</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCitizens.map((item) => (
                <tr key={item.id} className="group/row hover:bg-slate-50/80 transition-all cursor-pointer">
                  <td className="p-6">
                     <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-lg">{item.id}</span>
                  </td>
                  <td className="p-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm font-black text-xs text-slate-500">{item.name.charAt(0)}</div>
                        <span className="text-sm font-bold text-slate-800 tracking-tight">{item.name}</span>
                     </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-slate-600">{item.mobile}</td>
                  <td className="p-6">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter flex items-center gap-1">
                           <MapPin className="w-3 h-3 text-blue-600" />
                           {item.village}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-widest leading-none mt-0.5 ml-4 uppercase">{item.district}</span>
                     </div>
                  </td>
                  <td className="p-6 font-mono text-xs font-bold text-slate-400 tracking-widest">{item.aadhaar}</td>
                  <td className="p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                       item.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                       <ShieldCheck className={`w-3 h-3 ${item.status === 'VERIFIED' ? 'text-green-600' : 'text-amber-500'}`} />
                       {item.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Citizens;
