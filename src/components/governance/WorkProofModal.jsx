import React, { useState } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Search,
  Image as ImageIcon,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import { workProofService } from '../../services/api';
import Loader from '../../components/Loader';

const WorkProofModal = ({ complaint, onClose, onRefresh }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !description) return;

    setIsSubmitting(true);
    try {
      await workProofService.submitWorkProof(complaint.id, description, image);
      setSuccess(true);
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit work proof to blockchain");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-[#1E3A8A] rounded-xl text-white shadow-lg shadow-blue-100">
                <Shield className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Submit Immutable Proof of Work</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complaint #{complaint.id} · Fingerprinted on Algorand</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-12 space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">Proof Anchored Successfully</h4>
              <p className="text-slate-500 font-medium">The resolution evidence has been hashed and secured on the blockchain ledger.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resolution Summary</label>
                <textarea
                  required
                  placeholder="Describe the physical work completed and materials used..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-200 focus:bg-white transition-all text-sm font-bold text-slate-700 min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proof Documentation (Image Only)</label>
                <div className={`relative border-2 border-dashed rounded-3xl transition-all ${preview ? 'border-blue-200' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}>
                  {preview ? (
                    <div className="relative p-2">
                      <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
                      <button 
                        type="button"
                        onClick={() => {setPreview(null); setImage(null);}}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg text-red-500 hover:scale-110 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-12 px-6 cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-slate-300" />
                      </div>
                      <span className="text-sm font-black text-slate-800 tracking-tight uppercase">Select Site Image</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-center">JPG, PNG or WEBP · Full metadata hashing will be applied</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
                    </label>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Lock className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="text-xs font-black text-indigo-700 uppercase tracking-tighter">Blockchain Protocol Notice</p>
                  <p className="text-[10px] font-bold text-indigo-500/80 leading-relaxed max-w-md">By submitting, you generate a permanent SHA-256 fingerprint of this image. This proof is anchored on the decentralized ledger and cannot be replaced or deleted by any administrator.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !image || !description}
                  className="flex-[2] bg-[#1E3A8A] text-white py-4 rounded-2xl shadow-xl shadow-blue-100 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-[#1a3278] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader variant="white" size="small" /> Processing Data...</>
                  ) : (
                    <><Shield className="w-4 h-4" /> Secure Proof to Blockchain</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkProofModal;
