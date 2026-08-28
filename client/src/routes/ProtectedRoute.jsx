import Loading from "@/components/common/Loading.jsx";
import { useAppContext } from "@/hook/useAppContext.js";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};