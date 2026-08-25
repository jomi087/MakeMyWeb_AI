import { createContext, useEffect, useState } from 'react';
import authService from '../service/authService.js';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/constants/messages.constants.js';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  //Auth
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  //project

  //Auth Actions
  const checkSession = async () => {
    try {
      const user = await authService.check();
      setUser(user);
    } catch (error) {
      console.log('checkSession', error);
      const errorMessage = error?.response?.data?.error;
      toast.error(errorMessage || ERROR_MESSAGES.SOMETHING_WENT_WRONG);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const register = async (name, email, password) => {
    const user = await authService.register(name, email, password);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logout successfully');
      navigate('/login');
    } catch (error) {
      console.log('logout', error);
      const errorMessage = error?.response?.data?.error;
      toast.error(errorMessage || ERROR_MESSAGES.LOGOUT_FAILED);
    }
  };

  const value = { user, loadingUser, login, register, logout };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
