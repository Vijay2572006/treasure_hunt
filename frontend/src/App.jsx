import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StageNavigation } from './components/StageNavigation';
import { AdminDashboard } from './components/AdminDashboard';

import { Stage1Audio } from './puzzles/Stage1Audio';
import { Stage2Osint } from './puzzles/Stage2Osint';
import { Stage3Metadata } from './puzzles/Stage3Metadata';
import { Stage4Rebus } from './puzzles/Stage4Rebus';
import { Stage5Inspect } from './puzzles/Stage5Inspect';
import { Stage6Social } from './puzzles/Stage6Social';
import { Stage7Master } from './puzzles/Stage7Master';

import { HelpCircle, ShieldCheck, Compass, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

const MainContent = () => {
  const { team, stageData, loading, error, submitKey } = useAuth();
  const [landingViewState, setLandingViewState] = useState('landing'); // 'landing' | 'register'
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
        
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
        />

        <footer className="text-center py-4 text-xs text-pirate-parchmentDark font-mono border-t border-pirate-coffee bg-pirate-espresso">
          NIFT-TEA COLLEGE OF KNITWEAR FASHION | IGNEXIA 2026 DIGITAL TREASURE HUNT &copy; Dept. of CS
        </footer>
      </div>
    );
  }

  // Logged in Team View
  const currentStage = team.current_stage;
  const isCompleted = team.is_completed;

  // Custom stage submit handler with 1.8s map redirection
  const handleStageSubmit = async (key) => {
    const res = await submitKey(key);
    if (res.correct) {
      setStageSuccessNotice(`Correct Decryption Key! Unlocking next island on Pirate Voyage Map...`);
      setTimeout(() => {
        setStageSuccessNotice('');
        setViewMode('map');
      }, 1800);
    }
    return res;
  };

  const handleSelectStageFromMap = (stageNum) => {
    setActiveStageNum(stageNum);
    setViewMode('stage');
  };

  // Active Stage Component Selector
  const renderCurrentStageComponent = () => {
    switch (activeStageNum) {
      case 1:
        return <Stage1Audio onCustomSubmit={handleStageSubmit} />;
      case 2:
        return <Stage2Osint onCustomSubmit={handleStageSubmit} />;
      case 3:
        return <Stage3Metadata onCustomSubmit={handleStageSubmit} />;
      case 4:
        return <Stage4Rebus onCustomSubmit={handleStageSubmit} />;
      case 5:
        return <Stage5Inspect onCustomSubmit={handleStageSubmit} />;
      case 6:
        return <Stage6Social onCustomSubmit={handleStageSubmit} />;
      case 7:
        return <Stage7Master onCustomSubmit={handleStageSubmit} />;
      default:
        return <Stage1Audio onCustomSubmit={handleStageSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between selection:bg-pirate-gold selection:text-black font-serif">
      <Navbar
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onGoHome={() => setLandingViewState('landing')}
      />

      <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        
        {/* Stage Completion Redirection Banner Notice */}
        {stageSuccessNotice && (
          <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-300 font-mono text-xs font-bold flex items-center justify-between shadow-2xl animate-bounce">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{stageSuccessNotice}</span>
            </div>
            <span className="text-[10px] text-emerald-400">REDIRECTING TO VOYAGE MAP ➔</span>
          </div>
        )}

        {/* Global Victory Banner when all 7 stages completed */}
        {isCompleted ? (
          <div className="bg-pirate-espresso border-4 border-pirate-gold rounded-3xl p-8 shadow-2xl text-center space-y-4 font-mono">
            <div className="w-20 h-20 mx-auto bg-pirate-coffee border-2 border-pirate-gold rounded-full flex items-center justify-center text-pirate-gold shadow-[0_0_30px_rgba(212,175,55,0.5)] animate-pulse">
              <ShieldCheck className="w-10 h-10 text-yellow-300" />
            </div>

            <h2 className="text-3xl font-black text-pirate-gold uppercase tracking-wider">
              VICTORY & CONGRATULATIONS! 🪙🏴‍☠️
            </h2>

            <p className="text-sm text-pirate-parchment max-w-2xl mx-auto leading-relaxed">
              All Hail Captain <strong className="text-pirate-gold">{team.team_name}</strong>! You have conquered all 7 Islands of IGNEXIA 2026 and unlocked the Golden Treasure Point!
            </p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className="px-8 py-3 bg-pirate-gold hover:bg-yellow-400 text-pirate-dark font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                VIEW VOYAGE MAP & TREASURE ➔
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

      {/* Admin Dashboard Modal */}
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
