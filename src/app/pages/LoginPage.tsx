import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { TrainFront, Mail, Lock, ArrowRight } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      login(response.token, response.user);
      toast.success("Welcome back!");
      navigate(response.user.role === "ADMIN" ? "/admin" : "/user");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth < 1024;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-primary)",
      }}
    >
      {/* Left Panel - Branding (Hidden on mobile) */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(45,212,168,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "15%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 0 40px rgba(45,212,168,0.3)",
              }}
            >
              <TrainFront style={{ width: 36, height: 36, color: "white" }} />
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 800, color: "white", marginBottom: "12px", letterSpacing: "-1px" }}>
              FastRail
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "360px", lineHeight: 1.6 }}>
              Modern railway reservation platform. Book tickets, track journeys, and travel seamlessly.
            </p>
            <div style={{ display: "flex", gap: "24px", marginTop: "40px", justifyContent: "center" }}>
              {[
                { value: "500+", label: "Trains" },
                { value: "50K+", label: "Users" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--primary)" }}>{stat.value}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Form */}
      <div
        style={{
          width: isMobile ? "100%" : "520px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "24px" : "40px",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }} className="animate-fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
            {isMobile && (
              <div style={{ 
                width: 32, height: 32, borderRadius: "var(--radius-sm)", 
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <TrainFront style={{ width: 18, height: 18, color: "white" }} />
              </div>
            )}
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>
              {isMobile ? "FastRail Login" : "Welcome back"}
            </h2>
          </div>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "32px" }}>
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <Label htmlFor="email" style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px", display: "block" }}>
                Email Address
              </Label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 18,
                    height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ paddingLeft: "40px", height: "44px", borderRadius: "var(--radius-md)" }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px", display: "block" }}>
                Password
              </Label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 18,
                    height: 18,
                    color: "var(--text-muted)",
                  }}
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: "40px", height: "44px", borderRadius: "var(--radius-md)" }}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{
                height: "48px",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight style={{ width: 18, height: 18 }} />}
            </Button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Don't have an account? </span>
            <Link
              to="/auth/register"
              style={{ fontSize: "14px", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
