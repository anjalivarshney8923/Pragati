import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Calendar, Heart, MessageCircle, ArrowLeftRight, FileText, Plus, BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem('pradhaanPosts') || '[]'));
  const [openComments, setOpenComments] = useState({});

  // Refresh posts when page gains focus so live counts from dashboard are reflected
  React.useEffect(() => {
    const refresh = () => setPosts(JSON.parse(localStorage.getItem('pradhaanPosts') || '[]'));
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/governance/settings')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] uppercase tracking-tighter">My Posts</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{posts.length} post{posts.length !== 1 ? 's' : ''} published</p>
          </div>
        </div>
        <button onClick={() => navigate('/governance/posts/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-lg shadow-blue-100 font-black uppercase tracking-widest text-[10px] hover:bg-[#1a3278] transition-all">
          <Plus className="w-3.5 h-3.5" /> New Post
        </button>
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
            <FileText className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h2 className="text-lg font-bold text-slate-700">No Posts Yet</h2>
          <p className="text-slate-400 text-sm max-w-xs">Click "New Post" to publish your first update.</p>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {posts.map((post, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">

            {/* Author Header */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white ring-2 ring-blue-100 shadow-sm">
                {post.profilePic
                  ? <img src={post.profilePic} alt={post.name} className="w-full h-full object-cover" />
                  : <User className="w-5 h-5 text-[#1E3A8A]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-extrabold text-slate-800 truncate">{post.name}</p>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#1E3A8A] flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                    <MapPin className="w-2.5 h-2.5" />{post.area}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                    <Calendar className="w-2.5 h-2.5" />{post.date}
                  </span>
                </div>
              </div>
              {/* Post number badge */}
              <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full flex-shrink-0">
                #{posts.length - i}
              </span>
            </div>

            {/* Description */}
            <div className="px-5 pb-3">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{post.description}</p>
            </div>

            {/* Before & After */}
            {(post.beforeImage || post.afterImage) && (
              <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-slate-100">
                {post.beforeImage && post.afterImage ? (
                  <div className="flex h-40">
                    <div className="flex-1 relative">
                      <img src={post.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest bg-black/60 text-white px-2 py-0.5 rounded-full">Before</span>
                    </div>
                    <div className="w-px bg-white/60 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center -mx-3">
                        <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <img src={post.afterImage} alt="After" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2 py-0.5 rounded-full">After</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-40">
                    <img src={post.beforeImage || post.afterImage} alt="Post" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest bg-black/50 text-white px-2 py-0.5 rounded-full">
                      {post.beforeImage ? 'Before' : 'After'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Stats Bar */}
            <div className="border-t border-slate-100">
              <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/60">
                {/* Likes stat */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${post.likes !== null ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                  <Heart className={`w-3.5 h-3.5 ${post.likes !== null ? 'fill-red-400' : ''}`} />
                  {post.likes !== null
                    ? <span>{post.likes} Likes <span className="font-normal text-red-400">· Enabled</span></span>
                    : <span>Likes Disabled</span>}
                </div>

                {/* Comments stat — clickable if enabled */}
                {post.comments !== null ? (
                  <button
                    onClick={() => setOpenComments(p => ({ ...p, [i]: !p[i] }))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {(post.comments || []).length} Comments
                    <span className="font-normal text-blue-400">· Enabled</span>
                    {openComments[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Comments Disabled
                  </div>
                )}
              </div>

              {/* Comments List */}
              {post.comments !== null && openComments[i] && (
                <div className="px-5 pb-4 pt-3 space-y-2.5 border-t border-slate-100">
                  {(post.comments || []).length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium">No comments yet from villagers.</p>
                  ) : (
                    (post.comments || []).map((c, ci) => (
                      <div key={ci} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-black text-slate-700">{c.author}</span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-xs text-slate-600">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
