import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#1E3A8A] opacity-5 blur-3xl z-0"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FF9933] opacity-5 blur-3xl z-0"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[#138808] opacity-5 blur-3xl z-0"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 justify-between">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left mt-8 lg:mt-0"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#1E3A8A] font-semibold text-sm mb-6 border border-blue-100 uppercase tracking-wide"
            >
              {t('hero.digitalIndia')}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1E3A8A] leading-tight mb-6"
            >
              {t('hero.transparent')}<br className="hidden md:block" /> 
              <span className="text-[#FF9933]">{t('hero.governance')}</span>{t('hero.for')}<br className="hidden md:block" /> 
              {t('hero.every')}<span className="text-[#138808]">{t('hero.village')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light"
            >
              {t('hero.description')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button className="w-full sm:w-auto px-8 py-3.5 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                {t('hero.explore')}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1E3A8A] font-semibold rounded-lg border-2 border-[#1E3A8A] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
                {t('hero.accessPortal')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Illustration/Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
              {/* Main Image Base Placeholder */}
              <div className="w-[85%] h-[85%] bg-gradient-to-tr from-blue-100 to-orange-50 rounded-2xl shadow-xl border border-white relative overflow-hidden flex items-center justify-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop" 
                  alt="Rural Development" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 to-transparent"></div>
                
                {/* Floating Elements for Digital Look */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 backdrop-blur-md bg-white/90"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">₹</div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Fund Allocated</p>
                    <p className="text-sm font-bold text-gray-800">₹5.2 Cr</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 backdrop-blur-md bg-white/90"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">↗</div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Project Progress</p>
                    <p className="text-sm font-bold text-gray-800">85% Complete</p>
                  </div>
                </motion.div>
                
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
