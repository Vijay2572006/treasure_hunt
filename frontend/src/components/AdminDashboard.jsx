import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, Users, Trash2, RefreshCw, X, Search, Trophy, Edit3, Save, Check, AlertCircle, Compass, Clock, Award, Hash, Pause, Play, Download, RotateCcw, FileText, Activity, BookOpen, Layers, Eye } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../services/api';

export const AdminDashboard = ({ isOpen, onClose }) => {
  const [adminPin, setAdminPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('cyberquest_admin_token') || '');
  const [activeTab, setActiveTab] = useState('questions'); // Default to Questions Directory
  
  const [teams, setTeams] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [submissionLogs, setSubmissionLogs] = useState([]);
  const [hintLogs, setHintLogs] = useState([]);
  const [isEventPaused, setIsEventPaused] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for Stage Question Manager
  const [editingStageNum, setEditingStageNum] = useState(1);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    key: '',
    points: 500,
    description: '',
    hint1: '',
    hint2: '',
    hint3: ''
  });

  // Editing state for Team Member/Score Manager
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({
    team_name: '',
    college: '',
    member1_name: '',
    member1_mobile: '',
    member1_email: '',
    member2_name: '',
    member2_mobile: '',
    member2_email: '',
    current_stage: 1,
    total_score: 0
  });

  useEffect(() => {
    if (isOpen && adminToken) {
      setIsAuthenticated(true);
      fetchAllAdminData(adminToken);
    }
  }, [isOpen, adminToken]);

  const handleAdminAuthenticate = (e) => {
    if (e) e.preventDefault();
    if (!adminPin.trim()) return;

    setError('');
    setIsAuthenticated(true);
    setAdminToken("IGNEXIA_ADMIN_SECURE_TOKEN_9999");
    localStorage.setItem('cyberquest_admin_token', "IGNEXIA_ADMIN_SECURE_TOKEN_9999");
    fetchAllAdminData("IGNEXIA_ADMIN_SECURE_TOKEN_9999");
  };

  const fetchAllAdminData = async (tokenStr) => {
    setLoading(true);
    try {
      // Fetch Teams Roster
      const teamsRes = await axios.get(`${API_BASE}/admin/teams/`);
      setTeams(teamsRes.data.teams || []);

      // Fetch Leaderboard
      const lbRes = await axios.get(`${API_BASE}/leaderboard/`);
      setLeaderboard(lbRes.data.leaderboard || []);

      // Fetch Puzzles Configuration
      const puzRes = await axios.get(`${API_BASE}/admin/puzzles/`);
      const puzzleList = puzRes.data.puzzles || [];
      setPuzzles(puzzleList);

      // Fetch Audit Logs
      const logsRes = await axios.get(`${API_BASE}/admin/logs/`);
      setSubmissionLogs(logsRes.data.submission_logs || []);
      setHintLogs(logsRes.data.hint_logs || []);
      setIsEventPaused(logsRes.data.is_event_paused || false);

      if (puzzleList.length > 0) {
        loadStageIntoEditForm(1, puzzleList);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStageIntoEditForm = (stageNum, puzzleList = puzzles) => {
    setEditingStageNum(stageNum);
    const target = puzzleList.find(p => p.stage_num === stageNum);
    if (target) {
      setEditForm({
        title: target.title || '',
        category: target.category || '',
        key: target.key || '',
        points: target.points || 500,
        description: target.description || '',
        hint1: target.hint1 || '',
        hint2: target.hint2 || '',
        hint3: target.hint3 || ''
      });
    }
  };

  const handleSaveStageQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.put(`${API_BASE}/admin/puzzles/${editingStageNum}/`, editForm);

      setSuccessMsg(`Stage #${editingStageNum} question, points (${editForm.points} PTS), and passphrase updated successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchAllAdminData(adminToken);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update stage question.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEventPause = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/event/toggle-pause/`);
      setIsEventPaused(res.data.is_paused);
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert("Failed to toggle event pause status.");
    }
  };

  const openTeamEditModal = (t) => {
    setEditingTeam(t);
    setTeamForm({
      team_name: t.team_name,
      college: t.college,
      member1_name: t.member1_name,
      member1_mobile: t.member1_mobile,
      member1_email: t.member1_email,
      member2_name: t.member2_name,
      member2_mobile: t.member2_mobile,
      member2_email: t.member2_email,
      current_stage: t.current_stage,
      total_score: t.total_score
    });
  };

  const handleSaveTeamEdit = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      await axios.put(`${API_BASE}/admin/teams/${editingTeam.id}/edit/`, teamForm);
      setEditingTeam(null);
      setSuccessMsg(`Team "${teamForm.team_name}" updated successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchAllAdminData(adminToken);
    } catch (err) {
      alert("Failed to update team details.");
    }
  };

  const handleResetTeamProgress = async (teamId, teamName) => {
    if (!window.confirm(`Reset stage progress for team "${teamName}" back to Island #1?`)) return;

    try {
      await axios.post(`${API_BASE}/admin/teams/${teamId}/reset/`);
      setSuccessMsg(`Team "${teamName}" progress reset to Island #1.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchAllAdminData(adminToken);
    } catch (err) {
      alert("Failed to reset team progress.");
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}" from the hunt database?`)) return;

    try {
      await axios.delete(`${API_BASE}/admin/teams/${teamId}/`);
      fetchAllAdminData(adminToken);
    } catch (err) {
      alert("Failed to delete team.");
    }
  };

  const handleExportCSV = () => {
    if (teams.length === 0) return alert("No participant records to export.");
    let csv = "Rank,Team Name,College,Member 1 Name,Member 1 Mobile,Member 1 Email,Member 2 Name,Member 2 Mobile,Member 2 Email,Current Stage,Total Score,Time\n";
    teams.forEach((t, i) => {
      csv += `${i + 1},"${t.team_name}","${t.college}","${t.member1_name}","${t.member1_mobile}","${t.member1_email}","${t.member2_name}","${t.member2_mobile}","${t.member2_email}",${t.current_stage},${t.total_score},"${t.formatted_time}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IGNEXIA_2026_PARTICIPANTS_ROSTER.csv`;
    a.click();
  };

  const handleResetEntireEvent = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to CLEAR ALL registered teams, scores, and leaderboard logs? This action cannot be undone!")) return;

    try {
      await axios.post(`${API_BASE}/admin/event/reset-all/`);
      setSuccessMsg("All leaderboard details, scores, and registered crews have been cleared successfully!");
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchAllAdminData(adminToken);
    } catch (err) {
      alert("Failed to clear leaderboard details.");
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    setAdminPin('');
    localStorage.removeItem('cyberquest_admin_token');
  };

  if (!isOpen) return null;

  const filteredTeams = teams.filter(t => 
    t.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.member1_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.member2_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.member1_mobile.includes(searchQuery)
  );

  const totalTeams = teams.length;
  const completedTeamsCount = teams.filter(t => t.is_completed).length;
  const highestScore = teams.reduce((max, t) => (t.total_score > max ? t.total_score : max), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-serif">
      <div className="bg-[#dfc9ab] border-4 border-[#8b5a2b] rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-[0_0_70px_rgba(0,0,0,0.9)] overflow-hidden text-[#23140c]">
        
        {/* Admin Header */}
        <div className="p-5 bg-[#3e2414] border-b-2 border-[#8b5a2b] flex items-center justify-between font-mono text-[#f4e8d3]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#140c08] border border-[#d4af37] rounded-xl text-yellow-300">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-yellow-300 uppercase tracking-wider">
                CAPTAIN ADMIN DASHBOARD 🔐
              </h2>
              <span className="text-[10px] text-[#d9c4a5]">
                ALL 7 STAGES QUESTION DIRECTORY & AUDIT CONTROL SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={handleResetEntireEvent}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/60 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                  title="Purge all teams, scores, and leaderboard logs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>FLUSH LEADERBOARD 🧹</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleEventPause}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all ${
                    isEventPaused
                      ? 'bg-emerald-700 text-white animate-pulse'
                      : 'bg-amber-600 text-black hover:bg-amber-500'
                  }`}
                  title="Pause/Resume Event Submissions"
                >
                  {isEventPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isEventPaused ? 'RESUME EVENT ▶' : 'FREEZE EVENT ⏸'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-[#140c08] hover:bg-[#5c381e] text-yellow-300 border border-[#d4af37]/50 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => fetchAllAdminData(adminToken)}
                  disabled={loading}
                  className="p-2 bg-[#140c08] hover:bg-[#5c381e] text-yellow-300 border border-[#d4af37]/50 rounded-xl transition-all"
                  title="Refresh Event Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="px-3 py-1.5 bg-[#140c08] hover:bg-red-950 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all"
                >
                  LOCK ADMIN
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-[#140c08] hover:bg-red-950 text-[#d9c4a5] hover:text-red-400 border border-[#8b5a2b] rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTICATION PROMPT */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full text-center space-y-5 my-auto">
            <div className="w-16 h-16 mx-auto bg-[#3e2414] border-2 border-[#d4af37] rounded-full flex items-center justify-center text-yellow-300 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <Lock className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-black font-mono text-[#3e2414] uppercase tracking-wider">
                SECURED ADMIN AUTHENTICATION
              </h3>
              <p className="text-xs font-mono text-[#5c381e] mt-1">
                Enter Admin Security PIN to access participant records and question management.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/90 border border-red-500 rounded-xl text-red-300 text-xs font-mono flex items-center space-x-2 font-bold text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminAuthenticate} className="space-y-4 font-mono">
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3.5 text-[#d4af37]" />
                <input
                  type="password"
                  placeholder=""
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full bg-black border-2 border-[#8b5a2b] rounded-xl pl-9 pr-3 py-3 text-center text-sm font-bold text-yellow-300 focus:outline-none focus:border-yellow-400 uppercase tracking-widest font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] uppercase tracking-wider"
              >
                ENTER ADMIN PANEL 🔓
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN PANEL CONTENT */
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Event Summary Overview Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#140c08] p-3 border-b-2 border-[#8b5a2b] text-[#f4e8d3] font-mono text-xs">
              <div className="bg-[#24150c] p-2.5 rounded-xl border border-[#8b5a2b] text-center">
                <span className="text-[10px] text-[#d9c4a5] block uppercase">REGISTERED CREWS</span>
                <strong className="text-yellow-300 text-sm font-extrabold">{totalTeams} CREWS</strong>
              </div>

              <div className="bg-[#24150c] p-2.5 rounded-xl border border-[#8b5a2b] text-center">
                <span className="text-[10px] text-[#d9c4a5] block uppercase">COMPLETED ALL 7 STAGES</span>
                <strong className="text-emerald-400 text-sm font-extrabold">{completedTeamsCount} FINISHED 🪙</strong>
              </div>

              <div className="bg-[#24150c] p-2.5 rounded-xl border border-[#8b5a2b] text-center">
                <span className="text-[10px] text-[#d9c4a5] block uppercase">TOTAL STAGES</span>
                <strong className="text-yellow-400 text-sm font-extrabold">7 ISLAND STAGES</strong>
              </div>

              <div className="bg-[#24150c] p-2.5 rounded-xl border border-[#8b5a2b] text-center">
                <span className="text-[10px] text-[#d9c4a5] block uppercase">EVENT STATUS</span>
                <strong className={isEventPaused ? "text-red-400 font-extrabold text-xs uppercase" : "text-emerald-400 font-extrabold text-xs uppercase"}>
                  {isEventPaused ? 'PAUSED ⏸' : 'LIVE ACTIVE ▶'}
                </strong>
              </div>
            </div>

            {/* Admin Dashboard Tab Selector Bar */}
            <div className="flex border-b-2 border-[#8b5a2b] bg-[#24150c] font-mono text-xs text-[#f4e8d3]">
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`flex-1 py-3 px-3 font-bold flex items-center justify-center space-x-1.5 border-r border-[#8b5a2b] transition-colors ${
                  activeTab === 'questions'
                    ? 'bg-[#dfc9ab] text-[#3e2414] font-black'
                    : 'hover:bg-[#3e2414] text-[#d9c4a5]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-yellow-300" />
                <span>ALL STAGES QUESTIONS & KEYS DIRECTORY</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('participants')}
                className={`flex-1 py-3 px-3 font-bold flex items-center justify-center space-x-1.5 border-r border-[#8b5a2b] transition-colors ${
                  activeTab === 'participants'
                    ? 'bg-[#dfc9ab] text-[#3e2414] font-black'
                    : 'hover:bg-[#3e2414] text-[#d9c4a5]'
                }`}
              >
                <Users className="w-4 h-4 text-yellow-400" />
                <span>ROSTER & TEAM EDIT</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`flex-1 py-3 px-3 font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  activeTab === 'logs'
                    ? 'bg-[#dfc9ab] text-[#3e2414] font-black'
                    : 'hover:bg-[#3e2414] text-[#d9c4a5]'
                }`}
              >
                <Activity className="w-4 h-4 text-yellow-300" />
                <span>AUDIT LOGS</span>
              </button>
            </div>

            {/* TAB 1: ALL STAGES QUESTIONS & KEYS DIRECTORY */}
            {activeTab === 'questions' && (
              <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-6">
                
                {/* Section Header */}
                <div className="bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-xs uppercase text-yellow-300">
                      ALL 7 ISLAND STAGES QUESTIONS, POINTS & KEYS DIRECTORY
                    </span>
                  </div>
                  <span className="text-[10px] text-[#d9c4a5]">7 ACTIVE STAGE PAYLOADS</span>
                </div>

                {/* 7 STAGES SUMMARY OVERVIEW CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {puzzles.map((p) => {
                    const isSelected = editingStageNum === p.stage_num;
                    return (
                      <div
                        key={p.stage_num}
                        onClick={() => loadStageIntoEditForm(p.stage_num)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between font-mono space-y-3 ${
                          isSelected
                            ? 'bg-[#3e2414] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-[1.02]'
                            : 'bg-[#24150c] hover:bg-[#3e2414]/80 border-[#8b5a2b] text-[#f4e8d3]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#140c08] border border-[#d4af37] text-yellow-300 font-black text-xs">
                              ISLAND #{p.stage_num}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-black text-[10px]">
                              {p.points || 500} PTS
                            </span>
                          </div>

                          <h4 className="text-yellow-300 font-extrabold text-sm block mb-1">
                            {p.title}
                          </h4>
                          <span className="text-[10px] text-[#d9c4a5] block font-bold mb-2">
                            {p.category}
                          </span>

                          <div className="bg-[#140c08] p-2.5 rounded-xl border border-[#8b5a2b] text-[10px] space-y-1 my-2">
                            <div>PASSPHRASE KEY: <strong className="text-yellow-300 font-mono tracking-widest">{p.key}</strong></div>
                          </div>

                          <p className="text-[10px] text-[#d9c4a5] line-clamp-3 italic">
                            "{p.description}"
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#8b5a2b]/50 flex items-center justify-between text-[10px]">
                          <span className="text-yellow-400 font-bold flex items-center space-x-1">
                            <Edit3 className="w-3 h-3" />
                            <span>CLICK TO EDIT STAGE</span>
                          </span>
                          <Eye className="w-3.5 h-3.5 text-[#d9c4a5]" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status Messages */}
                {successMsg && (
                  <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-950/90 border border-red-500 rounded-xl text-red-300 font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Stage Question & Points Edit Form */}
                <form onSubmit={handleSaveStageQuestion} className="bg-[#24150c] p-6 rounded-2xl border-4 border-[#8b5a2b] space-y-4 text-[#f4e8d3] shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#8b5a2b] pb-3">
                    <span className="font-bold text-yellow-300 uppercase flex items-center space-x-2 text-sm">
                      <Edit3 className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <span>EDITING STAGE #{editingStageNum} QUESTION, POINTS & PASSPHRASE</span>
                    </span>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] font-black rounded-xl transition-all shadow-md uppercase tracking-wider flex items-center space-x-1.5 text-xs font-mono"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'SAVING...' : 'SAVE STAGE CHANGES'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-[#d9c4a5] uppercase mb-1">STAGE TITLE:</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-2 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#d9c4a5] uppercase mb-1">STAGE PASSPHRASE (KEY):</label>
                      <input
                        type="text"
                        value={editForm.key}
                        onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                        className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-2 text-xs text-yellow-300 uppercase font-mono font-bold focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-yellow-300 uppercase mb-1 font-bold">STAGE POINTS (PTS):</label>
                      <input
                        type="number"
                        value={editForm.points}
                        onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                        className="w-full bg-black border-2 border-yellow-400 rounded-xl px-3 py-2 text-xs text-yellow-300 font-mono font-bold focus:outline-none focus:border-yellow-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#d9c4a5] uppercase mb-1">CATEGORY:</label>
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-2 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#d9c4a5] uppercase mb-1">QUESTION DESCRIPTION & BRIEFING:</label>
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-black border border-[#8b5a2b] rounded-xl p-3 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#8b5a2b]/50">
                    <span className="text-[10px] text-yellow-300 font-bold uppercase block">INDIRECT HINTS CONFIGURATION:</span>
                    <div>
                      <label className="block text-[10px] text-[#d9c4a5]">HINT 1 (Auto @ 3 Min):</label>
                      <input
                        type="text"
                        value={editForm.hint1}
                        onChange={(e) => setEditForm({ ...editForm, hint1: e.target.value })}
                        className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#d9c4a5]">HINT 2 (Auto @ 6 Min):</label>
                      <input
                        type="text"
                        value={editForm.hint2}
                        onChange={(e) => setEditForm({ ...editForm, hint2: e.target.value })}
                        className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#d9c4a5]">HINT 3 (Auto @ 9 Min):</label>
                      <input
                        type="text"
                        value={editForm.hint3}
                        onChange={(e) => setEditForm({ ...editForm, hint3: e.target.value })}
                        className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] font-black rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] uppercase tracking-wider flex items-center space-x-2 text-xs font-mono"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'SAVING...' : 'SAVE STAGE CHANGES'}</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB 2: PARTICIPANTS ROSTER & TEAM EDIT */}
            {activeTab === 'participants' && (
              <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4">
                
                {successMsg && (
                  <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-xs uppercase text-yellow-300">
                      PARTICIPANTS REGISTERED ROSTER
                    </span>
                  </div>

                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#d4af37]" />
                    <input
                      type="text"
                      placeholder="Search team, college, name, mobile..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-[#8b5a2b] rounded-xl pl-9 pr-3 py-2 text-xs text-yellow-300 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* Team Detail Editor Modal */}
                {editingTeam && (
                  <form onSubmit={handleSaveTeamEdit} className="bg-[#24150c] p-5 rounded-2xl border-2 border-yellow-400 space-y-4 text-[#f4e8d3]">
                    <div className="flex items-center justify-between border-b border-[#8b5a2b] pb-2">
                      <span className="font-bold text-yellow-300 uppercase flex items-center space-x-2">
                        <Edit3 className="w-4 h-4 text-yellow-400" />
                        <span>EDITING CREW DETAILS: {editingTeam.team_name}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditingTeam(null)}
                        className="text-xs text-red-400 hover:underline font-bold"
                      >
                        CANCEL EDIT
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">TEAM NAME:</label>
                        <input
                          type="text"
                          value={teamForm.team_name}
                          onChange={(e) => setTeamForm({ ...teamForm, team_name: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">COLLEGE NAME:</label>
                        <input
                          type="text"
                          value={teamForm.college}
                          onChange={(e) => setTeamForm({ ...teamForm, college: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">MEMBER 1 NAME:</label>
                        <input
                          type="text"
                          value={teamForm.member1_name}
                          onChange={(e) => setTeamForm({ ...teamForm, member1_name: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">MEMBER 1 MOBILE:</label>
                        <input
                          type="text"
                          value={teamForm.member1_mobile}
                          onChange={(e) => setTeamForm({ ...teamForm, member1_mobile: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">MEMBER 2 NAME:</label>
                        <input
                          type="text"
                          value={teamForm.member2_name}
                          onChange={(e) => setTeamForm({ ...teamForm, member2_name: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#d9c4a5]">MEMBER 2 MOBILE:</label>
                        <input
                          type="text"
                          value={teamForm.member2_mobile}
                          onChange={(e) => setTeamForm({ ...teamForm, member2_mobile: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-yellow-300 font-bold">CURRENT STAGE (1-8):</label>
                        <input
                          type="number"
                          value={teamForm.current_stage}
                          onChange={(e) => setTeamForm({ ...teamForm, current_stage: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-yellow-300 font-bold">TOTAL SCORE (PTS):</label>
                        <input
                          type="number"
                          value={teamForm.total_score}
                          onChange={(e) => setTeamForm({ ...teamForm, total_score: e.target.value })}
                          className="w-full bg-black border border-[#8b5a2b] rounded-xl px-3 py-1.5 text-xs text-yellow-300 font-bold"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-[#d4af37] via-yellow-400 to-[#d4af37] text-[#140c08] font-black rounded-xl text-xs uppercase"
                      >
                        SAVE CREW DETAILS
                      </button>
                    </div>
                  </form>
                )}

                {filteredTeams.length === 0 ? (
                  <div className="text-center py-12 text-[#5c381e] italic">
                    No participant records found.
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3]">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                      <thead>
                        <tr className="border-b border-[#8b5a2b] text-yellow-300 uppercase text-[10px] tracking-wider">
                          <th className="pb-3">#</th>
                          <th className="pb-3">TEAM NAME & COLLEGE</th>
                          <th className="pb-3">CREW MEMBER 1</th>
                          <th className="pb-3">CREW MEMBER 2</th>
                          <th className="pb-3 text-center">ISLAND</th>
                          <th className="pb-3 text-center">SCORE</th>
                          <th className="pb-3 text-center">REGISTERED TIME</th>
                          <th className="pb-3 text-right">ADMIN ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#8b5a2b]/40">
                        {filteredTeams.map((t, idx) => (
                          <tr key={t.id} className="hover:bg-[#3e2414]/60 transition-colors">
                            <td className="py-3 font-bold text-yellow-300">{idx + 1}</td>
                            <td className="py-3">
                              <strong className="text-yellow-300 text-xs block font-extrabold">{t.team_name}</strong>
                              <span className="text-[10px] text-[#d9c4a5] block">{t.college}</span>
                            </td>
                            <td className="py-3">
                              <div className="font-bold text-pirate-parchment">{t.member1_name}</div>
                              <div className="text-[10px] text-[#d9c4a5]">📞 +91 {t.member1_mobile}</div>
                              <div className="text-[10px] text-[#d9c4a5]">✉️ {t.member1_email}</div>
                            </td>
                            <td className="py-3">
                              <div className="font-bold text-pirate-parchment">{t.member2_name}</div>
                              <div className="text-[10px] text-[#d9c4a5]">📞 +91 {t.member2_mobile}</div>
                              <div className="text-[10px] text-[#d9c4a5]">✉️ {t.member2_email}</div>
                            </td>
                            <td className="py-3 text-center font-bold text-amber-300">
                              {t.is_completed ? 'TREASURE 🪙' : `ISLAND ${t.current_stage}`}
                            </td>
                            <td className="py-3 text-center font-black text-yellow-300 text-sm">
                              {t.total_score} PTS
                            </td>
                            <td className="py-3 text-center text-[10px] text-[#d9c4a5]">
                              {t.start_time}
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => openTeamEditModal(t)}
                                  title="Edit Team Details"
                                  className="p-1.5 bg-[#3e2414] hover:bg-[#5c381e] text-yellow-300 border border-[#d4af37]/60 rounded-lg transition-all"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResetTeamProgress(t.id, t.team_name)}
                                  title="Reset Progress to Island 1"
                                  className="p-1.5 bg-[#3e2414] hover:bg-amber-900 text-amber-300 border border-amber-500/60 rounded-lg transition-all"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTeam(t.id, t.team_name)}
                                  title="Delete Team Record"
                                  className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AUDIT LOGS & EVENT ACTIVITY */}
            {activeTab === 'logs' && (
              <div className="p-6 overflow-y-auto flex-1 font-mono text-xs space-y-4">
                <div className="bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-xs uppercase text-yellow-300">
                      LIVE SUBMISSION ATTEMPTS & HINT AUDIT LOGS
                    </span>
                  </div>
                  <span className="text-[10px] text-[#d9c4a5]">RECENT ATTEMPTS: {submissionLogs.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Submission Attempts Table */}
                  <div className="bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3] space-y-3">
                    <h4 className="text-xs font-bold text-yellow-300 uppercase border-b border-[#8b5a2b] pb-2">
                      SUBMISSION ATTEMPTS LOG
                    </h4>
                    {submissionLogs.length === 0 ? (
                      <div className="text-center py-6 text-[#d9c4a5] italic">No submissions logged yet.</div>
                    ) : (
                      <div className="overflow-y-auto max-h-[350px] space-y-2">
                        {submissionLogs.map((log) => (
                          <div key={log.id} className="p-2.5 bg-[#140c08] rounded-xl border border-[#8b5a2b]/50 text-[11px]">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-yellow-300">{log.team_name}</span>
                              <span className={log.is_correct ? 'text-emerald-400 font-black' : 'text-red-400 font-black'}>
                                {log.is_correct ? 'CORRECT ✓' : 'WRONG ✗'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#d9c4a5] mt-0.5">
                              Stage #{log.stage} | Key: <strong className="text-pirate-parchment">{log.submitted_key}</strong> | Time: {log.timestamp}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hint Requests Table */}
                  <div className="bg-[#24150c] p-4 rounded-2xl border-2 border-[#8b5a2b] text-[#f4e8d3] space-y-3">
                    <h4 className="text-xs font-bold text-yellow-300 uppercase border-b border-[#8b5a2b] pb-2">
                      HINT UNLOCKS LOG
                    </h4>
                    {hintLogs.length === 0 ? (
                      <div className="text-center py-6 text-[#d9c4a5] italic">No hint requests logged yet.</div>
                    ) : (
                      <div className="overflow-y-auto max-h-[350px] space-y-2">
                        {hintLogs.map((log) => (
                          <div key={log.id} className="p-2.5 bg-[#140c08] rounded-xl border border-[#8b5a2b]/50 text-[11px]">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-yellow-300">{log.team_name}</span>
                              <span className="text-amber-400">Hint #{log.hint_index}</span>
                            </div>
                            <div className="text-[10px] text-[#d9c4a5] mt-0.5">
                              Stage #{log.stage} | Penalty: +{log.penalty_seconds}s | Time: {log.timestamp}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
