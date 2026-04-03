import React, { useState } from 'react';
import { MapPin, Calendar, Heart, MessageCircle, User, Newspaper, BadgeCheck, ArrowLeftRight, Send, ChevronDown, ChevronUp } from 'lucide-react';

const RecentPosts = () => {
  const [posts, setPosts] = useState(() => JSON.parse(localStorage.getItem('pradhaanPosts') || '[]'));
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullName || 'Villager';

  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem('pradhaanPosts', JSON.stringify(updated));
  };

  const handleLike = (i) => {
    const updated = posts.map((p, idx) => {
      if (idx !== i) return p;
      const alreadyLiked = p._liked;
      return { ...p, likes: alreadyLiked ? p.likes - 1 : p.likes + 1, _liked: !alreadyLiked };
    });
    savePosts(updated);
  };

  const handleComment = (i) => {
    const text = (commentInputs[i] || '').trim();
    if (!text) return;
    const updated = posts.map((p, idx) => {
      if (idx !== i) return p;
      return { ...p, comments: [...(p.comments || []), { author: userName, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] };
    });
    savePosts(updated);
    setCommentInputs(p => ({ ...p, [i]: '' }));
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center shadow-inner">
          <Newspaper className="w-10 h-10 text-[#1E3A8A]" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">No Posts Yet</h2>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">The Pradhaan hasn't published any updates yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-lg shadow-blue-200">
          <Newspaper className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Recent Posts</h2>
          <p className="text-slate-400 text-xs font-semibold">{posts.length} update{posts.length !== 1 ? 's' : ''} from your Pradhaan</p>
        </div>
      </div>

      {posts.map((post, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">

          {/* Author Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border-2 border-white ring-2 ring-blue-100">
              {post.profilePic ? <img src={post.profilePic} alt={post.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-[#1E3A8A]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-slate-800 truncate">{post.name}</p>
                <BadgeCheck className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold"><MapPin className="w-3 h-3" />{post.area}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold"><Calendar className="w-3 h-3" />{post.date}</span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full border border-blue-100 flex-shrink-0">Pradhaan</span>
          </div>

          {/* Description */}
          <div className="px-5 pb-4">
            <p className="text-sm text-slate-600 leading-relaxed">{post.description}</p>
          </div>

          {/* Before & After */}
          {(post.beforeImage || post.afterImage) && (
            <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-100">
              {post.beforeImage && post.afterImage ? (
                <div className="flex h-52">
                  <div className="flex-1 relative">
                    <img src={post.beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase tracking-widest bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">Before</span>
                  </div>
                  <div className="w-px bg-white/60 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center -mx-3.5">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <img src={post.afterImage} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">After</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-52">
                  <img src={post.beforeImage || post.afterImage} alt="Post" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase tracking-widest bg-black/50 text-white px-2.5 py-1 rounded-full">{post.beforeImage ? 'Before' : 'After'}</span>
                </div>
              )}
            </div>
          )}

          {/* Engagement Bar */}
          {(post.likes !== null || post.comments !== null) && (
            <div className="border-t border-slate-100">
              {/* Like / Comment counts row */}
              {(post.likes !== null || post.comments !== null) && (
                <div className="flex items-center gap-3 px-5 py-2.5 text-[11px] text-slate-400 font-semibold border-b border-slate-50">
                  {post.likes !== null && <span>{post.likes} like{post.likes !== 1 ? 's' : ''}</span>}
                  {post.likes !== null && post.comments !== null && <span>·</span>}
                  {post.comments !== null && (
                    <button onClick={() => setOpenComments(p => ({ ...p, [i]: !p[i] }))} className="hover:text-[#1E3A8A] transition-colors flex items-center gap-1">
                      {(post.comments || []).length} comment{(post.comments || []).length !== 1 ? 's' : ''}
                      {openComments[i] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-1 px-5 py-3 bg-slate-50/50">
                {post.likes !== null && (
                  <button
                    onClick={() => handleLike(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${post._liked ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-red-200 hover:text-red-400'
                      }`}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-all ${post._liked ? 'fill-red-500 scale-110' : ''}`} />
                    {post._liked ? 'Liked' : 'Like'}
                  </button>
                )}
                {post.comments !== null && (
                  <button
                    onClick={() => setOpenComments(p => ({ ...p, [i]: !p[i] }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:border-blue-200 hover:text-blue-500 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Comment
                  </button>
                )}
              </div>

              {/* Comments Section */}
              {post.comments !== null && openComments[i] && (
                <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-3">
                  {(post.comments || []).length === 0 && (
                    <p className="text-xs text-slate-400 font-medium">No comments yet. Be the first!</p>
                  )}
                  {(post.comments || []).map((c, ci) => (
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
                  ))}

                  {/* Comment Input */}
                  <div className="flex gap-2 pt-1">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        value={commentInputs[i] || ''}
                        onChange={e => setCommentInputs(p => ({ ...p, [i]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleComment(i)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-[#1E3A8A] transition-colors"
                      />
                      <button
                        onClick={() => handleComment(i)}
                        disabled={!(commentInputs[i] || '').trim()}
                        className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1a3278] transition-all flex-shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
