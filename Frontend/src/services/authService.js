import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // { user, token }
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // { user, token }
};

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data; // user object
};
