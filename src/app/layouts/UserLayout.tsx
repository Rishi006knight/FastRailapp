import { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  TrainFront,
  Search,
  BookOpen,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Home,
  Menu,
} from "lucide-react";

export function UserLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { to: "/user", icon: Home, label: "Search Trains", end: true },
    { to: "/user/bookings", icon: BookOpen, label: "My Bookings", end: false },
  ];

  const sidebarWidth = isMobile 
    ? (mobileMenuOpen ? "280px" : "0px") 
    : (sidebarExpanded ? "240px" : "72px");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 45,
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-light)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          boxShadow: sidebarWidth !== "0px" ? "var(--shadow-lg)" : "none",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: "var(--topbar-height)",
            display: "flex",
            alignItems: "center",
            justifyContent: (sidebarExpanded || isMobile) ? "flex-start" : "center",
            padding: (sidebarExpanded || isMobile) ? "0 20px" : "0",
            borderBottom: "1px solid var(--border-light)",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrainFront style={{ width: 20, height: 20, color: "white" }} />
          </div>
          {(sidebarExpanded || isMobile) && (
            <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
              FastRail
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => isMobile && setMobileMenuOpen(false)}
                title={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: (sidebarExpanded || isMobile) ? "10px 14px" : "10px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--primary-ultra-light)" : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  justifyContent: (sidebarExpanded || isMobile) ? "flex-start" : "center",
                }}
              >
                <item.icon style={{ width: 20, height: 20, flexShrink: 0 }} />
                {(sidebarExpanded || isMobile) && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Toggle (Desktop Only) */}
        {!isMobile && (
          <div style={{ padding: "12px", borderTop: "1px solid var(--border-light)" }}>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarExpanded ? "flex-start" : "center",
                gap: "12px",
                padding: sidebarExpanded ? "10px 14px" : "10px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              {sidebarExpanded ? <ChevronLeft style={{ width: 20, height: 20 }} /> : <ChevronRight style={{ width: 20, height: 20 }} />}
              {sidebarExpanded && <span>Collapse</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? "0px" : (sidebarExpanded ? "240px" : "72px"),
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            height: "var(--topbar-height)",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 16px" : "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 40,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Menu style={{ width: 20, height: 20, color: "var(--text-primary)" }} />
              </button>
            )}
            
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "var(--bg-primary)",
                  borderRadius: "var(--radius-full)",
                  padding: "8px 16px",
                  width: "320px",
                  border: "1px solid var(--border-light)",
                }}
              >
                <Search style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
                <input
                  placeholder="Search trains..."
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    width: "100%",
                  }}
                />
              </div>
            )}
            {isMobile && (
              <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "16px" }}>FastRail</span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Bell style={{ width: 18, height: 18, color: "var(--text-secondary)" }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserIcon style={{ width: 18, height: 18, color: "white" }} />
              </div>
              {!isMobile && (
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
                    {user?.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Passenger</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <LogOut style={{ width: 18, height: 18, color: "var(--danger)" }} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: isMobile ? "16px" : "24px 28px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
