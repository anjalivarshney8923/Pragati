import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, AlertTriangle } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, imageBanner }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* Left Side - Government Branding & Illustration */}
        <div className="md:w-1/2 bg-[#1E3A8A] text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9933] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-12">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 text-[#1E3A8A]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PRAGATI</h2>
                <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase">Governance Portal</p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Secure Access for <span className="text-[#FF9933]">Government Officials</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed opacity-90">
                Empowering Panchayat Raj and Government Authorities with digital tools for village development.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="bg-blue-900/40 border border-blue-400/30 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-6 h-6 text-[#FF9933] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Encrypted Environment</h4>
                  <p className="text-blue-200 text-sm">All administrative actions are logged and monitors by the State IT Department.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between text-xs text-blue-300 font-medium uppercase tracking-widest">
              <span>Digital India Initiative</span>
              <span>NIC Certified</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form Work Area */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col relative bg-white">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center mb-8">
            <Building2 className="w-8 h-8 text-[#1E3A8A] mr-2" />
            <h2 className="text-xl font-bold text-[#1E3A8A]">PRAGATI</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-2 text-lg">{subtitle}</p>}
          </div>

          <div className="flex-grow">
            {children}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
             <div className="flex items-center text-xs text-slate-400 space-x-4">
                <span className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                  Government Use Only
                </span>
                <span>•</span>
                <span>Session monitored</span>
                <span>•</span>
                <span>v2.4.0</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
