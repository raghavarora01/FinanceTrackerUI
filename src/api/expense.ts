import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://financetrackerapi-6lik.onrender.com';

// Axios types are included by default; no need for @types/axios

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addExpense(data: any) {
  const res = await axios.post(`${API_URL}/api/expense`, data, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function getExpenses(params?: any) {
  const res = await axios.get(`${API_URL}/api/expense`, { params, headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function updateExpense(id: string, data: any) {
  const res = await axios.put(`${API_URL}/api/expense/${id}`, data, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
}

export async function deleteExpense(id: string) {
  const res = await axios.delete(`${API_URL}/api/expense/${id}`, { headers: getAuthHeaders(), withCredentials: true });
  return res.data;
} 