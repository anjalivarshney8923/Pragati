import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';

const FileUploadSecure = ({ label, name, required, accept = "application/pdf,image/*", onChange, value, helperText, error }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const clearFile = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!value ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`relative h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer group ${dragActive ? 'border-[#1E3A8A] bg-blue-50/50' : 'border-slate-300 hover:border-[#1E3A8A] hover:bg-slate-50'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
          <div className={`p-4 rounded-full mb-3 bg-slate-100 group-hover:bg-[#1E3A8A]/10 transition-colors`}>
            <Upload className={`w-8 h-8 text-slate-400 group-hover:text-[#1E3A8A] transition-colors`} />
          </div>
          <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
          <p className="text-slate-400 text-xs mt-1 uppercase font-bold tracking-tight">{helperText || 'PDF, PNG, JPG (Max 5MB)'}</p>
        </div>
      ) : (
        <div className="relative p-5 bg-blue-50/50 border-2 border-[#1E3A8A]/20 rounded-xl flex items-center shadow-inner">
          <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
             {value.type === 'application/pdf' ? (
               <FileText className="w-8 h-8 text-red-500" />
             ) : (
               <div className="relative w-8 h-8">
                 <img src={URL.createObjectURL(value)} alt="Preview" className="w-full h-full object-cover rounded shadow-sm" />
               </div>
             )}
          </div>
          <div className="flex-grow min-w-0">
             <div className="flex items-center space-x-2">
                <p className="text-sm font-bold text-slate-900 truncate">{value.name}</p>
                <CheckCircle className="w-4 h-4 text-[#138808] flex-shrink-0" />
             </div>
             <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">{(value.size / 1024 / 1024).toFixed(2)} MB • READY FOR VERIFICATION</p>
          </div>
          <button 
            type="button"
            onClick={clearFile}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-2 flex items-center space-x-1 font-bold text-red-500 uppercase tracking-tighter text-xs">
           <AlertCircle className="w-3.5 h-3.5" />
           <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadSecure;
