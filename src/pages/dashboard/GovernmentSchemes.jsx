import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Landmark, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const GovernmentSchemes = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedWorkType, setSelectedWorkType] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available options for filters
  const [states, setStates] = useState(['all']);
  const [districts, setDistricts] = useState(['all']);
  const [villages, setVillages] = useState(['all']);
  const [schemes, setSchemes] = useState(['all']);
  const [years, setYears] = useState(['all']);
  const [workTypes, setWorkTypes] = useState(['all']);

  const { t } = useTranslation();
  // Use Vite env var if provided, otherwise prefer IPv4 loopback to avoid macOS ::1 conflicts
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  // Fetch unique values on component mount
  useEffect(() => {
    fetchUniqueValues();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [selectedState, selectedDistrict, selectedVillage, selectedScheme, selectedYear, selectedWorkType]);

  const fetchUniqueValues = async () => {
    try {
      // Get all data to extract unique values
      const response = await axios.get(`${API_BASE}/schemes-funds`);
      // For now, we'll set some default values. In a real app, you'd want a separate endpoint for unique values
      setStates(['all', 'Uttar Pradesh']);
      setDistricts(['all', 'Ghaziabad']);
      setVillages(['all', 'Dasna', 'Muradnagar Village', 'Dhaulana', 'Sikandrabad']);
      setSchemes(['all', 'PMAY-G', 'NRLM', 'Jal Jeevan Mission']);
      setYears(['all', '2022-2023', '2023-2024', '2024-2025']);
      setWorkTypes(['all', 'Sanitation', 'Road Construction', 'Housing', 'Water Supply']);
    } catch (err) {
      console.error('Error fetching unique values:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        state: selectedState,
        district: selectedDistrict,
        village: selectedVillage,
        scheme: selectedScheme,
        year: selectedYear,
        work_type: selectedWorkType
      });

      const response = await axios.get(`${API_BASE}/schemes-funds?${params}`);
      const fetchedData = response.data;

      // Translate pie data names
      if (fetchedData.pie_data) {
        fetchedData.pie_data = fetchedData.pie_data.map(item => ({
          ...item,
          name: item.name === 'Funds Allocated' ? t('villageFunds.fundsAllocated') : t('villageFunds.fundsUsed')
        }));
      }
      setData(fetchedData);
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
            {t('sidebar.schemes')}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Track government scheme funds allocation and usage</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {states.map(state => <option key={state} value={state}>{state === 'all' ? 'All States' : state}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {districts.map(district => <option key={district} value={district}>{district === 'all' ? 'All Districts' : district}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {villages.map(village => <option key={village} value={village}>{village === 'all' ? 'All Villages' : village}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Scheme</label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {schemes.map(scheme => <option key={scheme} value={scheme}>{scheme === 'all' ? 'All Schemes' : scheme}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => <option key={year} value={year}>{year === 'all' ? 'All Years' : year}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Type</label>
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {workTypes.map(workType => <option key={workType} value={workType}>{workType === 'all' ? 'All Work Types' : workType}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Chart Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-4 py-2 rounded-lg border ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
              >
                <PieIcon size={16} className="inline mr-1" /> Pie
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 rounded-lg border ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'}`}
              >
                <BarChart3 size={16} className="inline mr-1" /> Bar
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
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Funds Allocated</h3>
              <div className="text-3xl font-extrabold text-green-600">
                {formatAmount(data.total_allocated)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Funds Used</h3>
              <div className="text-3xl font-extrabold text-red-600">
                {formatAmount(data.total_used)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Remaining Balance</h3>
              <div className="text-3xl font-extrabold text-blue-600">
                {formatAmount(data.total_allocated - data.total_used)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Scheme Funds Overview</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && !error && (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'bar' ? (
              <BarChart data={data.bar_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scheme" />
                <YAxis tickFormatter={formatAmount} />
                <Tooltip formatter={(value) => formatAmount(value)} />
                <Legend />
                <Bar dataKey="allocated" fill="#10b981" name="Funds Allocated" />
                <Bar dataKey="used" fill="#ef4444" name="Funds Used" />
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

export default GovernmentSchemes;
