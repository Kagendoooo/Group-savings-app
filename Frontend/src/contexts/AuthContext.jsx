import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, getCurrentUser } from '../services/authService';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = getFromLocalStorage('token');
        if (token) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        removeFromLocalStorage('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const loginUser = async (credentials) => {
    setError(null);
    try {
      const response = await login(credentials);
      setCurrentUser(response.user);
      setToLocalStorage('token', response.token);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const registerUser = async (userData) => {
    setError(null);
    try {
      const response = await register(userData);
      setCurrentUser(response.user);
      setToLocalStorage('token', response.token);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    removeFromLocalStorage('token');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    loginUser,
    registerUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};