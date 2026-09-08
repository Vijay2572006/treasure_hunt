import React, { useState, useEffect } from 'react';
import { Clock, Award, AlertCircle } from 'lucide-react';

export const StageTimer = ({ stageStartTime, isStopped = false }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!stageStartTime) {
      setElapsedSeconds(0);
      return;
    }

    const startMs = new Date(stageStartTime).getTime();

    const updateTimer = () => {
      if (isStopped) return;
      const nowMs = Date.now();
      const diffSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      setElapsedSeconds(diffSec);
    };

    updateTimer();

    if (!isStopped) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [stageStartTime, isStopped]);

  // Format MM:SS
  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Live Projected Stage Points based on elapsed time:
  // 0-3m (0-180s) => 5 PTS
  // 3-5m (181-300s) => 4 PTS
  // 5-7m (301-420s) => 3 PTS
  // 7-8m (421-480s) => 2 PTS
  // 8-9m (481-540s) => 1 PT
  // > 10m (>600s) => 0 PTS
  const getProjectedPoints = (sec) => {
    if (sec <= 180) return { pts: 5, label: '5 PTS (MAX SCORE)', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/80' };
    if (sec <= 300) return { pts: 4, label: '4 PTS', color: 'text-yellow-300 border-yellow-500 bg-yellow-950/80' };
    if (sec <= 420) return { pts: 3, label: '3 PTS', color: 'text-amber-300 border-amber-500 bg-amber-950/80' };
    if (sec <= 480) return { pts: 2, label: '2 PTS', color: 'text-orange-400 border-orange-500 bg-orange-950/80' };
    if (sec <= 540) return { pts: 1, label: '1 PT', color: 'text-orange-500 border-orange-600 bg-orange-950/90' };
    return { pts: 0, label: '0 PTS (TIME EXPIRED)', color: 'text-red-400 border-red-500 bg-red-950/90' };
  };

  const currentStatus = getProjectedPoints(elapsedSeconds);

  return (
    <div className="bg-[#24150c] border-2 border-[#8b5a2b] rounded-2xl p-4 shadow-xl font-mono text-[#f4e8d3] flex flex-wrap items-center justify-between gap-4">
      
      {/* Live Stage Timer Counter */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-[#3e2414] border border-[#d4af37] rounded-xl text-yellow-300 shadow-md">
          <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: isStopped ? '0s' : '10s' }} />
        </div>
        <div>
          <span className="text-[10px] text-[#d9c4a5] uppercase font-bold block">
            STAGE LIVE TIMER {isStopped ? '(STOPPED)' : '(COUNTING UP FROM 00:00)'}
          </span>
          <strong className="text-2xl font-black tracking-widest text-yellow-300 block font-mono">
            {formatTimer(elapsedSeconds)}
          </strong>
        </div>
      </div>

      {/* Live Projected Points Badge */}
      <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 shadow-md ${currentStatus.color}`}>
        <Award className="w-5 h-5 flex-shrink-0" />
        <div>
          <span className="text-[10px] uppercase block font-bold">PROJECTED REWARD:</span>
          <strong className="text-xs font-extrabold uppercase font-mono">{currentStatus.label}</strong>
        </div>
      </div>

    </div>
  );
};
