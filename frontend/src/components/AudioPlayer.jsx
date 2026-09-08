import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Radio, FileText, Search, Lock, Eye } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [activeTab, setActiveTab] = useState('audio'); // 'audio' | 'morse'
  const [searchLetter, setSearchLetter] = useState('');
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Morse pattern for "ECHOMATRIX"
  // E: .
  // C: -.-.
  // H: ....
  // O: ---
  // M: --
  // A: .-
  // T: -
  // R: .-.
  // I: ..
  // X: -..-
  const morsePattern = ".  -.-.  ....  ---  --  .-  -  .-.  ..  -..-";

  // Full A-Z International Morse Code Directory
  const fullMorseAlphabet = [
    { char: 'A', morse: '.-' },
    { char: 'B', morse: '-...' },
    { char: 'C', morse: '-.-.' },
    { char: 'D', morse: '-..' },
    { char: 'E', morse: '.' },
    { char: 'F', morse: '..-.' },
    { char: 'G', morse: '--.' },
    { char: 'H', morse: '....' },
    { char: 'I', morse: '..' },
    { char: 'J', morse: '.---' },
    { char: 'K', morse: '-.-' },
    { char: 'L', morse: '.-..' },
    { char: 'M', morse: '--' },
    { char: 'N', morse: '-.' },
    { char: 'O', morse: '---' },
    { char: 'P', morse: '.--.' },
    { char: 'Q', morse: '--.-' },
    { char: 'R', morse: '.-.' },
    { char: 'S', morse: '...' },
    { char: 'T', morse: '-' },
    { char: 'U', morse: '..-' },
    { char: 'V', morse: '...-' },
    { char: 'W', morse: '.--' },
    { char: 'X', morse: '-..-' },
    { char: 'Y', morse: '-.--' },
    { char: 'Z', morse: '--..' },
  ];

  const stopAudio = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const playMorseAudio = () => {
    stopAudio();
    setIsPlaying(true);
    setHasPlayed(true);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let index = 0;
    const unitTime = 130; // ms per dot

    intervalRef.current = setInterval(() => {
      if (index >= morsePattern.length) {
        stopAudio();
        return;
      }

      const symbol = morsePattern[index];
      index++;

      if (symbol === '.' || symbol === '-') {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.frequency.value = 650; // Clear 650Hz audio tone
          osc.type = 'sine';

          osc.connect(gain);
          gain.connect(ctx.destination);

          const duration = symbol === '.' ? unitTime / 1000 : (unitTime * 3) / 1000;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + duration);
        } catch (e) {
          console.error("Audio playback error:", e);
        }
      }
    }, unitTime * 1.5);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const filteredAlphabet = fullMorseAlphabet.filter(item => 
    item.char.toLowerCase().includes(searchLetter.toLowerCase()) ||
    item.morse.includes(searchLetter)
  );

  return (
    <div className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-5 font-mono shadow-[0_0_25px_rgba(0,240,255,0.15)]">
      
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-2">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Radio className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm uppercase">Audio Beacon Signal Terminal</span>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition-all ${
              activeTab === 'audio'
                ? 'bg-cyan-900 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>AUDIO PLAYER</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('morse')}
            className={`px-3 py-1.5 rounded flex items-center space-x-1.5 transition-all ${
              activeTab === 'morse'
                ? 'bg-amber-900 text-amber-300 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>FULL MORSE LEGEND (A-Z)</span>
          </button>
        </div>
      </div>

      {activeTab === 'audio' ? (
        <div className="space-y-4">
          {/* Signal Visualizer & Frequency Reveal Display */}
          <div className="bg-black/90 border border-cyan-900/50 rounded-lg p-5 flex flex-col items-center justify-center min-h-[130px] relative overflow-hidden">
            
            {/* Equalizer Audio Bar Animations */}
            <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-25">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded bg-cyan-400 transition-all duration-300 ${
                    isPlaying ? 'animate-bounce' : 'h-2'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.floor(Math.random() * 55) + 12}px` : '6px',
                    animationDelay: `${i * 0.04}s`
                  }}
                />
              ))}
            </div>

            {/* Display Frequency Signal Text ONLY when playing or after playing */}
            <div className="z-10 text-center space-y-2">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">
                AUDIO FREQUENCY SIGNAL DISPLAY
              </span>

              {isPlaying || hasPlayed ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1.5 text-emerald-400 text-xs font-bold mb-1">
                    <Eye className="w-4 h-4" />
                    <span>FREQUENCY SIGNAL REVEALED:</span>
                  </div>
                  <code className="text-cyan-300 font-bold tracking-widest text-base bg-slate-950 px-4 py-2 rounded border border-cyan-500/50 inline-block shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    {morsePattern}
                  </code>
                </div>
              ) : (
                <div className="bg-slate-950/80 px-4 py-3 rounded border border-slate-800 text-slate-400 text-xs flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>FREQUENCE SIGNAL LOCKED: PRESS <strong>"PLAY AUDIO SIGNAL"</strong> BELOW TO TRANSMIT & REVEAL</span>
                </div>
              )}
            </div>
          </div>

          {/* Direct Play Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={isPlaying ? stopAudio : playMorseAudio}
              className={`px-6 py-2.5 font-bold text-xs rounded-lg flex items-center space-x-2 transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE AUDIO SIGNAL' : 'PLAY AUDIO SIGNAL'}</span>
            </button>

            <div className="text-[11px] text-slate-400">
              Audio Transmission Status: <strong className={isPlaying ? 'text-emerald-400' : hasPlayed ? 'text-cyan-400' : 'text-amber-400'}>
                {isPlaying ? 'TRANSMITTING SIGNAL...' : hasPlayed ? 'SIGNAL DECODED / REVEALED' : 'READY TO PLAY'}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        /* Full A-Z International Morse Alphabet Reference Legend */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Full International Morse Code Directory (A - Z)
              </h4>
              <p className="text-[11px] text-slate-400">
                Use this A-Z directory to map the frequency signal code (. and -) to letters.
              </p>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search A-Z or morse..."
                value={searchLetter}
                onChange={(e) => setSearchLetter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
            {filteredAlphabet.map((item) => (
              <div
                key={item.char}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded text-center transition-colors group"
              >
                <span className="text-cyan-300 font-bold text-base block group-hover:text-amber-300">
                  {item.char}
                </span>
                <span className="text-amber-400 font-mono text-xs block tracking-widest font-extrabold mt-0.5">
                  {item.morse}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
