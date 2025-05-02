import api from './api';

export const getUserGroups = async () => {
  const response = await api.get('/groups');
  return response.data; // This is the array of groups
};

export const getGroupById = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data; // Single group object
};

export const createGroup = async (groupData) => {
  const response = await api.post('/groups', groupData);
  return response.data; // Newly created group object
};

export const updateGroup = async (groupId, groupData) => {
  const response = await api.put(`/groups/${groupId}`, groupData);
  return response.data; // Updated group object
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`);
  return response.data; // { message: "Group deleted successfully" }
};

export const joinGroup = async (groupId) => {
  const response = await api.post(`/groups/${groupId}/join`);
  return response.data; // { message, membership }
};

export const leaveGroup = async (groupId) => {
  const response = await api.post(`/groups/${groupId}/leave`);
  return response.data; // { message }
};
