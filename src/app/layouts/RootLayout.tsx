import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "../components/ui/sonner";

function RootRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      if (isAuthenticated) {
        navigate(isAdmin ? "/admin" : "/user");
      } else {
        navigate("/auth/login");
      }
    }
  }, [location.pathname, isAuthenticated, isAdmin, navigate]);

  return <Outlet />;
}

export function RootLayout() {
  return (
    <>
      <RootRedirect />
    </>
  );
}
