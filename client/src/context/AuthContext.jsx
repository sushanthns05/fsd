import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('edusphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('edusphere_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('edusphere_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          localStorage.removeItem('edusphere_token');
          localStorage.removeItem('edusphere_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { user, accessToken } = res.data;
      setUser(user);
      localStorage.setItem('edusphere_token', accessToken);
      localStorage.setItem('edusphere_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.data?.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data?.success) {
      const { user, accessToken } = res.data;
      setUser(user);
      localStorage.setItem('edusphere_token', accessToken);
      localStorage.setItem('edusphere_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.data?.message };
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('edusphere_token');
      localStorage.removeItem('edusphere_user');
      setUser(null);
    }
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('edusphere_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'guest',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
