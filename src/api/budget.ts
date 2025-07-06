import axios from 'axios';

const API_URL =  'https://financetrackerapi-production.up.railway.app';
const FLASK_API_URL = 'https://financetrackerpyhtonapi-1.onrender.com';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function setBudget(data: any) {
  const res = await axios.post(`${API_URL}/api/budget`, data, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function getBudgets(params?: any) {
  const res = await axios.get(`${API_URL}/api/budget`, { params, headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function getBudgetSuggestions(userId: string) {
  const res = await axios.get(`${FLASK_API_URL}/suggestions/${userId}`);
  return res.data;
} 
