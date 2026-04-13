import { useState, useEffect } from "react";
import { bookingApi } from "../../services/api";
import { Booking } from "../../types";
import { TrainFront, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const result = await bookingApi.getAllBookings();
        setBookings(result.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) =>
    !filter || b.trainName.toLowerCase().includes(filter.toLowerCase()) ||
    b.passengerName.toLowerCase().includes(filter.toLowerCase()) ||
    b.id.toLowerCase().includes(filter.toLowerCase())
  );

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", height: "400px", animation: "pulse 2s infinite" }} />
    );
  }

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in">
      <div style={{ 
        display: "flex", 
        flexDirection: isSmall ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isSmall ? "flex-start" : "center", 
        marginBottom: "24px",
        gap: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>All Bookings</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>{bookings.length} total bookings</p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-light)", background: "var(--bg-card)", 
          width: isSmall ? "100%" : "280px",
        }}>
          <Search style={{ width: 16, height: 16, color: "var(--text-muted)" }} />
          <input
            placeholder="Search bookings..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", width: "100%", fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div style={{
        background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-light)", 
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "800px" : "auto" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                {["Booking ID", "Train", "Passenger", "Route", "Travel Date", "Price", "Status"].map((h) => (
                  <th key={h} style={{
                    padding: "14px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600,
                    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  style={{ borderBottom: "1px solid var(--border-light)", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                    {booking.id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "var(--radius-sm)",
                        background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <TrainFront style={{ width: 16, height: 16, color: "#0284C7" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600 }}>{booking.trainName}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>#{booking.trainNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                    <p style={{ fontWeight: 500 }}>{booking.passengerName}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Age: {booking.passengerAge}</p>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {booking.source} → {booking.destination}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600 }}>
                    ₹{booking.price.toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: "11px", fontWeight: 700,
                      background: booking.status === "CONFIRMED" ? "#D1FAE5" : "#FEE2E2",
                      color: booking.status === "CONFIRMED" ? "#059669" : "#DC2626",
                    }}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedBookings.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ 
            padding: "16px 20px", 
            display: "flex", 
            flexDirection: isSmall ? "column" : "row",
            justifyContent: "space-between", 
            alignItems: "center", 
            borderTop: "1px solid var(--border-light)",
            gap: "12px"
          }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </button>
              {Array.from({ length: Math.min(isSmall ? 3 : 5, totalPages) }, (_, i) => {
                const pageNum = totalPages <= (isSmall ? 3 : 5) ? i + 1 : Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: pageNum === currentPage ? "none" : "1px solid var(--border-light)", background: pageNum === currentPage ? "var(--primary)" : "transparent", color: pageNum === currentPage ? "white" : "var(--text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: pageNum === currentPage ? 600 : 400 }}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
