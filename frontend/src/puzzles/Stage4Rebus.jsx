import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { Puzzle, Key, ShieldCheck, AlertCircle, ArrowRight, HelpCircle, Plus, Equal } from 'lucide-react';

export const Stage4Rebus = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setLoading(true);
    setFeedback(null);
    const submitFn = onCustomSubmit || submitKey;
    const res = await submitFn(keyInput.trim());
    setLoading(false);

    if (res.correct) {
      setFeedback({ type: 'success', text: res.message });
      setKeyInput('');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 font-serif">
      
      {/* Live Stage Timer (Starts from 00:00, Stops when Answered) */}
      <StageTimer
        stageStartTime={stageData?.stage_start_time}
        isStopped={feedback?.type === 'success'}
      />
      
      {/* Island Header - Light Coffee Parchment Theme */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl text-[#23140c]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-[#3e2414] border-2 border-[#d4af37] rounded-2xl text-yellow-300 shadow-md">
            <Puzzle className="w-7 h-7 animate-pulse text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 4: Visual Vector Rebus Cipher"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Lateral Visual Intelligence & Symbol Cipher"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#3e2414] leading-relaxed font-sans mt-3 font-semibold">
          {stageData?.description || "The security terminal generated two abstract visual vector artifacts. Deduce the lateral concept of each graphic artifact to form the 9-letter encrypted network term."}
        </p>
      </div>

      {/* Visual Vector Rebus Matrix Interface */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-xs text-[#3e2414] uppercase tracking-widest mb-6 text-center font-extrabold">
          ABSTRACT VECTOR CIPHER MATRIX [ARTIFACT_01 + ARTIFACT_02]
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-4">
          
          {/* Artifact 1: Dark Optical Eclipse Silhouette (SHADOW) */}
          <div className="bg-[#24150c] border-2 border-[#8b5a2b] rounded-2xl p-4 text-center w-full max-w-[210px] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center min-h-[170px]">
            <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="38" fill="#140c08" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="45" cy="45" r="32" fill="#3e2414" />
              <path d="M 20 60 Q 50 20 80 60" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.7" />
              <circle cx="58" cy="52" r="28" fill="#000000" />
              <circle cx="58" cy="52" r="29" stroke="#d4af37" strokeWidth="1" fill="none" opacity="0.8" />
            </svg>
          </div>

          <div className="text-[#3e2414] p-2 bg-[#dfc9ab] rounded-full border-2 border-[#8b5a2b]">
            <Plus className="w-6 h-6" />
          </div>

          {/* Artifact 2: Mesh Topology Graph (NET) */}
          <div className="bg-[#24150c] border-2 border-[#8b5a2b] rounded-2xl p-4 text-center w-full max-w-[210px] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center min-h-[170px]">
            <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="30" x2="50" y2="15" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="50" y1="15" x2="80" y2="30" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="80" y1="30" x2="80" y2="70" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="50" y2="85" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="50" y1="85" x2="20" y2="70" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="20" y1="70" x2="20" y2="30" stroke="#ffd700" strokeWidth="1.5" />
              <line x1="20" y1="30" x2="50" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="80" y1="30" x2="50" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="80" y1="70" x2="50" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="20" y1="70" x2="50" y2="50" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="20" cy="30" r="4" fill="#ffd700" />
              <circle cx="50" cy="15" r="4" fill="#ffd700" />
              <circle cx="80" cy="30" r="4" fill="#ffd700" />
              <circle cx="80" cy="70" r="4" fill="#ffd700" />
              <circle cx="50" cy="85" r="4" fill="#ffd700" />
              <circle cx="20" cy="70" r="4" fill="#ffd700" />
              <circle cx="50" cy="50" r="6" fill="#d4af37" stroke="#ffd700" strokeWidth="2" />
            </svg>
          </div>

          <div className="text-[#3e2414] p-2 bg-[#dfc9ab] rounded-full border-2 border-[#8b5a2b]">
            <Equal className="w-6 h-6" />
          </div>

          {/* Solution Placeholder */}
          <div className="bg-[#24150c] border-2 border-[#8b5a2b] border-dashed rounded-2xl p-6 text-center w-full max-w-[210px] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center min-h-[170px]">
            <HelpCircle className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>

        </div>
      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 4 Decryption Key Submission</span>
        </h3>

        {feedback && (
          <div className={`p-4 rounded-xl text-xs mb-4 flex items-center space-x-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold'
              : 'bg-red-950/90 border-red-500 text-red-300 font-bold'
          }`}>
            {feedback.type === 'success' ? (
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder=""
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="flex-1 bg-black border-2 border-[#8b5a2b] rounded-xl px-4 py-3 text-sm text-yellow-300 focus:outline-none focus:border-yellow-400 uppercase tracking-widest font-mono font-bold shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !keyInput.trim()}
            className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] hover:from-yellow-400 hover:to-[#d4af37] text-[#140c08] font-black text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 font-mono uppercase tracking-wider"
          >
            <span>{loading ? 'VERIFYING...' : 'SUBMIT PASSPHRASE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
