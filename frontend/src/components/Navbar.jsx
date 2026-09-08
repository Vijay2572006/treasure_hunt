import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Skull, Compass, Lock } from 'lucide-react';

export const Navbar = ({ onGoHome, onOpenAdmin }) => {
  const { team, logout } = useAuth();

  return (
    <nav className="bg-pirate-espresso/95 backdrop-blur-md border-b-2 border-pirate-gold/40 sticky top-0 z-40 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-serif">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={onGoHome}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2 bg-pirate-coffee border border-pirate-gold rounded-xl text-pirate-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
            <Skull className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wider text-pirate-gold uppercase font-mono">
                IGNEXIA 2026
              </h1>
              <span className="text-[10px] bg-pirate-gold text-pirate-dark font-black px-2 py-0.5 rounded uppercase font-mono">
                DIGITAL TREASURE HUNT
              </span>
            </div>
            <p className="text-[10px] text-pirate-parchmentDark font-mono">
              NIFT-TEA COLLEGE OF KNITWEAR FASHION | Dept. of CS
            </p>
          </div>
        </div>

        {/* Right Side Header Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          {team && (
            <>
              {/* Team Info Badge */}
              <div className="bg-pirate-coffee/90 border border-pirate-wood px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
                <Shield className="w-4 h-4 text-pirate-gold" />
                <div>
                  <span className="font-semibold text-pirate-parchment">{team.team_name}</span>
                  <span className="text-pirate-parchmentDark ml-1">({team.college})</span>
                </div>
              </div>

              {/* Stage Progress Badge */}
              <div className="bg-pirate-coffee/90 border border-pirate-gold/40 px-3.5 py-1.5 rounded-xl flex items-center space-x-2 text-pirate-parchment">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>ISLAND <strong className="text-pirate-gold">{team.is_completed ? 'TREASURE REACHED' : team.current_stage}</strong> / 7</span>
              </div>
            </>
          )}

          {/* Secured Admin Panel Trigger Button (PIN Authenticated) */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Secured Admin Panel (Requires Admin PIN)"
            className="p-1.5 bg-pirate-coffee hover:bg-[#5c381e] text-pirate-gold border border-pirate-gold/60 rounded-xl transition-all flex items-center space-x-1.5 px-3 py-1.5 font-bold shadow-md"
          >
            <Lock className="w-3.5 h-3.5 text-yellow-300" />
            <span>ADMIN 🔐</span>
          </button>

          {team && (
            /* Logout Button */
            <button
              type="button"
              onClick={logout}
              title="Logout Session"
              className="p-1.5 bg-pirate-coffee hover:bg-red-950 text-pirate-parchmentDark hover:text-red-400 border border-pirate-wood rounded-xl transition-all flex items-center space-x-1 px-3 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
