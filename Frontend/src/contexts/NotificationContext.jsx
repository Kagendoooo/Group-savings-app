import { createContext, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const toast = useToast();

  const showNotification = (title, description, status = 'info') => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const showSuccess = (message) => {
    showNotification('Success', message, 'success');
  };

  const showError = (message) => {
    showNotification('Error', message, 'error');
  };

  const showInfo = (message) => {
    showNotification('Information', message, 'info');
  };

  const showWarning = (message) => {
    showNotification('Warning', message, 'warning');
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};