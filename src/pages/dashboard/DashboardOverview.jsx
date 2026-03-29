import React from 'react';
import { FileWarning, CheckCircle2, Wallet, TrendingDown, ArrowRight, LayoutList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatCard from '../../components/dashboard/StatCard';
import Table from '../../components/dashboard/Table';

const DashboardOverview = () => {
  const { t } = useTranslation();
  // Dummy Data
  const recentComplaints = [
    { id: 'C001', title: 'Street light not working in Sector 4', status: 'Pending', date: 'Oct 24, 2023' },
    { id: 'C002', title: 'Water pipe leakage near Panchayat Bhawan', status: 'Resolved', date: 'Oct 22, 2023' },
    { id: 'C003', title: 'Request for new dustbins', status: 'In Progress', date: 'Oct 18, 2023' },
    { id: 'C004', title: 'Pothole repair on Main Road', status: 'Pending', date: 'Oct 15, 2023' },
  ];

  const columns = [
    { header: 'Complaint Title', accessor: 'title' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          row.status === 'Resolved' ? 'bg-green-100 text-green-700' :
          row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Date', accessor: 'date' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 bg-gradient-to-r from-gov-blue/5 to-transparent relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">
            {t('dashboard.welcome')} <span className="inline-block hover:animate-wiggle cursor-default">👋</span>
          </h2>
          <p className="text-slate-600 font-medium">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-gov-blue/5 rounded-full blur-2xl z-0"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-orange-400/5 rounded-full blur-xl z-0"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={<FileWarning className="w-6 h-6" />} 
          number="12" 
          label={t('dashboard.totalComplaints')} 
          colorClass="text-orange-600"
          bgClass="bg-orange-100"
        />
        <StatCard 
          icon={<CheckCircle2 className="w-6 h-6" />} 
          number="8" 
          label={t('dashboard.resolvedComplaints')} 
          colorClass="text-green-600"
          bgClass="bg-green-100"
        />
        <StatCard 
          icon={<Wallet className="w-6 h-6" />} 
          number="₹4.2L" 
          label={t('dashboard.availableFunds')} 
          colorClass="text-blue-600"
          bgClass="bg-blue-100"
        />
        <StatCard 
          icon={<TrendingDown className="w-6 h-6" />} 
          number="₹1.8L" 
          label={t('dashboard.totalExpenditure')} 
          colorClass="text-purple-600"
          bgClass="bg-purple-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LayoutList size={20} className="text-gov-blue" />
              {t('dashboard.recentActivity')}
            </h3>
            <Link to="/dashboard/complaints" className="text-sm font-semibold text-gov-blue hover:text-blue-800 flex items-center gap-1 group">
              {t('dashboard.viewAll')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Table data={recentComplaints} columns={columns} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-transparent">
            {t('dashboard.quickActions')}
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <Link 
              to="/dashboard/complaints/new"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-gov-blue/30 bg-slate-50 hover:bg-gov-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <FileWarning size={18} />
                </div>
                <span className="font-semibold text-slate-700">{t('dashboard.raiseComplaint')}</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-gov-blue transition-colors" />
            </Link>

            <Link 
              to="/dashboard/funds"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-gov-blue/30 bg-slate-50 hover:bg-gov-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Wallet size={18} />
                </div>
                <span className="font-semibold text-slate-700">{t('dashboard.viewFunds')}</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-gov-blue transition-colors" />
            </Link>

            <Link 
              to="/dashboard/expenditure"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-gov-blue/30 bg-slate-50 hover:bg-gov-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <TrendingDown size={18} />
                </div>
                <span className="font-semibold text-slate-700">{t('dashboard.trackExpenditure')}</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-gov-blue transition-colors" />
            </Link>

            <Link 
              to="/dashboard/schemes"
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-gov-blue/30 bg-slate-50 hover:bg-gov-blue/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={18} />
                </div>
                <span className="font-semibold text-slate-700">{t('dashboard.applyScheme')}</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-gov-blue transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
