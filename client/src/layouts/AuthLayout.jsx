import { AppContextProvider } from '@/context/AppContext.jsx';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <AppContextProvider>
      <Outlet />
    </AppContextProvider>
  );
};

export default AuthLayout;
