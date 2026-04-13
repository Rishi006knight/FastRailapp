import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { trainApi } from "../services/api";
import { Train } from "../types";
import { Button } from "../components/ui/button";
import { ArrowRight, Clock, MapPin, Users, TrainFront, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      try {
        const results = await trainApi.searchTrains({ source, destination, date });
        setTrains(results);
        if (results.length === 0) toast.info("No trains found for this route");
      } catch (error) {
        toast.error("Failed to search trains");
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, [source, destination, date]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: "140px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", animation: "pulse 2s infinite" }} />
        ))}
      </div>
    );
  }

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
          Available Trains
        </h1>
        <div style={{ 
          display: "flex", 
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "flex-start" : "center", 
          gap: "8px", 
          fontSize: "14px", 
          color: "var(--text-secondary)" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 500 }}>{source || "Any"}</span>
            <ArrowRight style={{ width: 16, height: 16, color: "var(--primary)" }} />
            <span style={{ fontWeight: 500 }}>{destination || "Any"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {date && (
              <span style={{
                padding: "2px 10px", borderRadius: "var(--radius-full)",
                background: "var(--primary-ultra-light)", color: "var(--primary)", fontSize: "13px", fontWeight: 500,
              }}>
                {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            )}
            <span style={{ marginLeft: isSmall ? "0" : "auto", fontWeight: 500 }}>{trains.length} trains found</span>
          </div>
        </div>
      </div>

      {trains.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)",
        }}>
          <TrainFront style={{ width: 48, height: 48, color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "16px" }}>No trains found for this route</p>
          <Button onClick={() => navigate("/user")} style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", border: "none", borderRadius: "var(--radius-md)" }}>
            New Search
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="stagger-children">
          {trains.map((train) => (
            <div
              key={train.id}
              style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: isSmall ? "16px" : "24px",
                boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-light)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--primary-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: isMobile ? "stretch" : "center",
                gap: "20px"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-md)",
                      background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <TrainFront style={{ width: 22, height: 22, color: "#059669" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{train.name}</h3>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "monospace" }}>#{train.trainNumber}</span>
                    </div>
                  </div>

                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: isSmall ? "1fr" : "repeat(3, 1fr)", 
                    gap: "16px" 
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <MapPin style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Route</p>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{train.source} → {train.destination}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Clock style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Schedule</p>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>{train.departureTime} - {train.arrivalTime}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Users style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Available</p>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>
                          <span style={{ color: train.availableSeats < 50 ? "var(--danger)" : "var(--success)" }}>{train.availableSeats}</span> / {train.totalSeats}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  flexDirection: isMobile ? "row" : "column", 
                  alignItems: isMobile ? "center" : "flex-end", 
                  justifyContent: "space-between",
                  gap: "12px", 
                  paddingTop: isMobile ? "16px" : "0",
                  borderTop: isMobile ? "1px solid var(--border-light)" : "none"
                }}>
                  <div style={{ textAlign: isMobile ? "left" : "right" }}>
                    <p style={{ fontSize: isSmall ? "24px" : "28px", fontWeight: 700, color: "var(--text-primary)" }}>₹{train.price.toLocaleString()}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>per seat</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/user/book/${train.id}?date=${date}`)}
                    disabled={train.availableSeats === 0}
                    style={{
                      background: train.availableSeats === 0 ? "#E2E8F0" : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                      border: "none", borderRadius: "var(--radius-md)",
                      padding: "10px 24px", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: "6px",
                      width: isMobile ? "auto" : "auto"
                    }}
                  >
                    {train.availableSeats === 0 ? "Sold Out" : "Book Now"}
                    {train.availableSeats > 0 && <ArrowRight style={{ width: 16, height: 16 }} />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
