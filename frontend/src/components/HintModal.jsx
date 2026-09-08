import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, AlertTriangle, CheckCircle2, Lock, X, Clock, Zap } from 'lucide-react';

export const HintModal = ({ isOpen, onClose }) => {
  const { team, stageData, requestHint } = useAuth();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !stageData) return null;

  const unlockedHints = stageData.unlocked_hints || {};
  const elapsedSeconds = stageData.elapsed_seconds || 0;

  const handleUnlockHint = async (hintIndex) => {
    setLoadingIndex(hintIndex);
    setErrorMsg('');
    setSuccessMsg('');
    const res = await requestHint(hintIndex);
    setLoadingIndex(null);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(res.message || `Hint ${hintIndex} unlocked successfully!`);
    }
  };

  const hintRules = [
    {
      index: 1,
      title: 'Hint 1 (Available at Minute 3:00)',
      autoSec: 180,
      timeLabel: '3:00 Elapsed',
      penaltyLabel: '−3 Min Clock Penalty'
    },
    {
      index: 2,
      title: 'Hint 2 (Available at Minute 6:00)',
      autoSec: 360,
      timeLabel: '6:00 Elapsed',
      penaltyLabel: '−3 Min Clock Penalty'
    },
    {
      index: 3,
      title: 'Hint 3 (Available at Minute 9:00)',
      autoSec: 540,
      timeLabel: '9:00 Elapsed',
      penaltyLabel: '−3 Min Clock Penalty'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-cyber-panel border border-amber-500/40 rounded-xl max-w-xl w-full p-6 shadow-[0_0_35px_rgba(251,191,36,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/40 mb-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <HelpCircle className="w-6 h-6" />
            <h3 className="text-lg font-bold uppercase tracking-wider">Tactical Stage Hint Console</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Penalty Info Warning */}
        <div className="bg-red-950/40 border border-red-500/50 rounded-lg p-3 mb-4 text-xs text-red-200 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-red-400 font-bold uppercase mb-0.5">TIMED HINTS & CLOCK PENALTIES:</strong>
            Hints auto-unlock for FREE when stage elapsed time hits 3:00, 6:00, and 9:00. Unlocking early applies a <span className="underline font-bold text-amber-300">−3 Minute Clock Penalty (+180s)</span>.
          </div>
        </div>

        {/* Status Feedback Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500 rounded text-red-300 text-xs mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded text-emerald-300 text-xs mb-4">
            {successMsg}
          </div>
        )}

        {/* 3 Hints Cards List */}
        <div className="space-y-3 mb-4">
          {hintRules.map((rule) => {
            const isUnlocked = Boolean(unlockedHints[rule.index]);
            const isAutoAvailable = elapsedSeconds >= rule.autoSec;
            const hintContent = unlockedHints[rule.index];

            return (
              <div
                key={rule.index}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-sm'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-amber-300 uppercase">
                    {rule.title}
                  </span>

                  {isUnlocked ? (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : isAutoAvailable ? (
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
                      FREE AUTO UNLOCK
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded border border-slate-800 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-slate-200 leading-relaxed bg-black/60 p-3 rounded border border-amber-900/50 mt-2 font-sans">
                    "{hintContent}"
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-900">
                    <span className="text-[11px] text-slate-400">
                      Auto-unlocks at <strong className="text-cyan-400">{rule.timeLabel}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleUnlockHint(rule.index)}
                      disabled={loadingIndex === rule.index}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded transition-all shadow-[0_0_10px_rgba(251,191,36,0.3)] disabled:opacity-50 flex items-center space-x-1 justify-center"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{loadingIndex === rule.index ? 'Unlocking...' : `Unlock Now (${rule.penaltyLabel})`}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
