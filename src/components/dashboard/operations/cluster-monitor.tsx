"use client";

import React, { useState, useEffect } from "react";
import { Layers, MapPin, Package, Clock, CheckCircle, AlertTriangle, Sparkles, Users, Truck, RefreshCw } from "lucide-react";

import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("./live-map"), { ssr: false });

const statusConfig: Record<string, { color: string; badge: string; label: string; dot: string }> = {
  completed: { color: "#00D084", badge: "green", label: "✅ Completed", dot: "#00D084" },
  active:    { color: "#00C2FF", badge: "blue",  label: "🚀 Ready for Dispatch", dot: "#00C2FF" },
  forming:   { color: "#FFB547", badge: "orange", label: "🔄 Forming", dot: "#FFB547" },
  delayed:   { color: "#FF5A5A", badge: "red",   label: "⚠️ Delayed", dot: "#FF5A5A" },
};

export default function ClusterMonitor() {
  const [rawClusters, setRawClusters] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchClusters = () => {
    fetch("/api/clusters", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const items = d.clusters.map((c: any) => {
            return {
              id: c.clusterId,
              name: c.name,
              location: c.city || "Location",
              orders: c.members,
              customers: c.members,
              savings: c.savings,
              vehicle: c.vehicleId || "Not assigned",
              eta: c.eta || "Building",
              status: c.status === "ready" ? "active" : c.status,
              lat: c.lat,
              lng: c.lng
            };
          });
          setRawClusters(items);
          if (items.length > 0) {
            setSelected((prev: any) => {
              const stillExists = items.find((x: any) => x.id === prev?.id);
              return stillExists || items[0];
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchClusters();
    const interval = setInterval(fetchClusters, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/clusters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchClusters();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = filter === "all" ? rawClusters : rawClusters.filter(c => c.status === filter);

  if (loading && rawClusters.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>AI SmartCluster Monitor</h2>
          <p>Live visibility into all forming, active, and completed delivery clusters across India</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "forming", "active", "completed", "delayed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === "active" ? "active" : f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
            >
              {f === "active" ? "Ready" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Active Clusters", value: rawClusters.length, color: "var(--myntra-pink)", icon: <Layers size={18} /> },
          { label: "Orders in Clusters", value: rawClusters.reduce((s,c) => s+c.orders, 0), color: "var(--myntra-purple)", icon: <Package size={18} /> },
          { label: "Total Savings Generated", value: `₹${rawClusters.reduce((s,c) => s+c.savings, 0).toLocaleString()}`, color: "var(--success)", icon: <Sparkles size={18} />, noNum: true },
          { label: "Ready for Dispatch", value: rawClusters.filter(c => c.status === "active").length, color: "var(--info)", icon: <Truck size={18} /> },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.value}</div>
              </div>
              <div style={{ color: k.color }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Detail Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }}>
        {/* Cluster Map */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title">Live Cluster Map – India</div>
            <span className="badge green" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D084", display: "inline-block" }} /> Live
            </span>
          </div>
          <div style={{
            height: 380, background: "#1E293B",
            borderRadius: "var(--radius-md)", border: "1px solid var(--border)", position: "relative", overflow: "hidden",
            display: "flex", justifyContent: "center", alignItems: "center",
            flex: 1
          }}>
            <LiveMap clusters={filtered} selected={selected} onSelect={setSelected} />
            
            <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 12, zIndex: 10 }}>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <span key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--text-secondary)", background: "rgba(15,23,42,0.8)", padding: "4px 8px", borderRadius: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
                  {key === "active" ? "Ready" : key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cluster Detail Panel */}
        {selected ? (
          <div className="card-glass" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span className={`badge ${(statusConfig[selected.status] || statusConfig.forming).badge}`} style={{ fontSize: 11 }}>
                  {(statusConfig[selected.status] || statusConfig.forming).label}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>{selected.id.slice(0, 18)}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} style={{ color: "var(--myntra-pink)" }} /> {selected.location}
              </div>
            </div>

            {[
              { label: "TOTAL ORDERS", value: `${selected.orders} orders`, icon: <Package size={13} /> },
              { label: "CUSTOMERS", value: `${selected.customers} customers`, icon: <Users size={13} /> },
              { label: "SAVINGS GENERATED", value: `₹${selected.savings.toLocaleString()}`, icon: <Sparkles size={13} />, highlight: true },
              { label: "VEHICLE ASSIGNED", value: selected.vehicle, icon: <Truck size={13} /> },
              { label: "ESTIMATED DELIVERY", value: selected.eta, icon: <Clock size={13} /> },
            ].map((row, idx) => (
              <div key={idx} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 9.5, color: "var(--text-tertiary)", fontWeight: 700, marginBottom: 4, letterSpacing: "0.8px" }}>{row.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: row.highlight ? "var(--success)" : "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "var(--myntra-pink)" }}>{row.icon}</span> {row.value}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {selected.status === "active" && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={() => handleUpdateStatus(selected.id, "completed")}
                  disabled={updating}
                >
                  Dispatch Now
                </button>
              )}
              {selected.status === "forming" && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={() => handleUpdateStatus(selected.id, "active")}
                  disabled={updating}
                >
                  Mark as Ready
                </button>
              )}
              {selected.status === "delayed" && (
                <button 
                  className="btn" 
                  style={{ flex: 1, background: "var(--danger)", color: "white", border: "none" }} 
                  onClick={() => handleUpdateStatus(selected.id, "active")}
                  disabled={updating}
                >
                  Resolve Delay
                </button>
              )}
              <button className="btn btn-secondary" style={{ padding: "8px 12px" }} onClick={fetchClusters} disabled={updating}>
                <RefreshCw size={14} className={updating ? "spin" : ""} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card-glass" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <span style={{ color: "var(--text-tertiary)" }}>Select a cluster</span>
          </div>
        )}
      </div>

      {/* Cluster Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Clusters – Full List</div>
          <span className="badge blue">{filtered.length} clusters</span>
        </div>
        <div style={{ overflowX: "auto", maxHeight: 400 }}>
          <table className="data-table">
            <thead style={{ position: "sticky", top: 0, background: "var(--bg-secondary)", zIndex: 1 }}>
              <tr>
                <th>Cluster ID</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Savings</th>
                <th>Vehicle</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cl, idx) => (
                <tr key={cl.id} onClick={() => setSelected(cl)} style={{ cursor: "pointer", background: selected?.id === cl.id ? "var(--bg-tertiary)" : undefined }}>
                  <td style={{ fontWeight: 700 }}>{cl.id.slice(0, 18)}</td>
                  <td>{cl.location}</td>
                  <td>{cl.orders}</td>
                  <td style={{ color: "var(--success)", fontWeight: 700 }}>₹{cl.savings.toLocaleString()}</td>
                  <td>{cl.vehicle}</td>
                  <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>{cl.eta}</td>
                  <td><span className={`badge ${(statusConfig[cl.status] || statusConfig.forming).badge}`} style={{ fontSize: 10 }}>{(statusConfig[cl.status] || statusConfig.forming).label}</span></td>
                  <td>
                    {cl.status === "active" && (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(cl.id, "completed"); }}
                        disabled={updating}
                      >
                        Dispatch
                      </button>
                    )}
                    {cl.status === "forming" && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(cl.id, "active"); }}
                        disabled={updating}
                      >
                        Monitor
                      </button>
                    )}
                    {cl.status === "delayed" && (
                      <button 
                        className="btn btn-sm" 
                        style={{ background: "var(--danger)", color: "white", border: "none" }}
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(cl.id, "active"); }}
                        disabled={updating}
                      >
                        Resolve
                      </button>
                    )}
                    {cl.status === "completed" && <span className="badge green">Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
