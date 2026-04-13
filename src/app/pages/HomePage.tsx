import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  TrainFront, 
  Shield, 
  Clock, 
  Zap, 
  Ticket, 
  TrendingUp, 
  Activity,
  CreditCard,
  Percent
} from "lucide-react";

export function HomePage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source) params.set("source", source);
    if (destination) params.set("destination", destination);
    if (date) params.set("date", date);
    navigate(`/user/search?${params.toString()}`);
  };

  const popularRoutes = [
    ["Mumbai", "Delhi"],
    ["Chennai", "New Delhi"],
    ["Bangalore", "New Delhi"],
    ["Kolkata", "New Delhi"],
    ["Varanasi", "New Delhi"],
    ["Mumbai", "Pune"],
  ];

  const recentSearches = [
    { from: "Mumbai", to: "Delhi", date: "2024-05-20" },
    { from: "Bangalore", to: "Chennai", date: "2024-05-22" },
  ];

  const travelOffers = [
    {
      title: "First Booking Offer",
      code: "FAST50",
      desc: "Get 50% extra credits on your first booking",
      icon: Ticket,
      color: "#2DD4A8",
    },
    {
      title: "Student Discount",
      code: "STU25",
      desc: "Instant 25% OFF for verified students",
      icon: Percent,
      color: "#3B82F6",
    },
    {
      title: "Wallet Cashback",
      code: "CASHBACK",
      desc: "10% cashback on all wallet transactions",
      icon: CreditCard,
      color: "#F97316",
    }
  ];

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "40px" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)",
          borderRadius: "var(--radius-xl)",
          padding: isMobile ? "32px 20px" : "48px",
          position: "relative",
          overflow: "hidden",
          marginBottom: "32px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            position: "absolute", top: "-80px", right: "-40px",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,212,168,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-60px", left: "20%",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{
              padding: "4px 8px",
              background: "rgba(45,212,168,0.2)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(45,212,168,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <Activity className="animate-pulse" style={{ width: 14, height: 14, color: "var(--primary)" }} />
              <span style={{ fontSize: "11px", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Live System Active
              </span>
            </div>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
              • Reliable & Fast
            </span>
          </div>
          
          <h1 style={{ fontSize: isSmall ? "28px" : "42px", fontWeight: 800, color: "white", marginBottom: "8px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Find & Book <br />
            Your Next <span style={{ color: "var(--primary)" }}>Journey</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", fontWeight: 400 }}>
            Search across 500+ premium trains and book tickets in seconds.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr auto",
                gap: "12px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <Label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>
                  From
                </Label>
                <div style={{ position: "relative" }}>
                  <MapPin style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "var(--primary)" }} />
                  <Input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Mumbai"
                    style={{
                      paddingLeft: "34px", height: "44px", borderRadius: "var(--radius-md)",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>
                  To
                </Label>
                <div style={{ position: "relative" }}>
                  <MapPin style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#F97316" }} />
                  <Input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Delhi"
                    style={{
                      paddingLeft: "34px", height: "44px", borderRadius: "var(--radius-md)",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "white", fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Date
                </Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    height: "44px", borderRadius: "var(--radius-md)",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  type="submit"
                  style={{
                    width: isMobile ? "100%" : "auto",
                    height: "44px", padding: "0 24px", borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    border: "none", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    boxShadow: "0 0 20px rgba(45,212,168,0.3)",
                    color: "#0F172A",
                  }}
                >
                  <Search style={{ width: 18, height: 18 }} />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Recent Searches */}
          {!isMobile && (
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Recent:</span>
              <div style={{ display: "flex", gap: "8px" }}>
                {recentSearches.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSource(s.from); setDestination(s.to); setDate(s.date); }}
                    style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "var(--radius-full)",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "11px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    {s.from} → {s.to}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", 
        gap: "32px",
        marginBottom: "32px" 
      }}>
        {/* Popular Routes */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp style={{ width: 20, height: 20, color: "var(--primary)" }} />
              Popular Routes
            </h2>
            <Button variant="ghost" size="sm" style={{ color: "var(--primary)", fontSize: "13px" }}>View All</Button>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isSmall ? "1fr" : "repeat(2, 1fr)", 
            gap: "12px" 
          }}>
            {popularRoutes.map(([from, to]) => (
              <button
                key={`${from}-${to}`}
                onClick={() => { setSource(from); setDestination(to); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "16px 20px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-light)", cursor: "pointer",
                  transition: "all 0.2s", textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary-light)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-light)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "var(--radius-md)",
                  background: "var(--primary-ultra-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <TrainFront style={{ width: 18, height: 18, color: "var(--primary)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{from}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>to {to}</p>
                </div>
                <ArrowRight style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Travel Offers */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap style={{ width: 20, height: 20, color: "#F97316" }} />
            Exclusive Offers
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {travelOffers.map((offer) => (
              <div
                key={offer.title}
                style={{
                  padding: "16px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-light)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "absolute", top: "-10px", right: "-10px",
                  width: "60px", height: "60px", borderRadius: "50%",
                  background: `${offer.color}10`,
                }} />
                
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "var(--radius-md)",
                    background: `${offer.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <offer.icon style={{ width: 20, height: 20, color: offer.color }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{offer.title}</h4>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>{offer.desc}</p>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "var(--bg-secondary)",
                      border: "1px dashed var(--border-light)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: offer.color,
                      letterSpacing: "1px"
                    }}>
                      {offer.code}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>Why Choose FastRail?</h2>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", 
        gap: "16px" 
      }}>
        {[
          { icon: Zap, title: "Instant Booking", desc: "Book tickets in seconds with real-time availability and auto-suggest.", color: "#F97316", bg: "#FED7AA" },
          { icon: Shield, title: "Secure Payments", desc: "Multi-layered encryption for all your financial transactions.", color: "#3B82F6", bg: "#DBEAFE" },
          { icon: Clock, title: "Live Updates", desc: "Get real-time delays, platform changes, and seat status via SMS.", color: "#8B5CF6", bg: "#E0E7FF" },
        ].map((feature) => (
          <div
            key={feature.title}
            style={{
              padding: "24px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "var(--radius-md)", background: feature.bg,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
            }}>
              <feature.icon style={{ width: 22, height: 22, color: feature.color }} />
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>{feature.title}</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
