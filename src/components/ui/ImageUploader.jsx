import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import CameraCapture from './CameraCapture';

const ImageUploader = ({ onChange, maxImages = 3 }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const cameraPhotoRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const [showCaptureOptions, setShowCaptureOptions] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      setError(t('raiseComplaint.maxImagesError', { max: maxImages }));
      return;
    }
    
    setError('');

    const newImages = files.map(file => {
      // Create a local URL for UI preview (works for images and videos)
      const previewUrl = URL.createObjectURL(file);
      return { file, previewUrl, id: Math.random().toString(36).substring(7), type: file.type };
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    if (onChange) onChange(updatedImages);
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (cameraPhotoRef.current) cameraPhotoRef.current.value = '';
    if (cameraVideoRef.current) cameraVideoRef.current.value = '';
  };

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState('photo');

  const handleCapturedFile = (file) => {
    if (!file) return;
    if (images.length + 1 > maxImages) {
      setError(t('raiseComplaint.maxImagesError', { max: maxImages }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const newItem = { file, previewUrl, id: Math.random().toString(36).substring(7), type: file.type };
    const updated = [...images, newItem];
    setImages(updated);
    if (onChange) onChange(updated);
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
          <span>{t('raiseComplaint.uploadEvidence')}</span>
          <span className="text-xs font-normal text-slate-500">
            {t('raiseComplaint.imagesCount', { count: images.length, max: maxImages })}
          </span>
        </label>
        <p className="text-sm text-slate-500">{t('raiseComplaint.uploadClearImages')}</p>
      </div>

      {images.length < maxImages && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Camera Intent Input (works on mobile) - accepts images & videos */}
          <div className="relative">
            <div
              onClick={() => setShowCaptureOptions(prev => !prev)}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-gov-blue transition-colors group"
            >
              <Camera className="w-8 h-8 text-slate-400 group-hover:text-gov-blue mb-2 transition-colors" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-gov-blue">{t('raiseComplaint.captureMedia')}</span>
            </div>

            {/* Capture options popover */}
            {showCaptureOptions && (
              <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-md z-50 p-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setCameraMode('photo'); setShowCaptureOptions(false); setShowCameraModal(true); }}
                  className="flex-1 bg-white border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {t('raiseComplaint.capturePhoto')}
                </button>
                <button
                  type="button"
                  onClick={() => { setCameraMode('video'); setShowCaptureOptions(false); setShowCameraModal(true); }}
                  className="flex-1 bg-white border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Record Video
                </button>
              </div>
            )}

            {/* Hidden inputs for photo and video to ensure correct capture mode on mobile */}
            <input 
              ref={cameraPhotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={handleFileChange}
            />
            <input
              ref={cameraVideoRef}
              type="file"
              accept="video/*"
              capture="camcorder"
              className="sr-only"
              onChange={handleFileChange}
            />
            {showCameraModal && (
              <CameraCapture
                mode={cameraMode}
                onClose={() => setShowCameraModal(false)}
                onCapture={(file) => handleCapturedFile(file)}
                onFallback={(mode) => {
                  // open the native file input as fallback
                  setTimeout(() => {
                    if (mode === 'photo') cameraPhotoRef.current?.click();
                    else cameraVideoRef.current?.click();
                  }, 50);
                }}
              />
            )}
          </div>

          {/* Standard Gallery Input */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 hover:border-gov-blue transition-colors group"
          >
            <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-gov-blue mb-2 transition-colors" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-gov-blue">{t('raiseComplaint.uploadFromGallery')}</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,video/*" 
              className="sr-only" 
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
            <div key={img.id} className="relative w-36 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
              {img.type && img.type.startsWith('video/') ? (
                <video src={img.previewUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              )}
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
