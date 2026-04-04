import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVillages } from '../../utils/locationData';
import {
  User, MapPin, Calendar, FileText, Image, BadgeCheck,
  Heart, MessageCircle, Upload, X, ChevronLeft, Send, Loader2
} from 'lucide-react';
import { workProofService } from '../../services/api';
import toast from 'react-hot-toast';

const UploadBox = ({ label, preview, onChange, onClear }) => (
  <div className="flex-1 space-y-1.5">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    {preview ? (
      <div className="relative group rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
        <img src={preview} alt={label} className="w-full h-32 object-cover" />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#1E3A8A] hover:bg-blue-50/30 transition-all">
        <Upload className="w-5 h-5 text-slate-300 mb-1.5" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload {label}</span>
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
    )}
  </div>
);

const Toggle = ({ enabled, onToggle, label, icon: Icon, enabledText, disabledText, enabledColor }) => (
  <div
    onClick={onToggle}
    className="flex items-center justify-between px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-[#1E3A8A] transition-all"
  >
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${enabled ? enabledColor : 'text-slate-400'}`} />
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-bold ${enabled ? enabledColor : 'text-slate-400'}`}>
          {enabled ? enabledText : disabledText}
        </p>
      </div>
    </div>
    <div className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${enabled ? 'bg-[#1E3A8A]' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
    </div>
  </div>
);

const CreatePost = () => {
  const navigate = useNavigate();
  const officer = JSON.parse(localStorage.getItem('officer') || '{}');
  
  const [form, setForm] = useState({
    name: officer.fullName || '',
    area: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [afterFile, setAfterFile] = useState(null);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImg = (type) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === 'after') {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    } else {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!afterFile) e.after = 'Completion image required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      // Use the workProofService to anchor this update to the blockchain
      // Passing null as complaintId for general daily updates
      await workProofService.submitWorkProof(
        null, 
        form.description, 
        afterFile, 
        beforeFile
      );
      
      toast.success("Update published and secured on blockchain!");
      navigate('/governance/settings');
    } catch (err) {
      console.error('Publication failed:', err);
      toast.error("Failed to secure report on blockchain. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all ${
      errors[field] ? 'border-red-300 focus:border-red-400' : 'border-slate-100 focus:border-[#1E3A8A]'
    }`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/governance/settings')}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Blockchain Daily Update</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Publish verifiable village progress</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Village Officer</h3>
            </div>
            <div className="flex-1 space-y-2.5">
               <div className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>{officer.fullName}</span>
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
               </div>
               <div className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span>{officer.district}</span>
               </div>
               <div className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-300" />
                  <span>{form.date}</span>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Update Description</h3>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={6} placeholder="Securely describe current progress..."
              className={`${inputCls('description')} resize-none`} />
            {errors.description && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.description}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <Image className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Project Evidence (Immutable)</h3>
          </div>
          <div className="flex gap-4">
            <UploadBox label="Before (Optional)" preview={beforePreview}
              onChange={handleImg('before')}
              onClear={() => { setBeforeFile(null); setBeforePreview(null); }} />
            <UploadBox label="After (Completion) *" preview={afterPreview}
              onChange={handleImg('after')}
              onClear={() => { setAfterFile(null); setAfterPreview(null); }} />
          </div>
          {errors.after && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.after}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={() => navigate('/governance/settings')}
            className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="px-8 py-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-lg shadow-blue-100 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#1a3278] transition-all disabled:opacity-50">
            {submitting ? (
               <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Securing Evidence...</>
            ) : (
               <><Send className="w-3.5 h-3.5" /> Publish & Anchor</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
