import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Heart, MessageCircle, User, Newspaper, 
  BadgeCheck, ArrowLeftRight, Send, ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { workProofService } from '../../services/api';
import Loader from '../../components/Loader';

const RecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullName || 'Villager';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await workProofService.getAllWorkProofs();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch recent posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = (i) => {
    // Current backend doesn't support persistent comments on work proofs yet
    // This maintains the UI interaction without crashing
    const text = (commentInputs[i] || '').trim();
    if (!text) return;
    setCommentInputs(p => ({ ...p, [i]: '' }));
    alert("Comments on blockchain-secured posts are currently read-only.");
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader text="Loading recent updates..." /></div>;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center shadow-inner">
          <Newspaper className="w-10 h-10 text-[#1E3A8A]" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">No Citizen Updates Yet</h2>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">The Gram Pradhaan hasn't published any blockchain-secured progress reports yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-lg shadow-blue-200">
          <Newspaper className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Recent Progress</h2>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{posts.length} blockchain-secured update{posts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {posts.map((post, i) => (
        <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">

          {/* Author Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border-2 border-white ring-2 ring-blue-100">
              <User className="w-6 h-6 text-[#1E3A8A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-slate-800 truncate">Village Officer</p>
                <BadgeCheck className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                   <MapPin className="w-3 h-3" /> Village Progress
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-widest">
                   <Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full border border-blue-100 flex-shrink-0">Secured</span>
          </div>

          {/* Description */}
          <div className="px-5 pb-4">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{post.description}</p>
          </div>

          {/* Before & After Comparison */}
          <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative group">
            {post.beforeImageUrl ? (
              <div className="flex h-56">
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={`http://localhost:8080${post.beforeImageUrl}`} 
                    alt="Before" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                  <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-black/60 text-white px-2.5 py-1 rounded-lg">Before Restoration</span>
                </div>
                <div className="w-1 bg-white/80 z-10 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white shadow-xl flex items-center justify-center -mx-3.5 border border-slate-100">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={`http://localhost:8080${post.imageUrl}`} 
                    alt="After" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                  <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2.5 py-1 rounded-lg">Resolution Proof</span>
                </div>
              </div>
            ) : (
              <div className="relative h-56 overflow-hidden">
                 <img 
                  src={`http://localhost:8080${post.imageUrl}`} 
                  alt="Work Proof" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2.5 py-1 rounded-lg">Official Resolution</span>
              </div>
            )}
          </div>

          {/* Engagement Bar */}
          <div className="border-t border-slate-100">
            <div className="flex items-center gap-1 px-5 py-3 bg-slate-50/50">
                <div className="flex items-center gap-2 px-4 py-2 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm">
                  <Heart className="w-3.5 h-3.5" /> Community Support
                </div>
                <button
                  onClick={() => setOpenComments(p => ({ ...p, [post.id]: !p[post.id] }))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:border-blue-200 hover:text-blue-500 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Feedback
                  {openComments[post.id] ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </button>
            </div>

            {/* Comments Section */}
            {openComments[post.id] && (
              <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-3 animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-slate-400 font-medium italic">Comments are currently read-only for blockchain posts.</p>
                
                {/* Comment Input */}
                <div className="flex gap-2 pt-1 opacity-50">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      disabled
                      placeholder="Feedback disabled for audit trail..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none cursor-not-allowed"
                    />
                    <button
                      disabled
                      className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center opacity-40 flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="px-5 py-2 bg-blue-50/30 border-t border-blue-50/50 flex justify-end">
               <span className="text-[9px] font-bold text-blue-300 uppercase tracking-[0.1em]">Blockchain ID: {post.blockchainTxnId?.substring(0, 12)}...</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;

