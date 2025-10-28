import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children}: ProtectedRouteProps) => {
  const token = useSelector((state: any) => state.auth.token);

  if (!token) {
    // người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;
