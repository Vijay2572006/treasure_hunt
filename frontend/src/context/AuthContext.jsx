import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cyberquest_token') || null);
  const [stageData, setStageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session or load initial team profile
  useEffect(() => {
    if (token) {
      refreshStageData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshStageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStageInfo();
      setStageData(data);
      if (data.team) {
        setTeam(data.team);
      }
    } catch (err) {
      console.error("Failed to load stage data", err);
      if (err.response && err.response.status === 401) {
        logout();
      } else {
        setError("Failed to sync with server. Check internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (teamData) => {
    setError(null);
    try {
      const res = await api.registerTeam(teamData);
      localStorage.setItem('cyberquest_token', res.token);
      setToken(res.token);
      setTeam(res.team);
      await refreshStageData();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : "Registration failed.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const login = async (loginData) => {
    setError(null);
    try {
      const res = await api.loginTeam(loginData);
      localStorage.setItem('cyberquest_token', res.token);
      setToken(res.token);
      setTeam(res.team);
      await refreshStageData();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Check team name & PIN.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('cyberquest_token');
    setToken(null);
    setTeam(null);
    setStageData(null);
  };

  const submitKey = async (key) => {
    try {
      const res = await api.submitAnswer(key);
      if (res.correct) {
        await refreshStageData();
      }
      return res;
    } catch (err) {
      return { correct: false, message: err.response?.data?.error || "Submission error." };
    }
  };

  const requestHint = async () => {
    try {
      const res = await api.requestHint();
      await refreshStageData();
      return res;
    } catch (err) {
      return { error: err.response?.data?.error || "Failed to request hint." };
    }
  };

  return (
    <AuthContext.Provider value={{
      team,
      token,
      stageData,
      loading,
      error,
      register,
      login,
      logout,
      submitKey,
      requestHint,
      refreshStageData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
