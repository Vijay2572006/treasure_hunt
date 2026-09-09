import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { ShieldCheck, Key, AlertCircle, ArrowRight, Award, Flashlight, Skull, HelpCircle, Lightbulb } from 'lucide-react';

export const Stage7Master = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Full Screen Flashlight Container Ref
  const fullScreenRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -300, y: -300 });
  const [isInside, setIsInside] = useState(false);

  // 11 Hidden Minimal Master Passphrase Letters for "SINGULARITY"
  const masterLetters = [
    { char: 'S', x: 14, y: 18 },
    { char: 'I', x: 84, y: 16 },
    { char: 'N', x: 48, y: 22 },
    { char: 'G', x: 22, y: 46 },
    { char: 'U', x: 52, y: 50 },
    { char: 'L', x: 78, y: 44 },
    { char: 'A', x: 16, y: 74 },
    { char: 'R', x: 44, y: 78 },
    { char: 'I', x: 68, y: 72 },
    { char: 'T', x: 86, y: 80 },
    { char: 'Y', x: 34, y: 28 }
  ];

  const handleMouseMove = (e) => {
    if (!fullScreenRef.current) return;
    const rect = fullScreenRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

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
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl text-[#23140c] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#3e2414] border-2 border-[#d4af37] rounded-2xl text-yellow-300 shadow-md">
            <Skull className="w-7 h-7 animate-pulse text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 7: THE TREASURE POINT 🪙"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Master Passphrase Assembly"}
            </span>
          </div>
        </div>

        {/* QUESTION BOX */}
        <div className="bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
          <div className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>PUZZLE QUESTION:</span>
          </div>
          <p className="text-sm font-sans font-bold leading-relaxed text-[#f4e8d3]">
            What is the 11-letter scientific term for the ultimate point of technological evolution where artificial intelligence surpasses human control?
          </p>
        </div>

        {/* TIP BOX */}
        <div className="bg-[#3e2414]/20 p-4 rounded-2xl border border-[#8b5a2b] text-[#3e2414]">
          <div className="text-xs font-mono font-bold text-[#8b5a2b] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-[#8b5a2b]" />
            <span>INTERACTIVE TIP:</span>
          </div>
          <p className="text-xs font-sans font-semibold leading-relaxed text-[#23140c]">
            The final Treasure Point is engulfed in pitch darkness. Move your flashlight beam across the dark screen to discover the hidden minimal letters, then submit the master passphrase to claim the ultimate treasure!
          </p>
        </div>
      </div>

      {/* Pitch-Black Full Dark Screen Exploration Chamber */}
      <div
        ref={fullScreenRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsInside(true)}
        onMouseLeave={() => { setIsInside(false); setCursorPos({ x: -300, y: -300 }); }}
        className="relative w-full h-[520px] bg-black rounded-3xl border-4 border-[#8b5a2b] overflow-hidden cursor-crosshair select-none font-mono shadow-2xl"
      >
        
        {/* Full Screen Flashlight Spotlight Radial Overlay Mask */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            background: isInside
              ? `radial-gradient(circle 100px at ${cursorPos.x}px ${cursorPos.y}px, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0.985) 100%)`
              : 'rgba(0, 0, 0, 0.99)'
          }}
        />

        {/* Subtle Grid Pattern in Darkness */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Guidance Banner inside darkness when idle */}
        {!isInside && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#d9c4a5] font-mono text-xs pointer-events-none z-40 p-4 text-center">
            <Flashlight className="w-8 h-8 text-yellow-300 animate-bounce mb-2" />
            <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider mb-1">
              ISLAND 7: DARK SCREEN CHAMBER
            </span>
            <span>MOVE YOUR CURSOR INSIDE THIS DARK SCREEN TO BEAM YOUR FLASHLIGHT SPOTLIGHT</span>
          </div>
        )}

        {/* 11 Hidden Minimal Tiny Master Letters Scattered Across Dark Screen (No Position Labels) */}
        <div className="absolute inset-0">
          {masterLetters.map((item, idx) => {
            let isIlluminated = false;
            if (fullScreenRef.current && isInside) {
              const rect = fullScreenRef.current.getBoundingClientRect();
              const nodeX = (item.x / 100) * rect.width;
              const nodeY = (item.y / 100) * rect.height;
              const dist = Math.hypot(cursorPos.x - nodeX, cursorPos.y - nodeY);
              isIlluminated = dist < 100;
            }

            return (
              <div
                key={idx}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-20 ${
                  isIlluminated ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {/* Minimal Tiny Letter Node */}
                <div className="w-6 h-6 bg-[#d4af37] text-[#140c08] border border-yellow-300 rounded flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(212,175,55,0.9)]">
                  {item.char}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#8b5a2b] animate-pulse" />
          <span>Final Master Decryption Passphrase Submission</span>
        </h3>

        {feedback && (
          <div className={`p-4 rounded-xl text-xs mb-4 flex items-center space-x-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 font-bold text-sm'
              : 'bg-red-950/80 border-red-500 text-red-300 font-bold'
          }`}>
            {feedback.type === 'success' ? (
              <ShieldCheck className="w-6 h-6 flex-shrink-0 text-emerald-400" />
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
            className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] hover:from-yellow-400 hover:to-[#d4af37] text-[#140c08] font-black text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(212,175,55,0.5)] disabled:opacity-50 uppercase tracking-wider font-mono"
          >
            <span>{loading ? 'UNLOCKING...' : 'MASTER UNLOCK'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};
