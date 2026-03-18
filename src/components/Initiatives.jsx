import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaLandmark, FaTree, FaDatabase } from 'react-icons/fa';

const programs = [
  { name: 'Digital India', icon: FaLaptopCode, color: 'text-blue-500' },
  { name: 'e-Governance', icon: FaLandmark, color: 'text-gray-700' },
  { name: 'Rural Development Mission', icon: FaTree, color: 'text-green-600' },
  { name: 'Open Government Data', icon: FaDatabase, color: 'text-orange-500' },
];

const Initiatives = () => {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Aligned With Government Initiatives</p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {programs.map((prog, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-center gap-3 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all cursor-pointer"
            >
              <prog.icon className={`text-4xl ${prog.color}`} />
              <span className="text-lg font-bold text-gray-700 tracking-tight">{prog.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Initiatives;
