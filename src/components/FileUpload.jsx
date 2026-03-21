import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';

const FileUpload = ({ label, onFileSelect, previewUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Please upload an image file (JPG, PNG)');
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-[#1E3A8A] bg-blue-50' : 'border-slate-300 hover:border-[#1E3A8A] hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <UploadCloud className="w-12 h-12 text-[#FF9933] mb-3" />
          <p className="text-sm text-slate-600 font-medium mb-1">Click or drag image to upload</p>
          <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center text-sm text-slate-600 font-medium">
              <FileImage className="w-4 h-4 mr-2 text-[#138808]" />
              Image Selected
            </div>
            <button 
              type="button" 
              onClick={onClear}
              className="p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain rounded-lg border border-slate-200 bg-white" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
