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
          
          {/* Artifact 1: Human Figure Casting Ground Shadow (SHADOW) */}
          <div className="bg-[#24150c] border-2 border-[#8b5a2b] rounded-2xl p-4 text-center w-full max-w-[210px] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center min-h-[170px]">
            <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sun Light Source */}
              <circle cx="25" cy="25" r="10" fill="#ffd700" opacity="0.9" />
              <line x1="25" y1="8" x2="25" y2="12" stroke="#ffd700" strokeWidth="2" />
              <line x1="25" y1="38" x2="25" y2="42" stroke="#ffd700" strokeWidth="2" />
              <line x1="8" y1="25" x2="12" y2="25" stroke="#ffd700" strokeWidth="2" />
              <line x1="38" y1="25" x2="42" y2="25" stroke="#ffd700" strokeWidth="2" />

              {/* Ground Line */}
              <line x1="10" y1="75" x2="90" y2="75" stroke="#8b5a2b" strokeWidth="2" />

              {/* Human Figure (Lit Silhouette) */}
              <circle cx="45" cy="42" r="6" fill="#ffd700" />
              <path d="M 45 48 L 45 62 M 45 52 L 38 58 M 45 52 L 52 58 M 45 62 L 40 75 M 45 62 L 50 75" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />

              {/* Cast Shadow on Ground */}
              <ellipse cx="68" cy="77" rx="18" ry="4" fill="#000000" opacity="0.85" />
              <path d="M 50 75 L 82 77" stroke="#000000" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-[#3e2414] p-2 bg-[#dfc9ab] rounded-full border-2 border-[#8b5a2b]">
            <Plus className="w-6 h-6" />
          </div>

          {/* Artifact 2: Physical Woven Net Mesh (NET) */}
          <div className="bg-[#24150c] border-2 border-[#8b5a2b] rounded-2xl p-4 text-center w-full max-w-[210px] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex flex-col items-center justify-center min-h-[170px]">
            <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Woven Net Mesh Grid Lines */}
              <line x1="20" y1="20" x2="80" y2="20" stroke="#ffd700" strokeWidth="2" />
              <line x1="20" y1="35" x2="80" y2="35" stroke="#ffd700" strokeWidth="2" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="#ffd700" strokeWidth="2" />
              <line x1="20" y1="65" x2="80" y2="65" stroke="#ffd700" strokeWidth="2" />
              <line x1="20" y1="80" x2="80" y2="80" stroke="#ffd700" strokeWidth="2" />
              
              <line x1="20" y1="20" x2="20" y2="80" stroke="#ffd700" strokeWidth="2" />
              <line x1="35" y1="20" x2="35" y2="80" stroke="#ffd700" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="#ffd700" strokeWidth="2" />
              <line x1="65" y1="20" x2="65" y2="80" stroke="#ffd700" strokeWidth="2" />
              <line x1="80" y1="20" x2="80" y2="80" stroke="#ffd700" strokeWidth="2" />

              {/* Net Knots */}
              <circle cx="20" cy="20" r="2.5" fill="#d4af37" />
              <circle cx="35" cy="20" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="20" r="2.5" fill="#d4af37" />
              <circle cx="65" cy="20" r="2.5" fill="#d4af37" />
              <circle cx="80" cy="20" r="2.5" fill="#d4af37" />

              <circle cx="20" cy="35" r="2.5" fill="#d4af37" />
              <circle cx="35" cy="35" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="35" r="2.5" fill="#d4af37" />
              <circle cx="65" cy="35" r="2.5" fill="#d4af37" />
              <circle cx="80" cy="35" r="2.5" fill="#d4af37" />

              <circle cx="20" cy="50" r="2.5" fill="#d4af37" />
              <circle cx="35" cy="50" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="50" r="2.5" fill="#d4af37" />
              <circle cx="65" cy="50" r="2.5" fill="#d4af37" />
              <circle cx="80" cy="50" r="2.5" fill="#d4af37" />

              <circle cx="20" cy="65" r="2.5" fill="#d4af37" />
              <circle cx="35" cy="65" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="65" r="2.5" fill="#d4af37" />
              <circle cx="65" cy="65" r="2.5" fill="#d4af37" />
              <circle cx="80" cy="65" r="2.5" fill="#d4af37" />

              <circle cx="20" cy="80" r="2.5" fill="#d4af37" />
              <circle cx="35" cy="80" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="80" r="2.5" fill="#d4af37" />
              <circle cx="65" cy="80" r="2.5" fill="#d4af37" />
              <circle cx="80" cy="80" r="2.5" fill="#d4af37" />
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
