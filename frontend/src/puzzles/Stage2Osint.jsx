import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { Compass, Key, ShieldCheck, AlertCircle, ArrowRight, MapPin, Eye, Skull } from 'lucide-react';

export const Stage2Osint = ({ onCustomSubmit }) => {
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
            <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '25s' }} />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 2: OSINT Geolocation Artifact"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "OSINT / Visual Intelligence"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#3e2414] leading-relaxed font-sans mt-3 font-semibold">
          {stageData?.description || "An encrypted photographic fragment was extracted from a suspect device. Identify the ancient Nasrid Dynasty palace-fortress (whose Arabic name literally translates to 'The Red One', situated on Sabika Hill in Granada, Andalusia at coordinates 37.1773° N, 3.5898° W) to trace the origin."}
        </p>
      </div>

      {/* Geolocation Graphic Fragment */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#8b5a2b] pb-3">
          <span className="text-xs font-bold text-[#3e2414] flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-[#8b5a2b]" />
            <span>HISTORIC REEF ARCHITECTURAL ARTIFACT:</span>
          </span>
          <span className="text-[10px] text-[#5c381e] font-mono font-bold">GPS: 37.1773° N, 3.5898° W</span>
        </div>

        {/* Fragment Image Box with Indirect Bracketed Clue */}
        <div className="bg-[#24150c] p-6 rounded-2xl border-2 border-[#8b5a2b] flex flex-col items-center justify-center min-h-[220px] text-center text-[#f4e8d3]">
          <div className="w-20 h-20 bg-[#3e2414] border-2 border-[#d4af37] rounded-full flex items-center justify-center text-yellow-300 mb-3 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Compass className="w-10 h-10 animate-bounce" />
          </div>
          <span className="text-yellow-300 font-extrabold text-sm block uppercase tracking-wider">
            NASRID DYNASTY PALACE-FORTRESS
          </span>
          <span className="text-[11px] text-[#d9c4a5] mt-1 font-sans italic">
            (Indirect Clue: The Arabic translation of this 8-letter landmark literally means "The Red One", located on Sabika Hill)
          </span>
        </div>
      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 2 Decryption Key Submission</span>
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
