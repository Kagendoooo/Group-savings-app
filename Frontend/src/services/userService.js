import api from './api';

export const updateUserProfile = (userData) =>
  api.put('/users/me', userData);