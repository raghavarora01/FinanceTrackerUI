import axios from 'axios';

const API_URL = 'https://financetrackerapi-production.up.railway.app';

// Axios types are included by default; no need for @types/axios

export async function register(email: string, password: string, name: string) {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
} 
