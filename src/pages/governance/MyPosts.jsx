import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, MapPin, Calendar, Heart, MessageCircle, 
  ArrowLeftRight, FileText, Plus, BadgeCheck, ChevronDown, ChevronUp,
  ExternalLink, ShieldCheck, AlertTriangle, Loader2, Lock, Shield
} from 'lucide-react';
import { workProofService } from '../../services/api';
import Loader from '../../components/Loader';

const MyPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openComments, setOpenComments] = useState({});


  const officer = JSON.parse(localStorage.getItem('officer') || '{}');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await workProofService.getAllWorkProofs();
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch proof of work posts");
    } finally {
      setLoading(false);
    }
  };


  if (loading && posts.length === 0) return <div className="p-20 flex justify-center"><Loader text="Loading work proofs..." /></div>;

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
      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map((post, i) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">

            {/* Author Header */}
            <div className="flex items-center gap-3 px-5 pt-4 pb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white ring-2 ring-blue-100 shadow-sm">
                <User className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-extrabold text-slate-800 truncate">{officer.fullName}</p>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#1E3A8A] flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                    <MapPin className="w-2.5 h-2.5" /> {officer.district || 'Village'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                    <Calendar className="w-2.5 h-2.5" /> {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full flex-shrink-0 border border-slate-200">
                PROOFS #{post.id}
              </span>
            </div>

            {/* Description */}
            <div className="px-5 pb-3">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-black/60 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">Before</span>
                  </div>
                  <div className="w-1 bg-white/80 z-10 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white shadow-xl flex items-center justify-center -mx-3 border border-slate-100">
                      <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <img 
                      src={`http://localhost:8080${post.imageUrl}`} 
                      alt="After" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">After</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-56 overflow-hidden">
                   <img 
                    src={`http://localhost:8080${post.imageUrl}`} 
                    alt="Work Proof" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest bg-[#138808]/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">Resolution Proof</span>
                </div>
              )}
              
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-emerald-400">
                  <BadgeCheck className="w-3 h-3" /> Resolved
                </div>
              </div>
            </div>

            {/* Post Metadata Footer */}
            <div className="px-5 pb-4 pt-1 flex items-center justify-between border-t border-slate-50 mt-2">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-400 group cursor-pointer hover:text-red-500 transition-colors">
                     <Heart className="w-4 h-4" />
                     <span className="text-[10px] font-bold">Community Support</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 cursor-pointer hover:text-blue-500 transition-colors">
                     <MessageCircle className="w-4 h-4" />
                     <span className="text-[10px] font-bold">Feedback</span>
                  </div>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
