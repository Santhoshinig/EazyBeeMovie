
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (isAuthenticated) {
    return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  
  return <Navigate to="/login" />;
};

export default Index;
