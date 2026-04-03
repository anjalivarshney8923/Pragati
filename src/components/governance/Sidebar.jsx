import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  IndianRupee, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/governance/overview' },
    { name: 'Complaints', icon: MessageSquare, path: '/governance/complaints' },
    { name: 'Citizen Records', icon: Users, path: '/governance/citizens' },
    { name: 'Funds & Schemes', icon: IndianRupee, path: '/governance/funds' },
    { name: 'Reports', icon: BarChart3, path: '/governance/reports' },
    { name: 'Notifications', icon: Bell, path: '/governance/notifications' },
    { name: 'Settings', icon: Settings, path: '/governance/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('officer');
    navigate('/officer-login');
  };

  return (
    <aside 
      className={`bg-[#1E3A8A] text-white transition-all duration-300 flex flex-col h-screen fixed lg:relative z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-blue-800/50">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-widest text-[#FF9933]">PRAGATI</span>
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-tighter opacity-80">Gov Admin Panel</span>
            </div>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 hover:bg-blue-800 rounded-lg transition-colors ml-auto"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5 mx-auto" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue-800 text-white shadow-lg shadow-black/10' 
                  : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
            {isOpen && (
              <span className="text-sm font-bold tracking-wide uppercase whitespace-nowrap overflow-hidden">
                 {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer (Logout) */}
      <div className="p-4 border-t border-blue-800/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-3 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group font-bold uppercase tracking-widest text-xs"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
