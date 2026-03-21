import React from 'react';
import { motion } from 'framer-motion';

const FormCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}
    >
      <div className="bg-[#1E3A8A] text-white py-6 px-8 flex justify-between items-center relative overflow-hidden">
        <div className="z-10 relative">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-blue-200 mt-1 text-sm">{subtitle}</p>}
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 right-10 -mb-8 w-24 h-24 rounded-full bg-[#FF9933] opacity-20"></div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </motion.div>
  );
};

export default FormCard;
