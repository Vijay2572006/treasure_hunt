import React from 'react';
import { Anchor, Compass, Skull, Shield, Award, Sparkles, MapPin, ArrowRight, Flame } from 'lucide-react';

export const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 text-center font-serif">
      
      {/* Antique Parchment Card */}
      <div className="bg-pirate-espresso border-2 border-pirate-gold/60 rounded-3xl max-w-3xl w-full p-8 md:p-12 shadow-[0_0_60px_rgba(212,175,55,0.25)] relative overflow-hidden">
        
        {/* Decorative Pirate Corner Accents */}
        <div className="absolute top-4 left-4 text-pirate-gold opacity-60">
          <Anchor className="w-8 h-8" />
        </div>
        <div className="absolute top-4 right-4 text-pirate-gold opacity-60">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '25s' }} />
        </div>
        <div className="absolute bottom-4 left-4 text-pirate-gold opacity-60">
          <Compass className="w-8 h-8" />
        </div>
        <div className="absolute bottom-4 right-4 text-pirate-gold opacity-60">
          <Anchor className="w-8 h-8" />
        </div>

        {/* Top Institution Header */}
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-pirate-gold font-bold bg-pirate-coffee/80 px-4 py-1.5 rounded-full border border-pirate-gold/40 inline-block shadow-md">
            NIFT-TEA COLLEGE OF KNITWEAR FASHION
          </span>
        </div>

        {/* Event Name */}
        <div className="my-6 space-y-2">
          <div className="flex items-center justify-center space-x-3 text-pirate-gold">
            <Skull className="w-8 h-8 text-pirate-gold animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-pirate-parchment drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] uppercase font-mono">
              IGNEXIA 2026
            </h1>
            <Skull className="w-8 h-8 text-pirate-gold animate-bounce" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-wider text-pirate-gold font-serif uppercase">
            DIGITAL TREASURE HUNT
          </h2>

          <p className="text-xs text-pirate-parchmentDark font-mono uppercase tracking-wider pt-1">
            Conducted by <strong className="text-pirate-gold">Department of Computer Science</strong>
          </p>
        </div>

        {/* Pirate Lore & Voyage Mission Briefing */}
        <div className="bg-pirate-coffee/90 border border-pirate-gold/40 rounded-2xl p-6 my-6 text-sm text-pirate-parchment leading-relaxed font-sans shadow-inner max-w-xl mx-auto space-y-3">
          <p className="italic font-serif">
            "Ahoy, Brave Explorers! Embark on an epic digital voyage across 7 cryptic islands filled with mind-bending trials, ancient ciphers, and hidden perils."
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs font-mono text-pirate-gold pt-2 border-t border-pirate-wood">
            <span className="flex items-center gap-1">🏴‍☠️ 7 Pirate Islands</span>
            <span className="flex items-center gap-1">🪙 Gold Treasure Point</span>
          </div>
        </div>

        {/* GET STARTED ACTION BUTTON */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="px-10 py-4 bg-gradient-to-r from-pirate-gold via-yellow-400 to-pirate-gold hover:from-yellow-400 hover:to-pirate-gold text-pirate-dark font-black text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 uppercase tracking-widest flex items-center justify-center space-x-3 mx-auto font-mono"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>

    </div>
  );
};
