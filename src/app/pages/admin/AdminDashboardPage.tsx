import { useState, useEffect } from "react";
import { dashboardApi, bookingApi } from "../../services/api";
import { DashboardStats, Booking } from "../../types";
import {
  TrendingUp,
  Ticket,
  Users,
  TrainFront,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsResult, bookingsResult] = await Promise.all([
          dashboardApi.getStats(),
          bookingApi.getAllBookings(),
        ]);
        setStats(statsResult);
        setBookings(bookingsResult.sort((a, b) => 
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
        ));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: i === 1 ? "100px" : "200px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              animation: "pulse 2s infinite",
            }}
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const totalBookings = stats.totalBookings || 1;
  const confirmedPct = Math.round((stats.confirmedBookings / totalBookings) * 100);
  const cancelledPct = Math.round((stats.cancelledBookings / totalBookings) * 100);
  const pendingPct = 100 - confirmedPct - cancelledPct;

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  // Mock chart data from bookings
  const chartData = [
    { name: "Jan", revenue: 12400 },
    { name: "Feb", revenue: 18200 },
    { name: "Mar", revenue: 15800 },
    { name: "Apr", revenue: 22100 },
    { name: "May", revenue: 19500 },
    { name: "Jun", revenue: 29200 },
    { name: "Jul", revenue: stats.totalRevenue || 25000 },
  ];

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Ticket,
      color: "#2DD4A8",
      bgColor: "#D1FAE5",
      link: "Get report",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "#3B82F6",
      bgColor: "#DBEAFE",
      link: "Get report",
    },
    {
      label: "Active Trains",
      value: stats.activeTrains.toString(),
      icon: TrainFront,
      color: "#F97316",
      bgColor: "#FED7AA",
      link: "Get report",
    },
  ];

  const isMobile = window.innerWidth < 1024;
  const isSmall = window.innerWidth < 640;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
          Dashboard Overview
        </h1>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", 
        gap: "24px" 
      }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", minWidth: 0 }}>
          {/* Stat Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isSmall ? "1fr" : isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", 
            gap: "16px" 
          }} className="stagger-children">
            {statCards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--border-light)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  {card.label}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {card.value}
                  </p>
                  <span
                    style={{
                      fontSize: "13px",
                      color: card.color,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {card.link}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bookings Table */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
                Recent Bookings
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-light)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                <Search style={{ width: 14, height: 14 }} />
                <span>Search</span>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {["Train", "Duration", "Departure", "Arrival", "Passengers", "Price", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                        transition: "background 0.15s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "var(--radius-md)",
                              background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TrainFront style={{ width: 18, height: 18, color: "#0284C7" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                              {booking.trainName}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {booking.source} → {booking.destination}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        {booking.departureTime} - {booking.arrivalTime}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-secondary)" }}>
                          <MapPin style={{ width: 14, height: 14 }} />
                          {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-secondary)" }}>
                          <Clock style={{ width: 14, height: 14 }} />
                          {booking.arrivalTime}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                        {booking.passengerName}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                        ₹{booking.price.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "12px",
                            fontWeight: 600,
                            background:
                              booking.status === "CONFIRMED" ? "#D1FAE5" : "#FEE2E2",
                            color:
                              booking.status === "CONFIRMED" ? "#059669" : "#DC2626",
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, bookings.length)} of {bookings.length} entries
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-light)",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: currentPage === 1 ? 0.4 : 1,
                    }}
                  >
                    <ChevronLeft style={{ width: 16, height: 16 }} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-sm)",
                        border: page === currentPage ? "none" : "1px solid var(--border-light)",
                        background: page === currentPage ? "var(--primary)" : "transparent",
                        color: page === currentPage ? "white" : "var(--text-secondary)",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: page === currentPage ? 600 : 400,
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-light)",
                      background: "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: currentPage === totalPages ? 0.4 : 1,
                    }}
                  >
                    <ChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analytics & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Quick Actions */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => navigate("/admin/trains?action=add")}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)",
                  background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-ultra-light)"; e.currentTarget.style.borderColor = "var(--primary-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-primary)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
              >
                <div style={{ padding: "6px", background: "#D1FAE5", borderRadius: "6px" }}>
                  <Plus style={{ width: 14, height: 14, color: "#059669" }} />
                </div>
                Add New Train
              </button>
              
              <button
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)",
                  background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "13px", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#93C5FD"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-primary)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
              >
                <div style={{ padding: "6px", background: "#DBEAFE", borderRadius: "6px" }}>
                  <FileText style={{ width: 14, height: 14, color: "#2563EB" }} />
                </div>
                Generate Report
              </button>
            </div>
          </div>

          {/* Analytics Card */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Analytics</h3>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--primary)",
                  background: "var(--primary-ultra-light)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                Total {stats.totalBookings}
              </span>
            </div>

            {/* Progress Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Confirmed", pct: confirmedPct, color: "#3B82F6" },
                { label: "Pending", pct: pendingPct, color: "#F59E0B" },
                { label: "Cancelled", pct: cancelledPct, color: "#EF4444" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: item.color }}>{item.pct}%</span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#F1F5F9",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${item.pct}%`,
                        background: item.color,
                        borderRadius: "var(--radius-full)",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
              System Health
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>API Server</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#059669" }}>Operational</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>MongoDB Atlas</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#059669" }}>Connected</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Cloud Storage</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#3B82F6" }}>Standby</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart Card */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Revenue</h3>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div style={{ height: "180px", marginTop: "8px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4A8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2DD4A8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2DD4A8"
                    strokeWidth={2.5}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
