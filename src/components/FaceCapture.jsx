console.log("FACE COMPONENT LOADED 🔥");
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, XCircle } from 'lucide-react';
import Button from './Button';

const FaceCapture = ({ onCapture, existingImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState(existingImage || null);
  const [isActive, setIsActive] = useState(false);

  // ✅ Mock Start Camera and Capture Instantly
  const startCamera = () => {
    // Simulate instantaneous capture with a dummy canvas image
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.fillRect(0, 0, 300, 300);
      
      // Draw a dummy person silhouette
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.beginPath();
      ctx.arc(150, 120, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(150, 320, 120, Math.PI, 2 * Math.PI);
      ctx.fill();
      
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageUrl);
      
      if (onCapture) {
        onCapture(imageUrl);
      }
    }
  };

  // ✅ Stop Camera (No-op in mock)
  const stopCamera = useCallback(() => {
    // No streams to stop in mock mode
  }, []);

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // ✅ Capture Face (Handled inside startCamera in mock)
  const captureFace = () => {};


  // ✅ Retake
  const retake = () => {
    setCapturedImage(null);
    if (onCapture) onCapture(null);
    // Let user click "Start Face Scan" again
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Camera Error */}
      {!hasCamera && !capturedImage && (
        <div className="bg-red-50 text-red-600 p-4 w-full rounded-xl flex items-center mb-4">
          <XCircle className="w-5 h-5 mr-2" />
          Camera access denied. Please allow camera permission.
        </div>
      )}

      {/* Camera / Preview */}
      <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-2xl overflow-hidden border-4 border-[#1E3A8A]">

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <Camera className="w-16 h-16 mb-4" />
            <p>Ready for Face Scan</p>
          </div>
        )}

      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* ✅ FIXED BUTTON LOGIC */}
      <div className="mt-6 w-full max-w-sm">
        {!capturedImage ? (
          !isActive ? (
            <Button onClick={startCamera} className="w-full">
              Start Face Scan
            </Button>
          ) : (
            <Button onClick={captureFace} className="w-full bg-green-600">
              Capture Photo 📸
            </Button>
          )
        ) : (
          <Button onClick={retake} className="w-full">
            Retake Photo
          </Button>
        )}
      </div>

      {/* Success Message */}
      {capturedImage && (
        <div className="mt-4 text-green-600 font-semibold">
          Face Captured Successfully ✅
        </div>
      )}
    </div>
  );
};

export default FaceCapture;