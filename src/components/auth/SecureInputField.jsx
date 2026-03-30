import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Mail, Hash, MapPin, Briefcase, FileText } from 'lucide-react';

const icons = {
  user: User,
  lock: Lock,
  mail: Mail,
  hash: Hash,
  mapPin: MapPin,
  briefcase: Briefcase,
  fileText: FileText,
};

const SecureInputField = ({ label, name, type = "text", placeholder, icon, register, error, required, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = icons[icon] || icons.fileText;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#1E3A8A] text-slate-400">
          <Icon className="w-5 h-5 flex-shrink-0" />
        </div>
        <input
          {...(register ? register(name, { required }) : {})}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={`block w-full pl-10 pr-10 py-3 bg-slate-50 border-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-blue-100'} rounded-xl transition-all outline-none focus:ring-4 text-slate-900 font-medium placeholder:text-slate-400`}
          placeholder={placeholder}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-red-500 uppercase tracking-tight">{error.message || `This field is required`}</p>}
    </div>
  );
};

export default SecureInputField;
