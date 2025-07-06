import axios from 'axios';

const API_URL = 'https://financetrackerapi-production.up.railway.app';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCurrentReport() {
  const res = await axios.get(`${API_URL}/api/reports/current`, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function getPastReports() {
  const res = await axios.get(`${API_URL}/api/reports/history`, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
} 
