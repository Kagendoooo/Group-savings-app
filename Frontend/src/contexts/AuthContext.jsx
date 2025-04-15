import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, getCurrentUser, logout } from '../services/authService';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

const TOKEN_TTL = 1000 * 60 * 60 * 24; // 24 hours

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for valid token and fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getFromLocalStorage('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const loginUser = async (credentials) => {
    setError(null);
    try {
      const response = await login(credentials);
  
      // Helpful logging
      console.log('Login full response:', response);
      console.log('Login response.data:', response.data);
  
      // Destructure based on your backend format
      const { user, token } = response.data.data;
  
      setCurrentUser(user);
  
      if (token) {
        setToLocalStorage('token', token, TOKEN_TTL);
      } else {
        console.warn('No token received from login response');
      }
  
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    }
  };
  

  const registerUser = async (userData) => {
    setError(null);
    try {
      const response = await register(userData);
      setCurrentUser(response.user);

      if (response.token) {
        setToLocalStorage('token', response.token, TOKEN_TTL);
      } else {
        console.warn('No token received from register response');
      }

      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('Logout failed, clearing session anyway');
    } finally {
      setToLocalStorage('token', null);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};