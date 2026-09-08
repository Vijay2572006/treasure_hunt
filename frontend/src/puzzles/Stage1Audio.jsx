import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { StageTimer } from '../components/StageTimer';
import { Radio, Key, Play, Pause, Volume2, ShieldCheck, AlertCircle, ArrowRight, Skull, Compass } from 'lucide-react';

export const Stage1Audio = ({ onCustomSubmit }) => {
  const { stageData, submitKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const audioContextRef = useRef(null);

  // Morse Pattern for "ECHOMATRIX"
  const morseCode = [
    { char: 'E', code: '.' },
    { char: 'C', code: '- . - .' },
    { char: 'H', code: '. . . .' },
    { char: 'O', code: '- - -' },
    { char: 'M', code: '- -' },
    { char: 'A', code: '. -' },
    { char: 'T', code: '-' },
    { char: 'R', code: '. - .' },
    { char: 'I', code: '. .' },
    { char: 'X', code: '- . . -' }
  ];

  // Complete A-Z Morse Legend Table
  const morseLegend = [
    { char: 'A', code: '.-' }, { char: 'B', code: '-...' }, { char: 'C', code: '-.-.' },
    { char: 'D', code: '-..' }, { char: 'E', code: '.' }, { char: 'F', code: '..-.' },
    { char: 'G', code: '--.' }, { char: 'H', code: '....' }, { char: 'I', code: '..' },
    { char: 'J', code: '.---' }, { char: 'K', code: '-.-' }, { char: 'L', code: '.-..' },
    { char: 'M', code: '--' }, { char: 'N', code: '-.' }, { char: 'O', code: '---' },
    { char: 'P', code: '.--.' }, { char: 'Q', code: '--.-' }, { char: 'R', code: '.-.' },
    { char: 'S', code: '...' }, { char: 'T', code: '-' }, { char: 'U', code: '..-' },
    { char: 'V', code: '...-' }, { char: 'W', code: '.--' }, { char: 'X', code: '-..-' },
    { char: 'Y', code: '-.--' }, { char: 'Z', code: '--..' }
  ];

  const playBeep = (ctx, duration, frequency = 750) => {
    return new Promise((resolve) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
      setTimeout(resolve, duration * 1000 + 80);
    });
  };

  const handlePlayMorseAudio = async () => {
    if (isPlaying) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    setIsPlaying(true);
    setHasPlayed(true);

    const dotTime = 0.12;
    const dashTime = 0.36;

    for (const item of morseCode) {
      const symbols = item.code.split(' ');
      for (const sym of symbols) {
        if (sym === '.') {
          await playBeep(ctx, dotTime, 800);
        } else if (sym === '-') {
          await playBeep(ctx, dashTime, 650);
        }
      }
      await new Promise(r => setTimeout(r, 220));
    }

    setIsPlaying(false);
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
            <Skull className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono text-[#3e2414] tracking-wider uppercase">
              {stageData?.title || "Island 1: The Pirate Acoustic Cipher"}
            </h2>
            <span className="text-xs font-mono text-yellow-300 bg-[#3e2414] px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mt-1">
              CATEGORY: {stageData?.category || "Audio Signal Decryption & Morse Forensics"}
            </span>
          </div>
        </div>

        {/* Pirate Question Briefing & Embedded Audio Control */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] mt-4 space-y-4 font-mono text-xs text-[#f4e8d3]">
          <p className="leading-relaxed font-sans text-sm italic">
            "Ahoy Matey! An encrypted siren transmission was captured over Acoustic Cove. Initiate audio playback below to reveal the pulse frequency, then decode using your Pirate Morse Directory."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#140c08] p-4 rounded-xl border border-[#d4af37]/60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3e2414] border border-[#d4af37] rounded-lg text-yellow-300">
                <Volume2 className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-yellow-300 font-bold block text-xs">COVE FREQUENCY TRANSMISSION</span>
                <span className="text-[10px] text-[#d9c4a5] font-mono">
                  {isPlaying ? 'PLAYING AUDIO SIGNAL...' : hasPlayed ? 'SIGNAL DECODED' : 'CLICK PLAY TO START'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayMorseAudio}
              disabled={isPlaying}
              className="px-6 py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] hover:from-yellow-400 hover:to-[#d4af37] text-[#140c08] font-black text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center space-x-2 disabled:opacity-50 font-mono uppercase tracking-wider"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-[#140c08] animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#140c08]" />
                  <span>PLAY AUDIO SIGNAL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Signal Frequency & Morse Legend Table */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c] space-y-6">
        
        {/* Revealed Frequency Signals */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
          <h3 className="text-xs font-bold text-yellow-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-yellow-400" />
            <span>REVEALED SIGNAL FREQUENCY PATTERN:</span>
          </h3>

          {hasPlayed ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 text-center text-xs">
              {morseCode.map((item, idx) => (
                <div key={idx} className="bg-[#3e2414] p-2.5 rounded-xl border border-[#d4af37]/50">
                  <span className="text-[10px] text-[#d9c4a5] block font-mono">#{idx + 1}</span>
                  <span className="text-yellow-300 font-extrabold text-sm tracking-widest block font-mono">
                    {item.code}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-[#d9c4a5] text-xs italic bg-[#3e2414]/80 rounded-xl border border-[#8b5a2b]">
              🔒 Audio signal frequency hidden. Press "PLAY AUDIO SIGNAL" button above to reveal.
            </div>
          )}
        </div>

        {/* Complete A-Z Pirate Morse Directory */}
        <div className="bg-[#24150c] p-5 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
          <h3 className="text-xs font-bold text-yellow-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-yellow-300" />
            <span>FULL A-Z PIRATE MORSE DIRECTORY</span>
          </h3>

          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-13 gap-2 text-center text-xs font-mono">
            {morseLegend.map((item) => (
              <div key={item.char} className="bg-[#3e2414] p-2 rounded-lg border border-[#8b5a2b]">
                <span className="text-yellow-300 font-black text-sm block">{item.char}</span>
                <span className="text-[#f4e8d3] text-[10px] font-bold block tracking-wider">{item.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Passkey Submission Form */}
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl p-6 shadow-2xl font-mono text-[#23140c]">
        <h3 className="text-sm font-bold text-[#3e2414] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#8b5a2b]" />
          <span>Island 1 Decryption Key Submission</span>
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
