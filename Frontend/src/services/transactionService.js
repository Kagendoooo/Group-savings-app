import api from './api';

export const getGroupTransactions = (groupId) =>
  api.get(`/groups/${groupId}/transactions`);

export const createContribution = (transactionData) =>
  api.post('/transactions', transactionData);

export const requestWithdrawal = (withdrawalData) =>
  api.post('/withdrawals', withdrawalData);

export const updateWithdrawalStatus = (transactionId, statusData) =>
  api.put(`/withdrawals/${transactionId}`, statusData);