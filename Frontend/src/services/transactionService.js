import api from './api';

export const getGroupTransactions = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/transactions`);
  return response.data; // array of transactions
};

export const createContribution = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data; // new transaction
};

export const requestWithdrawal = async (withdrawalData) => {
  const response = await api.post('/withdrawals', withdrawalData);
  return response.data; // new withdrawal request
};

export const updateWithdrawalStatus = async (transactionId, statusData) => {
  const response = await api.put(`/withdrawals/${transactionId}`, statusData);
  return response.data; // updated withdrawal
};
