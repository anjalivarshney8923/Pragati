import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onChange, maxImages = 3 }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }
    
    setError('');

    const newImages = files.map(file => {
      // Create a local URL for UI preview
      const previewUrl = URL.createObjectURL(file);
      return { file, previewUrl, id: Math.random().toString(36).substring(7) };
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    if (onChange) onChange(updatedImages);
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removeImage = (idToRemove) => {
    const updatedImages = images.filter(img => img.id !== idToRemove);
    setImages(updatedImages);
    if (onChange) onChange(updatedImages);
    setError('');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
          <span>Upload Evidence</span>
          <span className="text-xs font-normal text-slate-500">
            {images.length}/{maxImages} images
          </span>
        </label>
        <p className="text-sm text-slate-500">Upload clear images for faster resolution</p>
      </div>

      {images.length < maxImages && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Camera Intent Input (works on mobile) */}
          <div 
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-gov-blue transition-colors group"
          >
            <Camera className="w-8 h-8 text-slate-400 group-hover:text-gov-blue mb-2 transition-colors" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-gov-blue">Capture Photo</span>
            <input 
              ref={cameraInputRef}
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={handleFileChange}
              multiple
            />
          </div>

          {/* Standard Gallery Input */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-gov-blue transition-colors group"
          >
            <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-gov-blue mb-2 transition-colors" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-gov-blue">Upload from Gallery</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              multiple
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium mt-2 bg-red-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex gap-4 flex-wrap mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
              <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
