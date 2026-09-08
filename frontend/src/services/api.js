import axios from 'axios';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('cyberquest_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  registerTeam: async (payload) => {
    const res = await axios.post(`${API_BASE}/register/`, payload);
    return res.data;
  },

  loginTeam: async (payload) => {
    const res = await axios.post(`${API_BASE}/login/`, payload);
    return res.data;
  },

  getTeamProfile: async () => {
    const res = await axios.get(`${API_BASE}/profile/`, { headers: getHeaders() });
    return res.data;
  },

  getStageInfo: async () => {
    const res = await axios.get(`${API_BASE}/stage/`, { headers: getHeaders() });
    return res.data;
  },

  submitAnswer: async (key) => {
    const res = await axios.post(`${API_BASE}/submit/`, { key }, { headers: getHeaders() });
    return res.data;
  },

  requestHint: async () => {
    const res = await axios.post(`${API_BASE}/request-hint/`, {}, { headers: getHeaders() });
    return res.data;
  },

  getLeaderboard: async () => {
    const res = await axios.get(`${API_BASE}/leaderboard/`);
    return res.data;
  }
};
