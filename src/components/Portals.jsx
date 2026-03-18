import React from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaUsers, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Portals = () => {
  return (
    <section id="portals" className="py-24 bg-slate-50">
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
            Access Roles
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6"
          >
            Digital Gateways
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-500"
          >
            Dedicated entry points tailored for different users to ensure a streamlined experience.
          </motion.p>
        </div>

        {/* Portals Content */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Villager Portal Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 bg-white rounded-3xl p-10 lg:p-14 shadow-xl border border-gray-100 relative group overflow-hidden"
          >
            {/* Background Highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors"></div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-blue-200">
                <FaUsers className="text-4xl text-[#1E3A8A]" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Villager Portal</h3>
              <p className="text-gray-600 mb-10 leading-relaxed font-light">
                Allows citizens to monitor village funds, track projects, and submit complaints transparently.
              </p>

              <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
                {['Fund details', 'Complaint submission', 'Project updates', 'Community announcements'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <FaCheckCircle className="text-green-500 min-w-[16px]" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-4 px-6 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md group-hover:shadow-lg flex justify-center items-center gap-2">
              Enter Villager Portal <FaArrowRight />
            </button>
          </motion.div>

          {/* Governance Portal Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/2 bg-gradient-to-br from-[#FF9933] to-[#e68a2e] rounded-3xl p-10 lg:p-14 shadow-xl text-white relative group overflow-hidden"
          >
            {/* Background Highlight */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors"></div>

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/30">
                <FaUserShield className="text-4xl text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Governance Portal</h3>
              <p className="text-white/90 mb-10 leading-relaxed font-light">
                Secure portal for Pradhan or village administrators to manage and report development activities.
              </p>

              <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
                {['Fund allocation management', 'Complaint resolution', 'Project updates', 'Community notifications'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-medium">
                    <FaCheckCircle className="text-white min-w-[16px]" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full py-4 px-6 bg-white text-[#FF9933] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-md group-hover:shadow-lg flex justify-center items-center gap-2">
              Enter Governance Portal <FaArrowRight />
            </button>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default Portals;
