import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Landmark, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const VillageFunds = () => {
  const [selectedVillage, setSelectedVillage] = useState('bhojpur');
  const [selectedYear, setSelectedYear] = useState('2023_2024');
  const [selectedSubVillage, setSelectedSubVillage] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [data, setData] = useState(null);
  const [subVillages, setSubVillages] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const villages = ['bhojpur', 'loni', 'muradnagar', 'rajapur'];
  const years = ['2020_2021', '2021_2022', '2022_2023', '2023_2024', '2024_2025', '2025_2026'];

  const { t } = useTranslation();
  // Use Vite env var if provided, otherwise prefer IPv4 loopback to avoid macOS ::1 conflicts
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    fetchData();
  }, [selectedVillage, selectedYear, selectedSubVillage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
  const response = await axios.get(`${API_BASE}/village-funds/${selectedVillage}/${selectedYear}/${selectedSubVillage}`);
      const fetchedData = response.data;
      // Translate pie data names
      if (fetchedData.pie_data) {
        fetchedData.pie_data = fetchedData.pie_data.map(item => ({
          ...item,
          name: item.name === 'Funds Allocated' ? t('villageFunds.fundsAllocated') : t('villageFunds.fundsUsed')
        }));
      }
      setData(fetchedData);
      if (selectedSubVillage === 'all' && fetchedData.bar_data) {
        setSubVillages(['all', ...fetchedData.bar_data.map(d => d.sub_village)]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  const pieColors = ['#10b981', '#ef4444']; // Green for Allocated, Red for Used

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
              <Landmark size={24} />
            </div>
            {t('villageFunds.title')}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">{t('villageFunds.subtitle')}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('villageFunds.selectVillage')}</label>
            <select
              value={selectedVillage}
              onChange={(e) => { setSelectedVillage(e.target.value); setSelectedSubVillage('all'); setSubVillages(['all']); }}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {villages.map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('villageFunds.selectYear')}</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setSelectedSubVillage('all'); setSubVillages(['all']); }}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(y => <option key={y} value={y}>{y.replace('_', '-')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('villageFunds.selectSubVillage')}</label>
            <select
              value={selectedSubVillage}
              onChange={(e) => setSelectedSubVillage(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subVillages.map(sv => <option key={sv} value={sv}>{sv === 'all' ? t('villageFunds.allSubVillages') : sv}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('villageFunds.chartType')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-4 py-2 rounded-lg border ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
              >
                <PieIcon size={16} className="inline mr-1" /> {t('villageFunds.pie')}
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 rounded-lg border ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
              >
                <BarChart3 size={16} className="inline mr-1" /> {t('villageFunds.bar')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Totals */}
      {data && !error && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t('villageFunds.totalFundsAllocated')}</h3>
              <div className="text-3xl font-extrabold text-green-600">
                {formatAmount(data.total_allocated)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t('villageFunds.totalFundsUsed')}</h3>
              <div className="text-3xl font-extrabold text-red-600">
                {formatAmount(data.total_used)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{t('villageFunds.remainingBalance')}</h3>
              <div className="text-3xl font-extrabold text-blue-600">
                {formatAmount(data.total_allocated - data.total_used)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{t('villageFunds.fundsOverview')}</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && !error && (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'bar' ? (
              <BarChart data={data.bar_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sub_village" />
                <YAxis tickFormatter={formatAmount} />
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="allocated" fill="#10b981" name={t('villageFunds.fundsAllocated')} />
                <Bar dataKey="used" fill="#ef4444" name={t('villageFunds.fundsUsed')} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data.pie_data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.pie_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatAmount(value)} />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default VillageFunds;
