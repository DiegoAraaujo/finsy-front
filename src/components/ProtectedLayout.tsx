import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/user/useUser";

const ProtectedLayout = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
