import React, { useState, useEffect } from 'react';
import { Trophy, X, RefreshCw, Shield, Award, Skull, Compass, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const Leaderboard = ({ isOpen, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/leaderboard/');
      setTeams(res.data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-serif">
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_70px_rgba(0,0,0,0.9)] overflow-hidden text-[#23140c]">
        
        {/* Header */}
        <div className="p-5 bg-[#3e2414] border-b-2 border-[#8b5a2b] flex items-center justify-between font-mono text-[#f4e8d3]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#140c08] border border-[#d4af37] rounded-xl text-yellow-300">
              <Trophy className="w-6 h-6 animate-pulse text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-yellow-300 uppercase tracking-wider">
                CAPTAIN'S LOG LEADERBOARD
              </h2>
              <span className="text-[10px] text-[#d9c4a5]">
                IGNEXIA 2026 DIGITAL TREASURE HUNT OFFICIAL RANKINGS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="p-2 bg-[#140c08] hover:bg-[#5c381e] text-yellow-300 border border-[#d4af37]/50 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#140c08] hover:bg-red-950 text-[#d9c4a5] hover:text-red-400 border border-[#8b5a2b] rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 10-Minute Stage Time-Based Point System & Tie-Breaker Rule Explanation Banner */}
        <div className="bg-[#24150c] p-4 border-b-2 border-[#8b5a2b] font-mono text-xs text-[#f4e8d3] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-yellow-300 font-extrabold uppercase flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>TIME-BASED STAGE SCORING RULE (MAX 5 PTS PER STAGE | 10-MIN TIMER):</span>
            </span>
            <span className="text-[10px] text-[#d9c4a5] font-bold">ALL 7 STAGES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center text-[10px]">
            <div className="bg-[#3e2414] border border-[#d4af37]/50 p-1.5 rounded-lg">
              <span className="text-[#d9c4a5] block">0 - 3 MIN</span>
              <strong className="text-yellow-300 block font-bold">5 PTS ⭐️</strong>
            </div>
            <div className="bg-[#3e2414] border border-[#d4af37]/50 p-1.5 rounded-lg">
              <span className="text-[#d9c4a5] block">3 - 5 MIN</span>
              <strong className="text-yellow-300 block font-bold">4 PTS</strong>
            </div>
            <div className="bg-[#3e2414] border border-[#d4af37]/50 p-1.5 rounded-lg">
              <span className="text-[#d9c4a5] block">5 - 7 MIN</span>
              <strong className="text-yellow-300 block font-bold">3 PTS</strong>
            </div>
            <div className="bg-[#3e2414] border border-[#d4af37]/50 p-1.5 rounded-lg">
              <span className="text-[#d9c4a5] block">7 - 8 MIN</span>
              <strong className="text-yellow-300 block font-bold">2 PTS</strong>
            </div>
            <div className="bg-[#3e2414] border border-[#d4af37]/50 p-1.5 rounded-lg">
              <span className="text-[#d9c4a5] block">8 - 9 MIN</span>
              <strong className="text-yellow-300 block font-bold">1 PT</strong>
            </div>
            <div className="bg-[#3e2414] border border-red-500/50 p-1.5 rounded-lg text-red-300">
              <span className="block">&gt; 10 MIN</span>
              <strong className="block font-bold">0 PTS</strong>
            </div>
          </div>

          <p className="text-[10px] text-[#d9c4a5] italic mt-1 bg-[#140c08] p-2 rounded-lg border border-[#8b5a2b]">
            ⚖️ <strong>Honest Tie-Breaker Rule</strong>: If two crews earn equal Total Points, the crew that completed all tasks in the <strong>MINIMUM TOTAL TIME</strong> is awarded <strong>1st Place</strong>.
          </p>
        </div>

        {/* Table Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {loading && teams.length === 0 ? (
            <div className="text-center py-12 text-[#5c381e]">
              <Compass className="w-8 h-8 animate-spin mx-auto mb-2 text-[#8b5a2b]" />
              <span>READING CAPTAIN'S LOG...</span>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12 text-[#5c381e] italic">
              No pirate crews registered on the leaderboard yet.
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#8b5a2b] text-yellow-300 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 text-center">RANK</th>
                    <th className="pb-3">PIRATE CREW</th>
                    <th className="pb-3">COLLEGE</th>
                    <th className="pb-3 text-center">ISLAND CLEARED</th>
                    <th className="pb-3 text-center">TOTAL SCORE</th>
                    <th className="pb-3 text-right">TOTAL TIME TAKEN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8b5a2b]/40">
                  {teams.map((t) => {
                    return (
                      <tr key={t.rank} className="hover:bg-[#3e2414]/60 transition-colors">
                        <td className="py-3 text-center font-bold">
                          {t.rank === 1 ? (
                            <span className="px-2.5 py-1 bg-yellow-400 text-black font-black rounded-lg">1st 👑</span>
                          ) : t.rank === 2 ? (
                            <span className="px-2.5 py-1 bg-slate-300 text-black font-black rounded-lg">2nd 🥈</span>
                          ) : t.rank === 3 ? (
                            <span className="px-2.5 py-1 bg-amber-600 text-black font-black rounded-lg">3rd 🥉</span>
                          ) : (
                            <span className="text-[#d9c4a5] font-bold">#{t.rank}</span>
                          )}
                        </td>
                        <td className="py-3 font-bold text-pirate-parchment">
                          <span className="text-yellow-300 font-extrabold text-xs block">{t.team_name}</span>
                          <div className="text-[10px] text-[#d9c4a5] font-normal">
                            {t.member1_name} & {t.member2_name}
                          </div>
                        </td>
                        <td className="py-3 text-[#d9c4a5] truncate max-w-[150px]">
                          {t.college}
                        </td>
                        <td className="py-3 text-center font-bold text-amber-300">
                          {t.is_completed ? 'TREASURE REACHED 🪙' : `ISLAND #${t.current_stage}`}
                        </td>
                        <td className="py-3 text-center font-black text-yellow-300 text-sm">
                          {t.total_score || 0} PTS
                        </td>
                        <td className="py-3 text-right font-bold text-[#f4e8d3]">
                          {t.formatted_time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
