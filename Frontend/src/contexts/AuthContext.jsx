import { createContext, useContext, useEffect, useState } from 'react';
import { login, register, getCurrentUser, logout } from '../services/authService';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

const TOKEN_TTL = 1000 * 60 * 60 * 24; // 24 hours
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = !!currentUser;

  // On mount, check for valid token and fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getFromLocalStorage('token');
        if (!token) {
          setLoading(false);
          return;
        }
  
        // Check token expiration before making API call
        const tokenExp = getFromLocalStorage('tokenExpiry');
        if (tokenExp && new Date(tokenExp) < new Date()) {
          console.warn('Token expired, clearing session');
          removeFromLocalStorage('token');
          removeFromLocalStorage('tokenExpiry');
          setLoading(false);
          return;
        }
  
        const user = await getCurrentUser();
        console.log('Authentication status: true');
        setCurrentUser(user);
      } catch (err) {
        console.error('Invalid or expired token. Logging out...', err);
        removeFromLocalStorage('token');
        removeFromLocalStorage('tokenExpiry');
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
      console.log('Login full response:', response);
  
      // Validate the response structure
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response format from server');
      }
      
      const { user, token } = response;
      
      if (user && typeof token === 'string' && token.trim()) {
        setCurrentUser(user);
        
        // Calculate expiry time
        const expiryTime = new Date(new Date().getTime() + TOKEN_TTL);
        
        // Save to localStorage with expiry
        setToLocalStorage('token', token);
        setToLocalStorage('tokenExpiry', expiryTime.toISOString());
        
        console.log('Saving to localStorage: token');
        return { user, token };
      } else {
        throw new Error('Invalid login response format');
      }
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
      
      if (!response || !response.user) {
        throw new Error('Invalid response from server during registration');
      }
      
      setCurrentUser(response.user);
      
      if (response.token) {
        // Calculate expiry time
        const expiryTime = new Date(new Date().getTime() + TOKEN_TTL);
        
        // Save to localStorage with expiry
        setToLocalStorage('token', response.token);
        setToLocalStorage('tokenExpiry', expiryTime.toISOString());
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
      console.warn('Logout failed on server, clearing session anyway');
    } finally {
      removeFromLocalStorage('token');
      removeFromLocalStorage('tokenExpiry');
      setCurrentUser(null);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginUser,
        isAuthenticated,
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