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

  const parseApiError = (err, fallbackMsg) => {
    if (!err) return fallbackMsg;
    if (err.response?.status === 404) {
      return "Backend API server endpoint not found (404 Error).";
    }
    const data = err.response?.data;
    if (data) {
      if (typeof data === 'string') {
        if (data.includes('<!DOCTYPE') || data.includes('<html')) {
          const titleMatch = data.match(/<title>(.*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            return `Server Exception: ${titleMatch[1]}`;
          }
          return fallbackMsg;
        }
        return data;
      }
      if (data.error) {
        if (typeof data.error === 'string') return data.error;
        if (data.error.message) return data.error.message;
        return JSON.stringify(data.error);
      }
      if (data.message) return data.message;
      if (data.detail) return data.detail;
      if (typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const val = data[firstKey];
          const valStr = Array.isArray(val) ? val.join(', ') : String(val);
          return `${firstKey}: ${valStr}`;
        }
      }
    }
    return err.message || fallbackMsg;
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
      const msg = parseApiError(err, "Registration failed.");
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
      const msg = parseApiError(err, "Login failed. Check team name & PIN.");
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
