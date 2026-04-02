import React from 'react';
import { Menu, LogOut, User, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth-related storage and redirect to login
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    navigate('/login', { replace: true });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none p-1 rounded-md hover:bg-slate-100"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-md bg-gov-blue flex items-center justify-center group-hover:bg-blue-800 transition-colors">
                <span className="text-white font-bold text-lg leading-none pt-0.5">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gov-blue leading-none tracking-tight">{t('navbar.title')}</h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">{t('navbar.subtitle')}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="relative p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            <Bell size={20} />
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-semibold rounded-full border border-gov-blue text-gov-blue hover:bg-gov-blue hover:text-white transition-colors"
            >
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700 leading-none mb-1">Anjali</span>
              <span className="text-xs text-slate-500 leading-none">{t('navbar.villager')}</span>
            </div>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-gov-blue">
                <User size={18} />
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
              title="Logout"
            >
              <LogOut size={16} />
              <span>{t('navbar.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
