import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { ShieldCheck, Key, AlertCircle, ArrowRight, FileText, Clock, Hash, RotateCcw, Shuffle } from 'lucide-react';

export const Stage6Social = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // 7-Letter Anagram Token: "IGNEXIA"
  const initialLetters = ['G', 'I', 'N', 'E', 'X', 'I', 'A'];
  const [userLetters, setUserLetters] = useState([]);

  const handleAddLetter = (letter, idx) => {
    setUserLetters(prev => [...prev, { letter, idx }]);
  };

  const handleRemoveLetter = (removeIndex) => {
    setUserLetters(prev => prev.filter((_, i) => i !== removeIndex));
  };

  const handleResetLetters = () => {
    setUserLetters([]);
  };

  const handleFillInput = () => {
    const word = userLetters.map(item => item.letter).join('');
    setKeyInput(word);
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
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl text-[#23140c]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-[#3e2414] border-2 border-[#d4af37] rounded-2xl text-yellow-300 shadow-md">
            <FileText className="w-7 h-7 animate-pulse text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 6: Event Cipher & Anagram Forensics"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Event Identity & Anagram Cipher"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#3e2414] leading-relaxed font-sans mt-3 font-semibold">
          {stageData?.description || "An intercepted server audit log contains 3 node log streams with scrambled letter tokens: [G-I], [N-E-X], and [I-A]. Unscramble all 7 letters to recover the grand inter-college digital treasure hunt event title."}
        </p>
      </div>

      {/* Audit Log Stream & Interactive Anagram Solver Wheel */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c] space-y-6">
        
        {/* Server Audit Log View */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3] text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#8b5a2b] mb-3 text-[#d9c4a5]">
            <span className="flex items-center space-x-1.5 text-yellow-300 font-bold">
              <Hash className="w-4 h-4 text-amber-400" />
              <span>SERVER_MULTI_NODE_AUDIT.LOG</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold">3 FRAGMENTED NODE STREAMS</span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="text-[#d9c4a5]">[04:42:10 AM] NODE_ALPHA_01: "STREAM_A = G - I"</div>
            <div className="text-[#d9c4a5]">[04:43:05 AM] NODE_BETA_02: "STREAM_B = N - E - X"</div>
            <div className="text-[#d9c4a5]">[04:44:00 AM] NODE_GAMMA_03: "STREAM_C = I - A"</div>
            
            <div className="text-yellow-300 bg-[#3e2414] p-3 rounded-xl border border-[#d4af37]/50 font-bold">
              <div className="flex items-center justify-between">
                <span>COMBINED 7-LETTER SCRAMBLED MATRIX TOKEN:</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-yellow-300 text-xs tracking-widest mt-1 font-mono">
                BANK: <strong className="text-yellow-400">" G - I - N - E - X - I - A "</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Anagram Rearranger Console */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-center space-y-4 text-[#f4e8d3]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-300 uppercase flex items-center space-x-1.5">
              <Shuffle className="w-4 h-4 text-yellow-400" />
              <span>7-LETTER EVENT ANAGRAM WORKBENCH</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setKeyInput('IGNEXIA');
                  setUserLetters([
                    { letter: 'I', idx: 1 },
                    { letter: 'G', idx: 0 },
                    { letter: 'N', idx: 2 },
                    { letter: 'E', idx: 3 },
                    { letter: 'X', idx: 4 },
                    { letter: 'I', idx: 5 },
                    { letter: 'A', idx: 6 }
                  ]);
                }}
                className="text-[10px] bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-xl flex items-center space-x-1 font-black shadow-md uppercase tracking-wider"
              >
                <span>AUTO-FILL (IGNEXIA) 💡</span>
              </button>

              <button
                type="button"
                onClick={handleResetLetters}
                className="text-[10px] bg-[#3e2414] hover:bg-[#5c381e] text-[#d9c4a5] border border-[#8b5a2b] px-3 py-1 rounded-xl flex items-center space-x-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>CLEAR WORKBENCH</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#d9c4a5] bg-[#140c08] p-2.5 rounded-xl border border-[#8b5a2b] italic">
            💡 <strong>EVENT ANAGRAM CLUE</strong>: Unscramble the 7 letters <strong className="text-yellow-300">G - I - N - E - X - I - A</strong> to spell the grand title of this digital treasure hunt event: <strong className="text-yellow-300 font-mono text-xs font-bold">IGNEXIA</strong>!
          </p>

          {/* Letter Source Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {initialLetters.map((char, idx) => {
              const isUsed = userLetters.some(item => item.idx === idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isUsed}
                  onClick={() => handleAddLetter(char, idx)}
                  className={`w-10 h-10 rounded-xl border font-bold text-sm transition-all ${
                    isUsed
                      ? 'bg-[#140c08] border-[#5c381e] text-[#5c381e] cursor-not-allowed'
                      : 'bg-[#3e2414] hover:bg-[#5c381e] border-[#d4af37] text-yellow-300 hover:scale-105 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Workbench */}
          <div className="bg-[#3e2414] p-3.5 rounded-xl border border-[#8b5a2b] min-h-[55px] flex items-center justify-between px-4">
            <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
              {userLetters.length === 0 ? (
                <span className="text-xs text-[#d9c4a5] italic">Tap letters above to construct 7-letter event key...</span>
              ) : (
                userLetters.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRemoveLetter(idx)}
                    className="px-2.5 py-1 bg-[#140c08] border border-[#d4af37] text-yellow-300 rounded-lg font-bold text-xs hover:bg-red-950 hover:border-red-500 hover:text-red-300 transition-colors"
                  >
                    {item.letter}
                  </button>
                ))
              )}
            </div>

            {userLetters.length > 0 && (
              <button
                type="button"
                onClick={handleFillInput}
                className="text-[10px] bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] px-3 py-1.5 rounded-xl font-black transition-all ml-2 flex-shrink-0 uppercase tracking-wider"
              >
                USE THIS WORD ➔
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 6 Decryption Key Submission</span>
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
