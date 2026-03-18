import React from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaComments, FaTools, FaUserCircle, FaBullhorn, FaChartBar } from 'react-icons/fa';

const featuresData = [
  {
    icon: FaMoneyBillWave,
    title: 'Fund Transparency',
    description: 'View detailed breakdown of government fund allocation and spending.',
    color: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: FaComments,
    title: 'Complaint Management',
    description: 'Submit complaints related to infrastructure, water supply, electricity, etc.',
    color: 'from-orange-400 to-orange-600',
    bgLight: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    icon: FaTools,
    title: 'Project Monitoring',
    description: 'Track village development projects in real-time.',
    color: 'from-green-500 to-green-700',
    bgLight: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: FaUserCircle,
    title: 'Citizen Dashboard',
    description: 'Personalized dashboard for villagers to manage information.',
    color: 'from-purple-500 to-purple-700',
    bgLight: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: FaBullhorn,
    title: 'Announcements',
    description: 'Receive important updates and alerts from local administration.',
    color: 'from-red-500 to-red-700',
    bgLight: 'bg-red-50',
    iconColor: 'text-red-600',
  },
  {
    icon: FaChartBar,
    title: 'Data Insights',
    description: 'Interactive charts and visual analytics for full transparency.',
    color: 'from-teal-500 to-teal-700',
    bgLight: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] font-semibold text-sm mb-4 border border-blue-100 uppercase tracking-widest"
          >
            Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6"
          >
            Core Functions of Pragati
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-500"
          >
            Our dynamic platform scales essential governance services up to the village level, ensuring equitable access and total observability.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm transition-all relative overflow-hidden group cursor-pointer"
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              
              <div className={`w-14 h-14 rounded-xl ${feat.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className={`text-2xl ${feat.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#1E3A8A] transition-colors">{feat.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
