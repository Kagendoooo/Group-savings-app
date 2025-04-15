import api from './api';

export const getUserGroups = () =>
  api.get('/groups');

export const getGroupById = (groupId) =>
  api.get(`/groups/${groupId}`);

export const createGroup = (groupData) =>
  api.post('/groups', groupData);

export const updateGroup = (groupId, groupData) =>
  api.put(`/groups/${groupId}`, groupData);

export const deleteGroup = (groupId) =>
  api.delete(`/groups/${groupId}`);

export const joinGroup = (groupId) =>
  api.post(`/groups/${groupId}/join`);

export const leaveGroup = (groupId) =>
  api.post(`/groups/${groupId}/leave`);