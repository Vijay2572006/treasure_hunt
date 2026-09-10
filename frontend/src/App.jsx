import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StageNavigation } from './components/StageNavigation';
import { AdminDashboard } from './components/AdminDashboard';
import { Trophy, Compass, ShieldCheck, Skull, ArrowRight } from 'lucide-react';

// Puzzle Components
import { Stage1Audio } from './puzzles/Stage1Audio';
import { Stage2Osint } from './puzzles/Stage2Osint';
import { Stage3Metadata } from './puzzles/Stage3Metadata';
import { Stage4Rebus } from './puzzles/Stage4Rebus';
import { Stage5Inspect } from './puzzles/Stage5Inspect';
import { Stage6Social } from './puzzles/Stage6Social';
import { Stage7Master } from './puzzles/Stage7Master';

export default function App() {
  const { team, stageData, token, loading, refreshStageData } = useAuth();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'map' | 'puzzle'
  const [activeStage, setActiveStage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  // Handle initial view state based on authentication
  useEffect(() => {
    if (token && team) {
      if (team.is_completed) {
        setViewMode('map');
      } else {
        setViewMode('map');
      }
    } else {
      setViewMode('landing');
    }
  }, [token, team]);

  // Sync active stage with team current stage when stageData updates
  useEffect(() => {
    if (stageData && !stageData.is_completed) {
      setActiveStage(stageData.current_stage);
    }
  }, [stageData]);

  const currentStage = team?.current_stage || 1;
  const isCompleted = team?.is_completed || false;

  const handleCustomSubmit = async (key) => {
    const { submitKey } = useAuth.getState ? useAuth.getState() : {};
    return { correct: false, message: 'Submitting...' };
  };

  const handleSelectStageFromMap = (stageNum) => {
    if (stageNum <= currentStage) {
      setActiveStage(stageNum);
      setViewMode('puzzle');
    }
  };

  const handleStageSuccess = async (resMessage) => {
    setToastMessage(resMessage || "Island Cleared! Returning to Voyage Map...");
    setTimeout(async () => {
      setToastMessage('');
      await refreshStageData();
      setViewMode('map');
    }, 1800);
  };

  const renderActivePuzzle = () => {
    const stageNum = activeStage;
    switch (stageNum) {
      case 1: return <Stage1Audio onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 2: return <Stage2Osint onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 3: return <Stage3Metadata onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 4: return <Stage4Rebus onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 5: return <Stage5Inspect onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 6: return <Stage6Social onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Passkey Key.";
          return { correct: false, message: errMsg };
        }
      }} />;
      case 7: return <Stage7Master onCustomSubmit={async (key) => {
        const { api } = await import('./services/api');
        try {
          const res = await api.submitAnswer(key);
          handleStageSuccess(res.message);
          return { correct: true, message: res.message };
        } catch (err) {
          const errMsg = err.response?.data?.error || "Incorrect Master Passkey.";
          return { correct: false, message: errMsg };
        }
      }} />;
      default: return <Stage1Audio />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pirate-dark flex items-center justify-center font-serif text-pirate-parchment">
        <div className="text-center space-y-3 font-mono">
          <Compass className="w-10 h-10 animate-spin mx-auto text-pirate-gold" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-pirate-gold">SETTING SAIL...</h2>
          <p className="text-xs text-pirate-parchmentDark">IGNEXIA 2026 DIGITAL TREASURE HUNT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pirate-dark text-pirate-parchment font-serif flex flex-col selection:bg-pirate-gold selection:text-pirate-dark">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-pirate-gold text-pirate-dark px-6 py-3 rounded-2xl font-mono font-extrabold text-sm shadow-[0_0_30px_rgba(212,175,55,0.8)] border-2 border-white animate-bounce flex items-center space-x-2">
          <Trophy className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <Navbar
        onGoHome={() => setViewMode(token ? 'map' : 'landing')}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {!token || viewMode === 'landing' ? (
          <LandingPage
            onOpenRegister={() => setIsAuthOpen(true)}
            onOpenLogin={() => setIsAuthOpen(true)}
          />
        ) : isCompleted ? (
          /* Event Completion Victory Banner Page */
          <div className="bg-pirate-espresso border-4 border-pirate-gold rounded-3xl p-8 shadow-[0_0_60px_rgba(212,175,55,0.4)] text-center space-y-6 max-w-3xl mx-auto my-8">
            <div className="w-20 h-20 mx-auto bg-pirate-gold text-pirate-dark rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono text-pirate-gold uppercase tracking-widest block mb-1">
                VICTORY UNLOCKED 🪙
              </span>
              <h2 className="text-3xl font-black text-pirate-gold uppercase font-mono tracking-wider">
                ALL 7 ISLANDS CONQUERED!
              </h2>
              <p className="text-sm font-sans text-pirate-parchment max-w-md mx-auto mt-2 leading-relaxed font-semibold">
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
          </div>
        ) : (
          /* STAGE PUZZLE PAGE VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between font-mono text-xs bg-pirate-espresso p-3 rounded-2xl border border-pirate-wood">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className="px-4 py-2 bg-pirate-coffee hover:bg-[#5c381e] text-pirate-gold border border-pirate-gold/40 rounded-xl font-bold transition-all flex items-center space-x-1.5"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>RETURN TO VOYAGE MAP</span>
              </button>

              <span className="text-pirate-parchmentDark">
                STAGE <strong className="text-pirate-gold">{activeStage}</strong> OF 7
              </span>
            </div>

            {renderActivePuzzle()}
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="border-t border-pirate-wood py-4 px-4 text-center text-[10px] font-mono text-pirate-parchmentDark bg-pirate-espresso">
        NIFT-TEA COLLEGE OF KNITWEAR FASHION | IGNEXIA 2026 DIGITAL TREASURE HUNT &copy; Dept. of CS
      </footer>

      {/* Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Captain Admin Dashboard Modal (PIN Authenticated) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
