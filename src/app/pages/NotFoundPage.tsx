import { useNavigate } from "react-router";
import { TrainFront, ArrowLeft, Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
      }}
    >
      <div style={{ textAlign: "center" }} className="animate-fade-in">
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, var(--primary-ultra-light), #D1FAE5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <TrainFront style={{ width: 40, height: 40, color: "var(--primary)" }} />
        </div>
        <h1 style={{ fontSize: "64px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          404
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "32px" }}>
          This route doesn't exist. Perhaps the train took a wrong turn?
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px",
              background: "transparent", border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: "14px",
              fontWeight: 500, color: "var(--text-secondary)", fontFamily: "inherit",
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Go Back
          </button>
          <button
            onClick={() => navigate("/auth/login")}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
              fontSize: "14px", fontWeight: 600, color: "white", fontFamily: "inherit",
            }}
          >
            <Home style={{ width: 16, height: 16 }} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
