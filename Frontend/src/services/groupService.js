import api from './api';

export const getUserGroups = async () => {
  try {
    // api.js interceptor already returns response.data, so no need for .data here
    const groups = await api.get('/groups');
    return groups; // This is already the array of groups
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

export const getGroupById = async (groupId) => {
  try {
    const group = await api.get(`/groups/${groupId}`);
    return group; // Single group object
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const newGroup = await api.post('/groups', groupData);
    console.log('Group created successfully:', newGroup);
    return newGroup; // Newly created group object
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const updateGroup = async (groupId, groupData) => {
  try {
    const updatedGroup = await api.put(`/groups/${groupId}`, groupData);
    return updatedGroup; // Updated group object
  } catch (error) {
    console.error(`Error updating group ${groupId}:`, error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const result = await api.delete(`/groups/${groupId}`);
    return result; // { message: "Group deleted successfully" }
  } catch (error) {
    console.error(`Error deleting group ${groupId}:`, error);
    throw error;
  }
};

export const joinGroup = async (groupId) => {
  try {
    const result = await api.post(`/groups/${groupId}/join`);
    return result; // { message, membership }
  } catch (error) {
    console.error(`Error joining group ${groupId}:`, error);
    throw error;
  }
};

export const leaveGroup = async (groupId) => {
  try {
    const result = await api.post(`/groups/${groupId}/leave`);
    return result; // { message }
  } catch (error) {
    console.error(`Error leaving group ${groupId}:`, error);
    throw error;
  }
};