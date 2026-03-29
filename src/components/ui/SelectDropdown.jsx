import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectDropdown = ({ label, id, required, options, placeholder, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          required={required}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue outline-none transition-all bg-white shadow-sm appearance-none text-slate-700"
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

export default SelectDropdown;
