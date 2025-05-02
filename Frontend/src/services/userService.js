import api from './api';

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data; // updated user object
};