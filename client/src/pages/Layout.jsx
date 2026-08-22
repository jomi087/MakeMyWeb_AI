import Loading from '@/components/common/Loading.jsx';
import { useAppContext } from '@/hook/useAppContext.js';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  const { user, loadingUser } = useAppContext();
  console.log('loadingUser1', loadingUser);

  if (loadingUser) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const GuestLayout = () => {
  const { user, loadingUser } = useAppContext();
  console.log('loadingUser2', loadingUser);
  if (loadingUser) return <Loading />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};
