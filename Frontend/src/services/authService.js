import api from './api';

export const login = (credentials) =>
    api.post('/auth/login', credentials);
  
  export const register = (userData) =>
    api.post('/auth/register', userData);
  
  export const logout = () =>
    api.post('/auth/logout');
  
  export const getCurrentUser = () =>
    api.get('/users/me');