import React, { useEffect, useRef, useState } from 'react';

const CameraCapture = ({ mode = 'photo', onClose, onCapture, maxRecordingTime = 15000 }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const start = async () => {
      setError('');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Media devices are not supported in this browser.');
        return;
      }
      try {
        const constraints = { video: { facingMode: 'environment' }, audio: mode === 'video' };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // try to autoplay the video; playsInline + muted helps on mobile browsers
          try {
            await videoRef.current.play();
          } catch (playErr) {
            // ignore play errors, user can still see preview after interaction
            console.warn('Video play failed:', playErr);
          }
        }
      } catch (err) {
        console.error('Camera error', err);
        setError('Unable to access camera. Please allow camera permissions and try again.');
      }
    };
    start();

    return () => {
      // stop tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [mode]);

  const takePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    const file = new File([blob], `capture_${Date.now()}.jpg`, { type: blob.type });
    onCapture && onCapture(file);
    onClose && onClose();
  };

  const startRecording = () => {
    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (typeof MediaRecorder === 'undefined') {
      // No MediaRecorder support — fallback
      setError('Recording is not supported in this browser.');
      if (onFallback) onFallback('video');
      onClose && onClose();
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `capture_${Date.now()}.webm`, { type: blob.type });
        onCapture && onCapture(file);
        onClose && onClose();
      };
  mediaRecorder.start();
      setRecording(true);

      // safety stop
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, maxRecordingTime);
    } catch (err) {
      console.error('Recording start failed', err);
      setError('Recording not supported on this device/browser.');
      if (onFallback) onFallback('video');
      onClose && onClose();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => { onClose && onClose(); }} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <strong>{mode === 'photo' ? 'Capture Photo' : 'Record Video'}</strong>
            <button type="button" onClick={() => onClose && onClose()} className="text-sm text-slate-600">Close</button>
          </div>
        </div>
        <div className="bg-black flex items-center justify-center" style={{ height: 360 }}>
          {error ? (
            <div className="text-white p-4">{error}</div>
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
          )}
        </div>
        <div className="p-3 flex items-center justify-center gap-3">
          {mode === 'photo' ? (
            <button type="button" onClick={takePhoto} className="px-4 py-2 bg-gov-blue text-white rounded-md">Take Photo</button>
          ) : (
            <>
              {!recording ? (
                <button type="button" onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded-md">Start Recording</button>
              ) : (
                <button type="button" onClick={stopRecording} className="px-4 py-2 bg-gray-600 text-white rounded-md">Stop Recording</button>
              )}
            </>
          )}
        </div>
        {error && (
          <div className="p-3 border-t text-sm text-center">
            <div className="text-red-600 mb-2">{error}</div>
            <div>
              <button type="button" onClick={() => { if (onFallback) onFallback(mode); onClose && onClose(); }} className="px-3 py-2 bg-slate-100 rounded-md">Open device camera / picker</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
