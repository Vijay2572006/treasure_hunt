import React from 'react';
import { Compass, Skull, Check, Lock, MapPin, Anchor } from 'lucide-react';

export const StageNavigation = ({ currentStage, totalStages = 7, isCompleted = false, onSelectStage }) => {

  // Coordinates aligned over the realistic pirate map trail route
  const islandDetails = [
    { num: 1, name: "1. Acoustic Cove", x: 18, y: 72 },
    { num: 2, name: "2. Geolocation Reef", x: 32, y: 52 },
    { num: 3, name: "3. Skull Cove", x: 44, y: 48 },
    { num: 4, name: "4. River of Sorrow", x: 58, y: 35 },
    { num: 5, name: "5. Polybius Bay", x: 74, y: 22 },
    { num: 6, name: "6. Anagram Anchorage", x: 82, y: 60 },
    { num: 7, name: "7. TREASURE POINT 🪙", x: 67, y: 52 }
  ];

  return (
    <div className="bg-[#24150c] border-4 border-[#8b5a2b] rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] font-serif space-y-6 relative overflow-hidden my-4">
      
      {/* PIRATE TREASURE MAP HEADER */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#8b5a2b] pb-4">
        <div>
          <div className="flex items-center space-x-3 text-[#d4af37] font-bold text-xl uppercase tracking-wider font-mono">
            <Skull className="w-7 h-7 text-[#d4af37] animate-pulse" />
            <span>PIRATE VOYAGE TREASURE MAP</span>
          </div>
          <p className="text-xs text-[#d9c4a5] font-mono mt-1">
            Traverse rivers, mountains, and uncharted waters along the pirate trail to X Marks The Spot!
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-[#140c08] px-4 py-2 rounded-xl border border-[#d4af37] text-yellow-300 shadow-md">
          {isCompleted ? "ALL TREASURES UNLOCKED! 🪙🏴‍☠️" : `UNLOCKED UP TO: ISLAND #${currentStage}`}
        </span>
      </div>

      {/* PHOTOREALISTIC PARCHMENT PIRATE TREASURE MAP CANVAS */}
      <div 
        className="relative w-full h-[520px] rounded-2xl border-4 border-[#5c381e] shadow-[inner_0_0_40px_rgba(62,36,20,0.8)] overflow-hidden select-none font-serif bg-cover bg-center"
        style={{ backgroundImage: `url('/pirate_map.jpg')` }}
      >
        
        {/* Subtle Antique Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#140c08]/50 via-transparent to-[#140c08]/40 pointer-events-none" />

        {/* 7 INTERACTIVE ISLAND MAP NODES ALONG THE MAP ROUTE */}
        {islandDetails.map((item) => {
          const stageNum = item.num;
          const isDone = isCompleted || stageNum < currentStage;
          const isCurrentActive = !isCompleted && stageNum === currentStage;
          const isLocked = !isDone && !isCurrentActive;
          const isFinalStage = stageNum === 7;

          return (
            <div
              key={stageNum}
              onClick={() => {
                if (!isLocked && onSelectStage) {
                  onSelectStage(stageNum);
                }
              }}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex flex-col items-center z-20 ${
                !isLocked ? 'cursor-pointer hover:scale-115' : 'cursor-not-allowed opacity-60'
              }`}
            >
              {/* Active Ship Indicator */}
              {isCurrentActive && (
                <div className="absolute -top-8 text-[11px] bg-[#8b0000] text-yellow-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-bounce flex items-center gap-1">
                  <span>⛵ CREW HERE</span>
                </div>
              )}

              {/* Island Icon Badge Node */}
              <div className={`w-13 h-13 rounded-full border-3 flex items-center justify-center shadow-2xl transition-all ${
                isDone
                  ? 'bg-[#1b4332] border-[#2d6a4f] text-[#52b788] shadow-[0_0_20px_rgba(82,183,136,0.7)]'
                  : isCurrentActive
                  ? 'bg-[#3e2414] border-[#ffd700] text-yellow-300 shadow-[0_0_30px_rgba(255,215,0,0.9)] animate-pulse scale-110'
                  : isFinalStage
                  ? 'bg-[#5c381e] border-[#d4af37] text-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.7)]'
                  : 'bg-[#170e09]/90 border-[#5c381e] text-[#8b5a2b]'
              }`}>
                {isFinalStage ? (
                  <span className="text-2xl animate-bounce">🪙</span>
                ) : isDone ? (
                  <Check className="w-6 h-6 text-[#52b788]" />
                ) : isCurrentActive ? (
                  <Skull className="w-6 h-6 text-yellow-300" />
                ) : (
                  <Lock className="w-4 h-4 text-[#8b5a2b]" />
                )}
              </div>

              {/* Island Title Label on Map */}
              <div className={`mt-1 px-2.5 py-0.5 rounded-lg border text-center font-mono shadow-md ${
                isDone
                  ? 'bg-[#140c08]/95 border-[#2d6a4f] text-[#52b788]'
                  : isCurrentActive
                  ? 'bg-[#140c08]/95 border-[#ffd700] text-yellow-300 font-bold'
                  : 'bg-[#140c08]/90 border-[#5c381e] text-[#d9c4a5]'
              }`}>
                <span className="text-[10px] block font-bold whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[8px] block text-[#a89078]">
                  {isDone ? "CLEARED ✓" : isCurrentActive ? "ACTIVE TRIAL" : "LOCKED 🔒"}
                </span>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};
