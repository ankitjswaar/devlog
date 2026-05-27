import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, linkedinAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      setLinkedinConnected(data.user.linkedinConnected);

      try {
        const linkedinRes = await linkedinAPI.getProfile();
        setLinkedinConnected(linkedinRes.data.connected);
      } catch {
        // ignore linkedin profile errors
      }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setLinkedinConnected(data.user.linkedinConnected);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setLinkedinConnected(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLinkedinConnected(false);
  };

  const updateLinkedInStatus = (connected) => {
    setLinkedinConnected(connected);
    if (user) {
      setUser({ ...user, linkedinConnected: connected });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        linkedinConnected,
        login,
        register,
        logout,
        loadUser,
        updateLinkedInStatus,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
