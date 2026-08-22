import { createContext, useEffect, useState } from 'react';
import authService from '../service/authService.js';

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
      console.log(error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const value = { user, loadingUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
