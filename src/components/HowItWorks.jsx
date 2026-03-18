import React from 'react';
import { motion } from 'framer-motion';
import { FaIdCard, FaLaptopHouse, FaChartPie, FaFileSignature, FaBell } from 'react-icons/fa';

const steps = [
  {
    icon: FaIdCard,
    title: 'Register securely',
    description: 'Verify your citizenship via simple Aadhaar-based authentication.',
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  {
    icon: FaLaptopHouse,
    title: 'Access Dashboard',
    description: 'Log in to your personalized village portal and view your community data.',
    color: 'bg-orange-100 text-orange-600 border-orange-200'
  },
  {
    icon: FaChartPie,
    title: 'Monitor & Track',
    description: 'Review fund allocations and observe real-time project progress.',
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  {
    icon: FaFileSignature,
    title: 'Submit Grievances',
    description: 'Lodge complaints directly to authorities to resolve local issues.',
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  {
    icon: FaBell,
    title: 'Receive Updates',
    description: 'Get notified regarding action taken and upcoming administrative events.',
    color: 'bg-red-100 text-red-600 border-red-200'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-t border-gray-100">
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
            User Journey
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-[#1E3A8A] mb-6"
          >
            How Pragati Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-500"
          >
            Connect to the digital infrastructure in five highly intuitive steps.
          </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-100 via-orange-100 to-green-100 h-[90%] top-[5%] rounded-full -z-0"></div>

          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Panel */}
                <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 font-light">{step.description}</p>
                  </div>
                </div>

                {/* Central Node */}
                <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full border-4 border-white shadow-xl items-center justify-center relative z-20 bg-white">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${step.color}`}>
                    <step.icon className="text-xl" />
                  </div>
                </div>

                {/* Number Indicator Space for Balance */}
                <div className={`w-full md:w-1/2 hidden md:flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[100px] font-black text-gray-100 opacity-50 leading-none select-none">
                    0{index + 1}
                  </span>
                </div>

                {/* Mobile Icons */}
                <div className="md:hidden flex items-center justify-center w-full">
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${step.color}`}>
                    <step.icon className="text-2xl" />
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
