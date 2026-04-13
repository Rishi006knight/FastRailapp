import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { trainApi } from "../../services/api";
import { Train } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MapPin, 
  Clock, 
  Users, 
  TrainFront, 
  IndianRupee,
  Hash,
  ArrowRight,
  Info,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

export function AdminTrainsPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const result = await trainApi.getAllTrains();
      setTrains(result);
    } catch (error) {
      toast.error("Failed to load trains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // Handle ?action=add query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "add") {
      setEditingTrain(null);
      setDialogOpen(true);
      // Clean up the URL
      navigate("/admin/trains", { replace: true });
    }
  }, [location.search, navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this train?")) return;
    try {
      await trainApi.deleteTrain(id);
      toast.success("Train deleted successfully");
      fetchTrains();
    } catch (error) {
      toast.error("Failed to delete train");
    }
  };

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
      <div style={{ 
        display: "flex", 
        flexDirection: isSmall ? "column" : "row",
        justifyContent: "space-between", 
        alignItems: isSmall ? "flex-start" : "center", 
        marginBottom: "24px",
        gap: "16px"
      }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>Manage Trains</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>{trains.length} trains in operation</p>
        </div>
        <Button
          onClick={() => { setEditingTrain(null); setDialogOpen(true); }}
          style={{
            width: isSmall ? "100%" : "auto",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            boxShadow: "0 4px 12px rgba(45,212,168,0.25)",
            border: "none",
            borderRadius: "var(--radius-md)",
            padding: "10px 24px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "#0F172A",
          }}
        >
          <Plus style={{ width: 18, height: 18 }} />
          Add New Train
        </Button>
      </div>

      <div style={{ display: "grid", gap: "16px" }} className="stagger-children">
        {trains.map((train) => (
          <div
            key={train.id}
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: isSmall ? "16px" : "24px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-light)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
              e.currentTarget.style.borderColor = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--border-light)";
            }}
          >
            <div style={{ 
              display: "flex", 
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between", 
              alignItems: "flex-start",
              gap: "20px"
            }}>
              <div style={{ flex: 1, width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <TrainFront style={{ width: 22, height: 22, color: "#0284C7" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{train.name}</h3>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "monospace" }}>#{train.trainNumber}</span>
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isSmall ? "1fr" : isMobile ? "1fr 1fr" : "repeat(4, 1fr)", 
                  gap: "16px" 
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <MapPin style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Route</p>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{train.source} → {train.destination}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <Clock style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Schedule</p>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>{train.departureTime} - {train.arrivalTime}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <Users style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Capacity</p>
                      <p style={{ fontSize: "13px", fontWeight: 500 }}>
                        <span style={{ color: train.availableSeats < 50 ? "var(--danger)" : "var(--success)" }}>{train.availableSeats}</span> / {train.totalSeats}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <IndianRupee style={{ width: 16, height: 16, color: "var(--text-muted)", marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Price</p>
                      <p style={{ fontSize: "13px", fontWeight: 600 }}>₹{train.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                gap: "8px", 
                width: isMobile ? "100%" : "auto",
                justifyContent: isMobile ? "flex-end" : "flex-start",
                paddingTop: isMobile ? "12px" : "0",
                borderTop: isMobile ? "1px solid var(--border-light)" : "none",
                marginTop: isMobile ? "4px" : "0"
              }}>
                <button
                  onClick={() => { setEditingTrain(train); setDialogOpen(true); }}
                  style={{
                    width: 36, height: 36, borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)", background: "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#DBEAFE"; e.currentTarget.style.borderColor = "#93C5FD"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
                >
                  <Pencil style={{ width: 16, height: 16, color: "#3B82F6" }} />
                </button>
                <button
                  onClick={() => handleDelete(train.id)}
                  style={{
                    width: 36, height: 36, borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)", background: "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.borderColor = "#FECACA"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
                >
                  <Trash2 style={{ width: 16, height: 16, color: "#EF4444" }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TrainDialog open={dialogOpen} onOpenChange={setDialogOpen} train={editingTrain} onSuccess={fetchTrains} />
    </div>
  );
}

interface TrainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  train: Train | null;
  onSuccess: () => void;
}

function TrainDialog({ open, onOpenChange, train, onSuccess }: TrainDialogProps) {
  const isSmall = window.innerWidth < 1024;
  const [formData, setFormData] = useState({
    trainNumber: "", name: "", source: "", destination: "",
    departureTime: "", arrivalTime: "", totalSeats: "", price: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (train) {
      setFormData({
        trainNumber: train.trainNumber, name: train.name,
        source: train.source, destination: train.destination,
        departureTime: train.departureTime, arrivalTime: train.arrivalTime,
        totalSeats: train.totalSeats.toString(), price: train.price.toString(),
      });
    } else {
      setFormData({ trainNumber: "", name: "", source: "", destination: "", departureTime: "", arrivalTime: "", totalSeats: "", price: "" });
    }
  }, [train, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const trainData = {
        trainNumber: formData.trainNumber, name: formData.name,
        source: formData.source, destination: formData.destination,
        departureTime: formData.departureTime, arrivalTime: formData.arrivalTime,
        totalSeats: parseInt(formData.totalSeats),
        availableSeats: train ? train.availableSeats : parseInt(formData.totalSeats),
        price: parseFloat(formData.price),
        daysOfOperation: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      };
      if (train) {
        await trainApi.updateTrain(train.id, trainData);
        toast.success("Train updated successfully");
      } else {
        await trainApi.createTrain(trainData);
        toast.success("New train operational!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Process failed. Please check backend connectivity.");
    } finally {
      setSaving(false);
    }
  };

  const FieldHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", marginTop: "8px" }}>
      <div style={{ padding: "6px", background: "var(--primary-ultra-light)", borderRadius: "6px" }}>
        <Icon style={{ width: 14, height: 14, color: "var(--primary)" }} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isSmall ? "w-full h-full max-w-full m-0 rounded-none overflow-y-auto" : "max-w-2xl"} style={{ borderRadius: isSmall ? "0" : "var(--radius-xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "0" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border-light)", background: "var(--bg-card)" }}>
          <DialogHeader>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrainFront style={{ width: 22, height: 22, color: "#0F172A" }} />
              </div>
              <div>
                <DialogTitle style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {train ? "Modify Train Asset" : "Register New Train"}
                </DialogTitle>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {train ? `Updating credentials for ${train.name}` : "Establish a new route in the FastRail network"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Basic Info */}
            <section>
              <FieldHeader icon={Info} title="Asset Identity" />
              <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: "16px" }}>
                <div style={{ position: "relative" }}>
                  <Label style={{ display: "none" }}>Number</Label>
                  <Hash style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)", zIndex: 10 }} />
                  <Input
                    placeholder="Train Number (e.g. 12123)"
                    value={formData.trainNumber}
                    onChange={(e) => setFormData({ ...formData, trainNumber: e.target.value })}
                    required
                    style={{ paddingLeft: "36px", height: "46px", background: "var(--bg-primary)", border: "1px solid var(--border-light)" }}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <Label style={{ display: "none" }}>Name</Label>
                  <TrainFront style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)", zIndex: 10 }} />
                  <Input
                    placeholder="Train Name (e.g. Deccan Queen)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ paddingLeft: "36px", height: "46px", background: "var(--bg-primary)", border: "1px solid var(--border-light)" }}
                  />
                </div>
              </div>
            </section>

            {/* Route & Schedule */}
            <section>
              <FieldHeader icon={MapPin} title="Route & Schedule" />
              <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr auto 1fr", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                   <Input
                    placeholder="Source Station"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    required
                    style={{ height: "42px", textAlign: "center", fontWeight: 600 }}
                  />
                  <ArrowRight style={{ width: 16, height: 16, color: "var(--text-muted)", margin: isSmall ? "auto" : "0" }} />
                  <Input
                    placeholder="Destination Station"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                    style={{ height: "42px", textAlign: "center", fontWeight: 600 }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <Label style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>DEP. TIME</Label>
                    <div style={{ position: "relative" }}>
                      <Clock style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--primary)" }} />
                      <Input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                        required
                        style={{ paddingLeft: "32px", height: "40px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", display: "block" }}>ARR. TIME</Label>
                    <div style={{ position: "relative" }}>
                      <Clock style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#F97316" }} />
                      <Input
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                        required
                        style={{ paddingLeft: "32px", height: "40px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Logistics & Pricing */}
            <section>
              <FieldHeader icon={Calendar} title="Capacity & Economics" />
              <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: "16px" }}>
                 <div style={{ position: "relative" }}>
                  <Users style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--text-muted)", zIndex: 10 }} />
                  <Input
                    type="number"
                    placeholder="Total Seat Capacity"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    required
                    style={{ paddingLeft: "36px", height: "46px" }}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <IndianRupee style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--success)", zIndex: 10 }} />
                  <Input
                    type="number"
                    placeholder="Standard Fare (₹)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{ paddingLeft: "36px", height: "46px" }}
                  />
                </div>
              </div>
            </section>

          </div>

          <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px", padding: "12px 0" }}>
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                style={{ borderRadius: "var(--radius-md)", padding: "0 24px", color: "var(--text-secondary)" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              style={{
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                border: "none",
                padding: "0 32px",
                fontWeight: 700,
                color: "#0F172A",
                boxShadow: "0 4px 14px rgba(45,212,168,0.3)"
              }}
            >
              {saving ? "Processing..." : train ? "Push Updates" : "Deploy Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
