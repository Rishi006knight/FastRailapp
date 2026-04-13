import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { trainApi, bookingApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Train } from "../types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, MapPin, Clock, IndianRupee, TrainFront, User, Calendar, Check } from "lucide-react";
import { toast } from "sonner";

export function BookingPage() {
  const { trainId } = useParams<{ trainId: string }>();
  const [searchParams] = useSearchParams();
  const [train, setTrain] = useState<Train | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [passengerAge, setPassengerAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const travelDate = searchParams.get("date") || "";

  useEffect(() => {
    const fetchTrain = async () => {
      if (!trainId) return;
      setLoading(true);
      try {
        const result = await trainApi.getTrainById(trainId);
        setTrain(result);
        if (user) setPassengerName(user.name);
      } catch (error) {
        toast.error("Failed to load train details");
      } finally {
        setLoading(false);
      }
    };
    fetchTrain();
  }, [trainId, user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!train || !user || !trainId) return;
    setBooking(true);
    try {
      await bookingApi.createBooking(user.id, {
        trainId,
        passengerName,
        passengerAge: parseInt(passengerAge),
        travelDate: travelDate || new Date().toISOString().split("T")[0],
      });
      toast.success("Booking confirmed!");
      navigate("/user/bookings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div style={{ height: "400px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", animation: "pulse 2s infinite" }} />;
  }

  if (!train) {
    return (
      <div style={{ textAlign: "center", padding: "60px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Train not found</p>
      </div>
    );
  }

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in" style={{ maxWidth: "900px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px",
          background: "transparent", border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: "14px",
          color: "var(--text-secondary)", marginBottom: "24px", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} /> Back
      </button>

      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Book Your Journey</h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
        gap: "24px" 
      }}>
        {/* Train Details Card */}
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: isSmall ? "20px" : "24px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-light)",
          height: "fit-content"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <TrainFront style={{ width: 24, height: 24, color: "#059669" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{train.name}</h2>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "monospace" }}>#{train.trainNumber}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: MapPin, label: "Route", value: `${train.source} → ${train.destination}`, color: "#3B82F6" },
              { icon: Clock, label: "Schedule", value: `${train.departureTime} - ${train.arrivalTime}`, color: "#F97316" },
              { icon: Calendar, label: "Journey Date", value: travelDate ? new Date(travelDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "Not selected", color: "#8B5CF6" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon style={{ width: 16, height: 16, color: item.color }} />
                </div>
                <div>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</p>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: "20px", 
            padding: "16px", 
            background: "linear-gradient(135deg, var(--primary-ultra-light), #F0FDF4)", 
            borderRadius: "var(--radius-md)", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Price per Seat</p>
              <p style={{ fontSize: isSmall ? "24px" : "32px", fontWeight: 800, color: "var(--primary-dark)" }}>₹{train.price.toLocaleString()}</p>
            </div>
            <div style={{ textAlign: isSmall ? "left" : "right" }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Status</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: train.availableSeats < 20 ? "var(--danger)" : "var(--success)" }}>
                {train.availableSeats} seats left
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: isSmall ? "20px" : "24px",
          boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-light)",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Passenger Information</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <Label style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px", display: "block" }}>Full Name</Label>
              <div style={{ position: "relative" }}>
                <User style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "var(--text-muted)" }} />
                <Input 
                  type="text" 
                  value={passengerName} 
                  onChange={(e) => setPassengerName(e.target.value)} 
                  placeholder="As per ID proof"
                  required
                  style={{ paddingLeft: "40px", height: "44px", borderRadius: "var(--radius-md)" }} 
                />
              </div>
            </div>

            <div>
              <Label style={{ fontSize: "13px", fontWeight: 500, marginBottom: "6px", display: "block" }}>Age</Label>
              <Input 
                type="number" 
                value={passengerAge} 
                onChange={(e) => setPassengerAge(e.target.value)}
                placeholder="Years"
                min="1" 
                max="120" 
                required 
                style={{ height: "44px", borderRadius: "var(--radius-md)" }} 
              />
            </div>

            <div style={{ padding: "16px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", marginTop: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Base Fare</span>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>₹{train.price.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Taxes & Fees</span>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Included</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", marginTop: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700 }}>Total Payable</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--primary-dark)" }}>₹{train.price.toLocaleString()}</span>
              </div>
            </div>

            <Button type="submit" disabled={booking || train.availableSeats === 0}
              style={{
                height: "48px", borderRadius: "var(--radius-md)", fontSize: "15px", fontWeight: 600,
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px",
                boxShadow: "0 4px 12px rgba(45,212,168,0.2)"
              }}>
              {booking ? "Confirming..." : (
                <><Check style={{ width: 18, height: 18 }} /> Confirm & Pay</>
              )}
            </Button>
            
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.4 }}>
              By clicking confirm, you agree to our terms and conditions for railway booking.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
