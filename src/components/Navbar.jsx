import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaSearch, FaBars, FaTimes, FaFont } from 'react-icons/fa';
import { MdOutlineAccessibleForward } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TopUtilityBar = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-[#1E3A8A] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center w-full z-50">
      <div className="flex items-center space-x-4">
        <span className="font-medium tracking-wide hidden sm:inline-block">GOVERNMENT DIGITAL GOVERNANCE INITIATIVE</span>
        <span className="font-medium tracking-wide sm:hidden">GOVT OF INDIA</span>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="hidden md:block">{currentDate}</div>
        <div className="flex space-x-2">
          <button className="hover:text-[#FF9933] transition-colors" title="Skip to main content">Skip to Main Content</button>
        </div>
        <div className="flex space-x-3 items-center border-l border-white/30 pl-4">
          <button className="hover:text-[#FF9933] transition-colors flex items-center gap-1" title="Accessibility">
            <MdOutlineAccessibleForward size={14} />
          </button>
          <div className="flex items-center gap-1 bg-white/10 px-1 rounded">
            <button className="px-1 text-[10px] hover:text-[#FF9933]">A-</button>
            <button className="px-1 text-xs hover:text-[#FF9933]">A</button>
            <button className="px-1 text-sm hover:text-[#FF9933]">A+</button>
          </div>
          <button
            onClick={toggleLanguage}
            className="hover:text-[#FF9933] transition-colors flex items-center gap-1 font-semibold border border-white/40 px-2 py-0.5 rounded text-[10px]"
          >
            <FaGlobe size={10} /> {i18n.language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuItems = ['Home', 'About', 'Features', 'Transparency', 'How It Works', 'Portals', 'Contact'];

  return (
    <header className="fixed w-full top-0 z-40 bg-white shadow-md flex flex-col">
      <TopUtilityBar />
      <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-white" aria-label="Main Navigation">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center p-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933] to-[#138808] opacity-80" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-full z-10 invert brightness-0" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A] tracking-tight m-0 leading-none pb-1">PRAGATI</h1>
            <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider m-0 leading-none">Smart Village Governance</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-medium text-gray-700 hover:text-[#1E3A8A] transition-colors hover:font-semibold">
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link to="/register" className="border-2 border-[#1E3A8A] text-[#1E3A8A] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm flex items-center justify-center">
            Villager Portal
          </Link>
          <button
            onClick={() => navigate('/officer-login')}
            className="bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A] text-white px-4 py-2 rounded-md text-sm font-semibold hover:shadow-lg transition-all shadow-md"
          >
            Governance Portal
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#1E3A8A] p-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] rounded">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <ul className="flex flex-col py-4 px-6 space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="block text-base font-medium text-gray-800 hover:text-[#FF9933]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/register" className="w-full border-2 border-[#1E3A8A] text-[#1E3A8A] py-2 rounded-md font-semibold text-center block">Villager Portal</Link>
                <button 
                  onClick={() => { navigate('/officer-login'); setIsOpen(false); }}
                  className="w-full bg-[#1E3A8A] text-white py-2 rounded-md font-semibold text-center mt-2"
                >
                  Governance Portal
                </button>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
