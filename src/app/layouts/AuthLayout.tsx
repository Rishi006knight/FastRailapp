import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthLayout() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/user");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return <Outlet />;
}
