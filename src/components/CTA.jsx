import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#1E3A8A] to-[#0f1d45] text-white text-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9933] rounded-full mix-blend-multiply blur-[128px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#138808] rounded-full mix-blend-multiply blur-[128px] opacity-20 transform translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-white"
        >
          Join the Movement for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#ffb866]">Transparent Governance</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-blue-100 mb-12"
        >
          Step into a future where technology brings citizens and local leaders together seamlessly. Monitor funds, resolve issues, and power the growth of your village today.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6"
        >
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-[#1E3A8A] font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl">
            Register as Villager
          </button>
          
          <button className="w-full sm:w-auto px-10 py-4 bg-[#FF9933] text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-all shadow-xl hover:shadow-2xl border border-orange-400">
            Access Governance Portal
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-blue-300 mt-8"
        >
          Note: Admin access requires offline authorization via Block Development Office.
        </motion.p>

      </div>
    </section>
  );
};

export default CTA;
