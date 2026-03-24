import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileWarning, 
  History, 
  Wallet, 
  ReceiptIndianRupee, 
  Landmark, 
  Bell, 
  HelpCircle,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Raise Complaint', path: '/complaint', icon: <FileWarning size={20} /> },
    { name: 'My Complaints', path: '/dashboard/complaints', icon: <History size={20} /> },
    { name: 'Village Funds', path: '/dashboard/funds', icon: <Wallet size={20} /> },
    { name: 'Expenditure', path: '/dashboard/expenditure', icon: <ReceiptIndianRupee size={20} /> },
    { name: 'Government Schemes', path: '/dashboard/schemes', icon: <Landmark size={20} /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
    { name: 'Help & Support', path: '/dashboard/support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 lg:hidden">
          <span className="text-xl font-bold text-gov-blue">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gov-blue text-white shadow-md shadow-gov-blue/20' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-gov-blue'
                  }`
                }
              >
                <div className="mr-3">{item.icon}</div>
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <div className="bg-gov-blue text-white w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold shadow-sm">
              <span className="text-xs">Pragati</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Empowering Rural India</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
