import React from 'react';
import { ReceiptIndianRupee, Download, Search, Filter } from 'lucide-react';
import Table from '../../components/dashboard/Table';

const Expenditure = () => {
  // Dummy Data
  const expenditures = [
    { id: 'E012', project: 'Main Road Repairing (Sector 1 to 4)', amount: '₹45,000', date: '22 Oct 2023', status: 'Completed' },
    { id: 'E013', project: 'Solar Street Lights Installation', amount: '₹1,20,000', date: '18 Oct 2023', status: 'In Progress' },
    { id: 'E014', project: 'Panchayat Bhawan Maintenance', amount: '₹15,000', date: '10 Oct 2023', status: 'Completed' },
    { id: 'E015', project: 'New Water Pump for North Ward', amount: '₹85,000', date: '05 Oct 2023', status: 'Completed' },
    { id: 'E016', project: 'Desilting of Village Pond', amount: '₹30,000', date: '28 Sep 2023', status: 'Pending Approval' },
  ];

  const columns = [
    { header: 'Project Name', accessor: 'project', render: (row) => <span className="font-semibold text-slate-800">{row.project}</span> },
    { header: 'Amount Spent', accessor: 'amount', render: (row) => <span className="font-bold text-gov-blue">{row.amount}</span> },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
          row.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
          row.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-orange-50 text-orange-700 border-orange-200'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions',
      render: () => (
        <button className="p-2 text-slate-400 hover:text-gov-blue hover:bg-blue-50 rounded-lg transition-colors" title="Download Receipt">
          <Download size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-sm">
              <ReceiptIndianRupee size={24} />
            </div>
            Recent Expenditure
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Track village expenses to ensure complete transparency.</p>
        </div>
      </div>

      {/* Tools / Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects or transactions..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors w-full sm:w-auto justify-center">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-lg hover:bg-blue-800 shadow-sm shadow-gov-blue/20 font-medium transition-colors w-full sm:w-auto justify-center">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <Table data={expenditures} columns={columns} />

    </div>
  );
};

export default Expenditure;
