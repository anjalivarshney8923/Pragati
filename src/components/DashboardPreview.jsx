import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

const fundAllocationData = [
  { name: 'Infrastructure', value: 45 },
  { name: 'Education', value: 25 },
  { name: 'Healthcare', value: 20 },
  { name: 'Water & Sanitation', value: 10 },
];
const COLORS = ['#1E3A8A', '#FF9933', '#138808', '#FBBF24'];

const projectProgressData = [
  { name: 'Jan', completed: 10, target: 15 },
  { name: 'Feb', completed: 25, target: 30 },
  { name: 'Mar', completed: 40, target: 45 },
  { name: 'Apr', completed: 55, target: 60 },
  { name: 'May', completed: 75, target: 80 },
  { name: 'Jun', completed: 90, target: 100 },
];

const complaintResolutionData = [
  { name: 'Q1', resolved: 120, pending: 30 },
  { name: 'Q2', resolved: 150, pending: 20 },
  { name: 'Q3', resolved: 180, pending: 15 },
  { name: 'Q4', resolved: 210, pending: 5 },
];

const DashboardPreview = () => {
  return (
    <section id="transparency" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl -ml-48 -mt-48 z-0"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-[#138808] font-semibold text-sm mb-4 border border-green-100 uppercase tracking-widest"
          >
            Analytics & Data
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6"
          >
            Real-Time Transparency
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-500"
          >
            Empowering citizens with rich, interactive data on fund distribution, project metrics, and government responsiveness.
          </motion.p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Fund Allocation Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Village Fund Allocation (2025-2026)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {fundAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '10px', fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="space-y-8">
            {/* Project Progress Line Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Development Progress</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="completed" stroke="#138808" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="target" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Complaint Resolution Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quarterly Complaint Resolutions</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complaintResolutionData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} cursor={{ fill: '#F3F4F6' }} />
                    <Bar dataKey="resolved" stackId="a" fill="#1E3A8A" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="pending" stackId="a" fill="#FF9933" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
