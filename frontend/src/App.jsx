import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StageNavigation } from './components/StageNavigation';
import { Leaderboard } from './components/Leaderboard';
import { AdminDashboard } from './components/AdminDashboard';

import { Stage1Audio } from './puzzles/Stage1Audio';
import { Stage2Osint } from './puzzles/Stage2Osint';
import { Stage3Metadata } from './puzzles/Stage3Metadata';
import { Stage4Rebus } from './puzzles/Stage4Rebus';
import { Stage5Inspect } from './puzzles/Stage5Inspect';
import { Stage6Social } from './puzzles/Stage6Social';
import { Stage7Master } from './puzzles/Stage7Master';

import { Trophy, HelpCircle, ShieldCheck, Compass, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

const MainContent = () => {
  const { team, stageData, loading, error, submitKey } = useAuth();
  const [landingViewState, setLandingViewState] = useState('landing'); // 'landing' | 'register'
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  
  // Navigation mode for logged-in teams: 'map' vs 'stage'
  const [viewMode, setViewMode] = useState('map');
  const [activeStageNum, setActiveStageNum] = useState(1);
  const [stageSuccessNotice, setStageSuccessNotice] = useState('');

  // Default active stage to team's current stage when stageData updates
  useEffect(() => {
    if (team) {
      setActiveStageNum(team.current_stage);
    }
  }, [team?.current_stage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center font-mono text-pirate-gold">
        <Compass className="w-12 h-12 animate-spin mb-4 text-pirate-gold" style={{ animationDuration: '4s' }} />
        <span className="text-sm uppercase tracking-widest animate-pulse">LOADING PIRATE VOYAGE TREASURE MAP...</span>
      </div>
    );
  }

  // View state when no team logged in
  if (!team) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col justify-between selection:bg-pirate-gold selection:text-black font-serif">
        <Navbar
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAdmin={() => setIsAdminDashboardOpen(true)}
          onGoHome={() => setLandingViewState('landing')}
        />
        <main className="container mx-auto px-4 py-6">
          {landingViewState === 'landing' ? (
            <LandingPage onGetStarted={() => setLandingViewState('register')} />
          ) : (
            <AuthModal />
          )}
        </main>

        <footer className="text-center py-4 text-xs text-pirate-parchmentDark font-mono border-t border-pirate-coffee bg-pirate-espresso">
          NIFT-TEA COLLEGE OF KNITWEAR FASHION | IGNEXIA 2026 DIGITAL TREASURE HUNT &copy; Dept. of CS
        </footer>

        <Leaderboard
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
        />

        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      </div>
    );
  }

  const currentStage = team.current_stage;
  const isCompleted = team.is_completed;

  // Handle stage selection from Pirate Map (Strict Access Control)
  const handleSelectStageFromMap = (stageNum) => {
    if (!isCompleted && stageNum > currentStage) {
      alert(`🔒 Island #${stageNum} is Locked! You must complete Island #${currentStage} first.`);
      return;
    }

    setActiveStageNum(stageNum);
    setViewMode('stage');
  };

  // Wrap submitKey so when a stage is solved, it auto-redirects back to Map Page and unlocks next stage!
  const handleSubmitKeyWithAutoRedirect = async (keyInput) => {
    const res = await submitKey(keyInput);
    if (res.correct) {
      const solvedStage = activeStageNum;
      setStageSuccessNotice(`🎉 Island #${solvedStage} Cleared! Redirecting to Pirate Map to unlock next Island...`);
      
      setTimeout(() => {
        setStageSuccessNotice('');
        setViewMode('map');
      }, 1800);
    }
    return res;
  };

  const renderCurrentStageComponent = () => {
    switch (activeStageNum) {
      case 1:
        return <Stage1Audio onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 2:
        return <Stage2Osint onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 3:
        return <Stage3Metadata onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 4:
        return <Stage4Rebus onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 5:
        return <Stage5Inspect onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 6:
        return <Stage6Social onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      case 7:
        return <Stage7Master onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
      default:
        return <Stage1Audio onCustomSubmit={handleSubmitKeyWithAutoRedirect} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-pirate-parchment flex flex-col justify-between selection:bg-pirate-gold selection:text-black font-serif">
      
      <Navbar
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onGoHome={() => setViewMode('map')}
      />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
        
        {/* Global Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-500 rounded-xl text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Stage Completion Auto-Redirect Toast Notice */}
        {stageSuccessNotice && (
          <div className="mb-6 p-4 bg-emerald-950/90 border-2 border-emerald-400 rounded-2xl text-emerald-300 font-mono text-sm font-bold flex items-center space-x-3 shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-bounce">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <span>{stageSuccessNotice}</span>
          </div>
        )}

        {/* VICTORY SCREEN vs MAP PAGE vs ACTIVE STAGE PUZZLE */}
        {isCompleted ? (
          <div className="bg-pirate-espresso border-2 border-pirate-gold rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(212,175,55,0.3)] space-y-6 font-serif">
            <div className="w-24 h-24 mx-auto bg-pirate-coffee border-2 border-pirate-gold rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_40px_rgba(212,175,55,0.6)]">
              <span className="text-5xl animate-bounce">🪙</span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-black text-pirate-gold uppercase tracking-widest font-mono">
                FINAL TREASURE CLAIMED! 🏴‍☠️
              </h2>
              <p className="text-sm text-pirate-parchmentDark mt-2">
                All Hail Captain <strong className="text-pirate-gold">{team.team_name}</strong>! You have conquered all 7 Islands of IGNEXIA 2026 and unlocked the Golden Treasure Point!
              </p>
            </div>

            {/* Victory Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto my-6 text-xs font-mono">
              <div className="bg-pirate-coffee border border-pirate-wood p-4 rounded-xl">
                <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-pirate-gold" />
                <span className="text-pirate-parchmentDark block">CREW MEMBERS</span>
                <strong className="text-pirate-parchment text-xs block">{team.member1_name}</strong>
                <strong className="text-pirate-parchment text-xs block">{team.member2_name}</strong>
                <span className="text-[10px] text-pirate-parchmentDark block">({team.college})</span>
              </div>

              <div className="bg-pirate-coffee border border-pirate-wood p-4 rounded-xl">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-pirate-gold" />
                <span className="text-pirate-parchmentDark block">TOTAL TREASURE POINTS</span>
                <strong className="text-pirate-gold text-base font-black">{team.total_score || 0} PTS</strong>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-pirate-gold via-yellow-400 to-pirate-gold hover:from-yellow-400 hover:to-pirate-gold text-pirate-dark font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(212,175,55,0.5)] uppercase tracking-wider flex items-center justify-center space-x-2 mx-auto font-mono"
              >
                <Trophy className="w-5 h-5 text-pirate-dark" />
                <span>VIEW CAPTAIN'S LOG LEADERBOARD</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          /* PRIMARY MAP PAGE VIEW (Shows All 7 Stage Islands on the Map) */
          <div className="space-y-6">
            <StageNavigation
              currentStage={currentStage}
              totalStages={7}
              isCompleted={isCompleted}
              onSelectStage={handleSelectStageFromMap}
            />

            {/* Quick Helper Banner */}
            <div className="bg-pirate-espresso p-4 rounded-2xl border border-pirate-gold/40 flex items-center justify-between text-xs font-mono">
              <span className="text-pirate-parchment">
                📍 Currently Unlocked: <strong className="text-yellow-300">Island #{currentStage}</strong>. Click Island #{currentStage} on the map above to solve the trial.
              </span>
              <button
                type="button"
                onClick={() => handleSelectStageFromMap(currentStage)}
                className="px-4 py-2 bg-pirate-gold hover:bg-yellow-400 text-pirate-dark font-black rounded-xl transition-all uppercase tracking-wider text-[11px]"
              >
                SOLVE ISLAND #{currentStage} ➔
              </button>
            </div>
          </div>
        ) : (
          /* STAGE PUZZLE PAGE VIEW */
          <div className="space-y-4 font-mono">
            {/* Back to Pirate Map Navigation Bar */}
            <div className="flex items-center justify-between bg-pirate-espresso p-3.5 rounded-2xl border border-pirate-wood">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className="px-4 py-2 bg-pirate-coffee hover:bg-pirate-wood text-pirate-gold border border-pirate-gold/50 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>RETURN TO PIRATE VOYAGE MAP</span>
              </button>

              <span className="text-xs text-amber-300 font-bold">
                ISLAND #{activeStageNum} TRIAL
              </span>
            </div>

            {/* Active Island Puzzle Component */}
            {renderCurrentStageComponent()}
          </div>
        )}

      </main>

      {/* Modals */}
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />

      <footer className="text-center py-4 text-xs text-pirate-parchmentDark font-mono border-t border-pirate-coffee bg-pirate-espresso">
        NIFT-TEA COLLEGE OF KNITWEAR FASHION | IGNEXIA 2026 DIGITAL TREASURE HUNT &copy; Dept. of CS
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
