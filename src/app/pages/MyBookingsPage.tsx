import { useState, useEffect } from "react";
import { bookingApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Booking } from "../types";
import { Button } from "../components/ui/button";
import { MapPin, Clock, User, Calendar, Hash, X, TrainFront, Ticket } from "lucide-react";
import { toast } from "sonner";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await bookingApi.getUserBookings(user.id);
      setBookings(result.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const handleCancel = async (bookingId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingApi.cancelBooking(bookingId, user.id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cancellation failed");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: "180px", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", animation: "pulse 2s infinite" }} />
        ))}
      </div>
    );
  }

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>My Bookings</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>{bookings.length} bookings found in your history</p>
      </div>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px", background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)",
        }}>
          <Ticket style={{ width: 48, height: 48, color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "8px" }}>No bookings yet</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Search for trains and book your journey</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="stagger-children">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: isSmall ? "16px" : "24px",
                boxShadow: "var(--shadow-sm)",
                border: `1px solid ${booking.status === "CANCELLED" ? "#FEE2E2" : "var(--border-light)"}`,
                opacity: booking.status === "CANCELLED" ? 0.85 : 1,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (booking.status !== "CANCELLED") e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            >
              {/* Header */}
              <div style={{ 
                display: "flex", 
                flexDirection: isSmall ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: isSmall ? "flex-start" : "flex-start", 
                marginBottom: "20px",
                gap: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--radius-md)",
                    background: booking.status === "CONFIRMED"
                      ? "linear-gradient(135deg, #D1FAE5, #A7F3D0)"
                      : "linear-gradient(135deg, #FEE2E2, #FECACA)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <TrainFront style={{ width: 22, height: 22, color: booking.status === "CONFIRMED" ? "#059669" : "#DC2626" }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{booking.trainName}</h3>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>#{booking.trainNumber}</span>
                    </div>
                    <span style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: "var(--radius-full)",
                      fontSize: "12px", fontWeight: 600, marginTop: "4px",
                      background: booking.status === "CONFIRMED" ? "#D1FAE5" : "#FEE2E2",
                      color: booking.status === "CONFIRMED" ? "#059669" : "#DC2626",
                    }}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: isSmall ? "left" : "right", width: isSmall ? "100%" : "auto" }}>
                  <p style={{ fontSize: "22px", fontWeight: 700 }}>₹{booking.price.toLocaleString()}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Seat {booking.seatNumber}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
                gap: "16px", 
                marginBottom: "20px",
                background: "rgba(241,245,249,0.3)",
                padding: "16px",
                borderRadius: "var(--radius-md)"
              }}>
                {[
                  { icon: MapPin, label: "Route", value: `${booking.source} → ${booking.destination}`, color: "#3B82F6" },
                  { icon: Clock, label: "Schedule", value: `${booking.departureTime} - ${booking.arrivalTime}`, color: "#F97316" },
                  { icon: User, label: "Passenger", value: `${booking.passengerName}, ${booking.passengerAge}y`, color: "#8B5CF6" },
                  { icon: Calendar, label: "Journey", value: new Date(booking.travelDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }), color: "#14B8A6" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <item.icon style={{ width: 14, height: 14, color: item.color, marginTop: 3 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</p>
                      <p style={{ fontSize: "13px", fontWeight: 600 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ 
                display: "flex", 
                flexDirection: isSmall ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: isSmall ? "stretch" : "center", 
                paddingTop: "12px", 
                borderTop: "1px solid var(--border-light)",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <Hash style={{ width: 12, height: 12 }} />
                  <span>ID: {booking.id.substring(0, 12)}...</span>
                  <span>•</span>
                  <span>Booked {new Date(booking.bookingDate).toLocaleDateString("en-IN")}</span>
                </div>
                {booking.status === "CONFIRMED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                    style={{
                      borderRadius: "var(--radius-md)", fontSize: "13px",
                      borderColor: "#FECACA", color: "#DC2626",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                      height: "36px"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <X style={{ width: 14, height: 14 }} /> Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
