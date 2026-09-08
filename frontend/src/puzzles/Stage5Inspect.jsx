import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { ShieldCheck, Key, AlertCircle, ArrowRight, Grid, Cpu } from 'lucide-react';

export const Stage5Inspect = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Polybius Matrix with ALL dual letter pairs like "Y/Z"
  const polybiusSquare = [
    ['A/B', 'C/D', 'E/F', 'G/H', 'I/J'],
    ['K/L', 'M/N', 'O/P', 'Q/R', 'S/T'],
    ['U/V', 'W/X', 'Y/Z', 'A/C', 'E/G'],
    ['I/K', 'M/O', 'Q/S', 'U/W', 'Y/A'],
    ['B/D', 'F/H', 'J/L', 'N/P', 'R/T']
  ];

  // Intercepted Steganographic Coordinate Pairs for CYBERVAULT:
  const coordinatePairs = [
    { row: 1, col: 2 },
    { row: 3, col: 3 },
    { row: 1, col: 1 },
    { row: 1, col: 3 },
    { row: 2, col: 4 },
    { row: 3, col: 1 },
    { row: 1, col: 1 },
    { row: 3, col: 1 },
    { row: 2, col: 1 },
    { row: 2, col: 5 }
  ];

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
            <Grid className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 5: Steganography & Polybius Cipher Matrix"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Visual Steganography & Polybius Grid Cipher"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#3e2414] leading-relaxed font-sans mt-3 font-semibold">
          {stageData?.description || "An encrypted steganographic signal transmission was intercepted. Use the 5x5 dual-letter Polybius grid cipher tool to decode the coordinate stream into the security passkey."}
        </p>
      </div>

      {/* Steganographic Intercept & Interactive Polybius Grid Station */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c] space-y-6">
        
        {/* Intercepted Coordinate Stream Display */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
          <div className="flex items-center justify-between mb-3 border-b border-[#8b5a2b] pb-2">
            <span className="text-xs font-bold text-yellow-300 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>INTERCEPTED STEGANOGRAPHIC COORDINATE STREAM:</span>
            </span>
            <span className="text-[10px] text-[#d9c4a5] font-mono">10 COORDINATE PAIRS</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center text-xs">
            {coordinatePairs.map((item, idx) => (
              <div key={idx} className="bg-[#3e2414] border border-[#d4af37]/50 p-2 rounded-lg">
                <span className="text-[10px] text-[#d9c4a5] block">#{idx + 1}</span>
                <span className="text-yellow-300 font-bold font-mono">({item.row},{item.col})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5x5 Dual-Letter Polybius Cipher Matrix Table */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-center text-[#f4e8d3]">
          <h3 className="text-xs text-yellow-300 uppercase tracking-wider mb-4 font-bold">
            DUAL-LETTER POLYBIUS SQUARE 5x5 MATRIX (ROW, COLUMN)
          </h3>

          <div className="inline-block overflow-x-auto">
            <table className="border-collapse text-xs font-mono">
              <thead>
                <tr>
                  <th className="p-2 text-[#d9c4a5]">R \ C</th>
                  {[1, 2, 3, 4, 5].map(c => (
                    <th key={c} className="p-2.5 text-yellow-300 font-bold bg-[#3e2414] border border-[#8b5a2b] min-w-[55px]">
                      COL {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {polybiusSquare.map((row, rIdx) => {
                  const rowNum = rIdx + 1;
                  return (
                    <tr key={rowNum}>
                      <td className="p-2.5 text-yellow-300 font-bold bg-[#3e2414] border border-[#8b5a2b]">
                        ROW {rowNum}
                      </td>
                      {row.map((pair, cIdx) => {
                        const colNum = cIdx + 1;
                        return (
                          <td
                            key={colNum}
                            className="p-3.5 border border-[#8b5a2b] bg-[#140c08] text-yellow-300 font-bold text-sm hover:bg-[#3e2414] transition-colors"
                          >
                            {pair}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <span className="text-[10px] text-[#d9c4a5] block mt-3">
            Map each coordinate pair (Row, Column) to its dual-letter cell, then deduce the coherent passkey.
          </span>
        </div>

      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 5 Decryption Key Submission</span>
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
