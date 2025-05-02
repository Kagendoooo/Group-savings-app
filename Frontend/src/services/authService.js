import api from './api';
import { setToLocalStorage } from '../utils/localStorage';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // 👈 return response.data to match expected { token, user }
};


export const register = async (userData) => {
  const { user, token } = await api.post('/auth/register', userData);
  setToLocalStorage('token', token); // ✅ Save token to localStorage
  return { user, token };
};

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data; // user object
};
