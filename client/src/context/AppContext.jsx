import { createContext, useEffect, useState } from 'react';
import authService from '../service/authService.js';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/constants/messages.constants.js';

export const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

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

  const value = { user, loadingUser, login, register };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
