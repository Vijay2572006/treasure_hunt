import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, User, Landmark, LogIn, UserPlus, AlertCircle, Phone, Mail, Skull, Users, CheckCircle2 } from 'lucide-react';

export const AuthModal = () => {
  const { register, login } = useAuth();
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'login'
  
  const [regData, setRegData] = useState({
    college: '',
    team_name: '',
    member1_name: '',
    member1_mobile: '',
    member1_email: '',
    member2_name: '',
    member2_mobile: '',
    member2_email: '',
    pin: ''
  });

  const [loginData, setLoginData] = useState({
    team_name: '',
    pin: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for sequential Enter key focus navigation
  const formRefs = {
    college: useRef(null),
    team_name: useRef(null),
    member1_name: useRef(null),
    member1_mobile: useRef(null),
    member1_email: useRef(null),
    member2_name: useRef(null),
    member2_mobile: useRef(null),
    member2_email: useRef(null),
    pin: useRef(null)
  };

  const loginRefs = {
    team_name: useRef(null),
    pin: useRef(null)
  };

  // Helper validation functions
  const isValidName = (name) => /^[a-zA-Z\s]{2,50}$/.test(name.trim());
  const isValidMobile = (mobile) => {
    const cleaned = mobile.replace(/[^0-9]/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleMobileInput = (field, value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setRegData(prev => ({ ...prev, [field]: digits }));
  };

  const handleNameInput = (field, value) => {
    const cleanName = value.replace(/[^a-zA-Z\s]/g, '');
    setRegData(prev => ({ ...prev, [field]: cleanName }));
  };

  // Enter Key Handler to auto-advance to next input field
  const handleKeyDown = (e, nextFieldRef, isFinal = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isFinal) {
        handleRegisterSubmit(e);
      } else if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const handleLoginKeyDown = (e, nextFieldRef, isFinal = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isFinal) {
        handleLoginSubmit(e);
      } else if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    // Strict Field Validations
    if (!regData.college.trim()) {
      setError('Please enter your College Name.');
      formRefs.college.current?.focus();
      return;
    }
    if (!regData.team_name.trim()) {
      setError('Please enter a Team Name.');
      formRefs.team_name.current?.focus();
      return;
    }

    // Member 1 Validation
    if (!isValidName(regData.member1_name)) {
      setError('Member 1 Name must contain alphabets only.');
      formRefs.member1_name.current?.focus();
      return;
    }
    if (!isValidMobile(regData.member1_mobile)) {
      setError('Member 1 Mobile must be a valid 10-digit Indian mobile number.');
      formRefs.member1_mobile.current?.focus();
      return;
    }
    if (!isValidEmail(regData.member1_email)) {
      setError('Please enter a valid Email ID for Member 1.');
      formRefs.member1_email.current?.focus();
      return;
    }

    // Member 2 Validation
    if (!isValidName(regData.member2_name)) {
      setError('Member 2 Name must contain alphabets only.');
      formRefs.member2_name.current?.focus();
      return;
    }
    if (!isValidMobile(regData.member2_mobile)) {
      setError('Member 2 Mobile must be a valid 10-digit Indian mobile number.');
      formRefs.member2_mobile.current?.focus();
      return;
    }
    if (!isValidEmail(regData.member2_email)) {
      setError('Please enter a valid Email ID for Member 2.');
      formRefs.member2_email.current?.focus();
      return;
    }

    // Security PIN Validation
    if (regData.pin.length !== 4 || !/^\d{4}$/.test(regData.pin)) {
      setError('Security PIN must be exactly 4 numeric digits.');
      formRefs.pin.current?.focus();
      return;
    }

    setLoading(true);
    const res = await register(regData);
    setLoading(false);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!loginData.team_name.trim()) {
      setError('Please enter your Registered Team Name.');
      loginRefs.team_name.current?.focus();
      return;
    }
    if (loginData.pin.length !== 4 || !/^\d{4}$/.test(loginData.pin)) {
      setError('PIN must be 4 numeric digits.');
      loginRefs.pin.current?.focus();
      return;
    }

    setLoading(true);
    const res = await login(loginData);
    setLoading(false);
    if (!res.success) {
      setError(res.error);
    }
  };

  // High contrast input style for crisp visibility
  const inputClass = "w-full bg-[#170e09] border border-pirate-gold/70 rounded-lg pl-9 pr-3 py-2.5 text-yellow-300 font-bold placeholder-amber-200/40 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-mono text-xs";
  const mobileInputClass = "w-full bg-[#170e09] border border-pirate-gold/70 rounded-lg pl-12 pr-3 py-2.5 text-yellow-300 font-bold placeholder-amber-200/40 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 font-mono text-xs tracking-wider";

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-pirate-espresso border-2 border-pirate-gold/70 rounded-2xl max-w-xl w-full p-6 shadow-[0_0_50px_rgba(212,175,55,0.3)] font-serif">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-pirate-coffee border border-pirate-gold rounded-xl flex items-center justify-center text-pirate-gold mb-3 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Skull className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black font-mono tracking-wider text-pirate-gold uppercase">
            IGNEXIA 2026
          </h2>
          <span className="inline-block mt-1 text-xs font-mono font-bold text-pirate-dark bg-pirate-gold px-3 py-1 rounded-full uppercase">
            DIGITAL TREASURE HUNT
          </span>
          <p className="text-xs text-pirate-parchmentDark font-mono mt-2">
            NIFT-TEA COLLEGE OF KNITWEAR FASHION | Dept. of CS
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-pirate-coffee p-1 rounded-xl border border-pirate-wood mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'register'
                ? 'bg-pirate-gold text-pirate-dark shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                : 'text-pirate-parchmentDark hover:text-pirate-parchment'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>PIRATE CREW REGISTRATION</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'login'
                ? 'bg-pirate-gold text-pirate-dark shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                : 'text-pirate-parchmentDark hover:text-pirate-parchment'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>RESUME VOYAGE</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-950/90 border border-red-500 rounded-lg text-red-200 text-xs flex items-start space-x-2.5 font-mono shadow-md">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-bold">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-mono">
            
            {/* General Team Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-pirate-gold font-bold mb-1">COLLEGE NAME *</label>
                <div className="relative">
                  <Landmark className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                  <input
                    ref={formRefs.college}
                    type="text"
                    placeholder="NIFT-TEA College"
                    value={regData.college}
                    onChange={(e) => setRegData({ ...regData, college: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, formRefs.team_name)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-pirate-gold font-bold mb-1">TEAM NAME *</label>
                <div className="relative">
                  <Shield className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                  <input
                    ref={formRefs.team_name}
                    type="text"
                    placeholder="Black Pearl Pirates"
                    value={regData.team_name}
                    onChange={(e) => setRegData({ ...regData, team_name: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, formRefs.member1_name)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* MEMBER 1 DETAILS */}
            <div className="bg-[#1c110a] p-3.5 rounded-xl border border-pirate-wood space-y-3">
              <div className="flex items-center justify-between border-b border-pirate-wood pb-2">
                <div className="flex items-center space-x-2 text-pirate-gold font-bold">
                  <Users className="w-4 h-4" />
                  <span>CREW MEMBER 1 (CAPTAIN)</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-normal">Alphabets only</span>
              </div>

              <div>
                <label className="block text-pirate-parchment font-semibold mb-1">FULL NAME (Alphabets Only) *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                  <input
                    ref={formRefs.member1_name}
                    type="text"
                    placeholder="Captain Sparrow"
                    value={regData.member1_name}
                    onChange={(e) => handleNameInput('member1_name', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, formRefs.member1_mobile)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-pirate-parchment font-semibold mb-1">MOBILE (+91 Prefix) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-yellow-400 text-xs font-bold font-mono pointer-events-none">+91</span>
                    <input
                      ref={formRefs.member1_mobile}
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={regData.member1_mobile}
                      onChange={(e) => handleMobileInput('member1_mobile', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, formRefs.member1_email)}
                      className={mobileInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pirate-parchment font-semibold mb-1">EMAIL ID *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                    <input
                      ref={formRefs.member1_email}
                      type="email"
                      placeholder="captain@gmail.com"
                      value={regData.member1_email}
                      onChange={(e) => setRegData({ ...regData, member1_email: e.target.value })}
                      onKeyDown={(e) => handleKeyDown(e, formRefs.member2_name)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MEMBER 2 DETAILS */}
            <div className="bg-[#1c110a] p-3.5 rounded-xl border border-pirate-wood space-y-3">
              <div className="flex items-center justify-between border-b border-pirate-wood pb-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Users className="w-4 h-4" />
                  <span>CREW MEMBER 2</span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-normal">Alphabets only</span>
              </div>

              <div>
                <label className="block text-pirate-parchment font-semibold mb-1">FULL NAME (Alphabets Only) *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                  <input
                    ref={formRefs.member2_name}
                    type="text"
                    placeholder="First Mate Turner"
                    value={regData.member2_name}
                    onChange={(e) => handleNameInput('member2_name', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, formRefs.member2_mobile)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-pirate-parchment font-semibold mb-1">MOBILE (+91 Prefix) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-yellow-400 text-xs font-bold font-mono pointer-events-none">+91</span>
                    <input
                      ref={formRefs.member2_mobile}
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={regData.member2_mobile}
                      onChange={(e) => handleMobileInput('member2_mobile', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, formRefs.member2_email)}
                      className={mobileInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pirate-parchment font-semibold mb-1">EMAIL ID *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                    <input
                      ref={formRefs.member2_email}
                      type="email"
                      placeholder="mate@gmail.com"
                      value={regData.member2_email}
                      onChange={(e) => setRegData({ ...regData, member2_email: e.target.value })}
                      onKeyDown={(e) => handleKeyDown(e, formRefs.pin)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4-DIGIT SECURITY PIN */}
            <div>
              <label className="block text-pirate-gold font-bold mb-1">4-DIGIT VOYAGE PIN *</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                <input
                  ref={formRefs.pin}
                  type="password"
                  maxLength={4}
                  placeholder="1234"
                  value={regData.pin}
                  onChange={(e) => setRegData({ ...regData, pin: e.target.value.replace(/\D/g, '') })}
                  onKeyDown={(e) => handleKeyDown(e, null, true)}
                  className="w-full bg-[#170e09] border border-pirate-gold/70 rounded-lg pl-9 pr-3 py-2.5 text-yellow-300 font-bold placeholder-amber-200/40 focus:outline-none focus:border-yellow-400 tracking-widest text-center text-sm font-mono"
                />
              </div>
              <span className="text-[10px] text-pirate-parchmentDark mt-1 block">
                Press <strong>[ENTER]</strong> key anytime to advance focus to next field or submit registration.
              </span>
            </div>

            {/* CONFIRM REGISTRATION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pirate-gold via-yellow-400 to-pirate-gold hover:from-yellow-400 hover:to-pirate-gold text-pirate-dark font-black rounded-xl tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 mt-2 text-sm flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'EMBARKING ON VOYAGE...' : 'CONFIRM REGISTRATION & EMBARK'}</span>
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-pirate-gold font-bold mb-1">REGISTERED TEAM NAME</label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                <input
                  ref={loginRefs.team_name}
                  type="text"
                  placeholder="Black Pearl Pirates"
                  value={loginData.team_name}
                  onChange={(e) => setLoginData({ ...loginData, team_name: e.target.value })}
                  onKeyDown={(e) => handleLoginKeyDown(e, loginRefs.pin)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-pirate-gold font-bold mb-1">4-DIGIT VOYAGE PIN</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-amber-400/80" />
                <input
                  ref={loginRefs.pin}
                  type="password"
                  maxLength={4}
                  placeholder="1234"
                  value={loginData.pin}
                  onChange={(e) => setLoginData({ ...loginData, pin: e.target.value.replace(/\D/g, '') })}
                  onKeyDown={(e) => handleLoginKeyDown(e, null, true)}
                  className="w-full bg-[#170e09] border border-pirate-gold/70 rounded-lg pl-9 pr-3 py-2.5 text-yellow-300 font-bold placeholder-amber-200/40 focus:outline-none focus:border-yellow-400 tracking-widest text-center text-sm font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pirate-gold to-amber-500 hover:from-yellow-400 hover:to-pirate-gold text-pirate-dark font-black rounded-xl tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 mt-2 text-sm flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'VERIFYING CREW...' : 'RESUME HUNT SESSION'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
