import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVillages } from '../../utils/locationData';
import {
  User, MapPin, Calendar, FileText, Image,
  Heart, MessageCircle, Upload, X, ChevronLeft, Send
} from 'lucide-react';

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
    name: officer.fullName || '', area: '', date: new Date().toISOString().split('T')[0], description: '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [likesEnabled, setLikesEnabled] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImg = (setter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.area.trim()) e.area = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: form.name, profilePic: profilePicPreview || '',
      area: form.area, date: form.date, description: form.description,
      media: [], beforeImage: beforePreview || '', afterImage: afterPreview || '',
      likes: likesEnabled ? 0 : null, comments: commentsEnabled ? [] : null,
    };
    console.log('Post Payload:', payload);
    const existing = JSON.parse(localStorage.getItem('pradhaanPosts') || '[]');
    localStorage.setItem('pradhaanPosts', JSON.stringify([payload, ...existing]));
    navigate('/governance/settings');
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
          <h1 className="text-2xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">Create New Post</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Publish a Pradhaan update for citizens</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile + Description — side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Pradhaan Profile */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Pradhaan Profile</h3>
            </div>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-[#1E3A8A] transition-all">
                  {profilePicPreview
                    ? <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                    : <User className="w-7 h-7 text-slate-300" />}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImg(setProfilePicPreview)} />
              </label>
              <div className="flex-1 space-y-2.5">
                <div>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Pradhaan Name *" className={inputCls('name')} />
                  {errors.name && <p className="text-red-500 text-[10px] font-bold mt-0.5 ml-1">{errors.name}</p>}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select name="area" value={form.area} onChange={handleChange}
                    className={`${inputCls('area')} pl-8 appearance-none`}>
                    <option value="">Select Village *</option>
                    {getVillages('Uttar Pradesh', 'Ghaziabad').map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  {errors.area && <p className="text-red-500 text-[10px] font-bold mt-0.5 ml-1">{errors.area}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className={`${inputCls('date')} pl-8`} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Description</h3>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={6} placeholder="Describe the problem and solution..."
              className={`${inputCls('description')} resize-none`} />
            {errors.description && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.description}</p>}
          </div>
        </div>

        {/* Before & After */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <Image className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Before & After</h3>
          </div>
          <div className="flex gap-4">
            <UploadBox label="Before" preview={beforePreview}
              onChange={handleImg(setBeforePreview)}
              onClear={() => setBeforePreview(null)} />
            <UploadBox label="After" preview={afterPreview}
              onChange={handleImg(setAfterPreview)}
              onClear={() => setAfterPreview(null)} />
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Engagement</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Toggle enabled={likesEnabled} onToggle={() => setLikesEnabled(p => !p)}
              label="Likes" icon={Heart} enabledText="Likes Enabled"
              disabledText="Likes Disabled" enabledColor="text-red-500" />
            <Toggle enabled={commentsEnabled} onToggle={() => setCommentsEnabled(p => !p)}
              label="Comments" icon={MessageCircle} enabledText="Comments Enabled"
              disabledText="Comments Disabled" enabledColor="text-blue-600" />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={() => navigate('/governance/settings')}
            className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button type="submit"
            className="px-8 py-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-lg shadow-blue-100 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#1a3278] transition-all">
            <Send className="w-3.5 h-3.5" /> Publish Post
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreatePost;
