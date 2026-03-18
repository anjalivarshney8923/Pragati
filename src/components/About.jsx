import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-slate-50 relative">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:20px_20px] opacity-10 blur-[1px]"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image/Graphic Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540306195536-168a2bf06295?q=80&w=1200&auto=format&fit=crop" 
                alt="Village Governance Meeting" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 via-transparent to-transparent mix-blend-multiply"></div>
              
              {/* Badge Overlay */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Verified Data</h4>
                    <p className="text-gray-500 text-sm">Real-time DB Sync</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -top-6 -left-6 w-full h-full border-4 border-[#FF9933] rounded-3xl -z-10 opacity-30"></div>
          </motion.div>

          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-[#FF9933] font-semibold text-sm mb-6 border border-orange-100 tracking-wide uppercase">
              About Pragati
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E3A8A] leading-tight mb-8">
              Bridging the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#FF9933]">Citizens & Governance</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              Pragati is a revolutionary digital platform that empowers villagers with transparent access to vital public information. We aim to foster trust and accountability in local administration.
            </p>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
              By providing robust tools to monitor public funds, submit grievances, and track development projects, Pragati ensures that every citizen has a voice in the growth of their community.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                'Transparent Public Funds allocation tracking',
                'Direct Complaint & Grievance redressal system',
                'Real-time Development Project monitoring'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="min-w-[24px] h-6 rounded-full bg-[#138808]/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                  </div>
                  <span className="text-gray-800 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md group">
              Read Our Mission <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
