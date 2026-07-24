"use client";

import React, { useState, useEffect } from "react";
import { Truck, Star, Battery, AlertTriangle, CheckCircle, MapPin, Package, Clock, Navigation, Zap, User, RefreshCw } from "lucide-react";

const statusMeta: Record<string, { color: string; badge: string; label: string }> = {
  active:  { color: "#00D084", badge: "green",  label: "Moving" },
  idle:    { color: "#FFB547", badge: "orange", label: "Idle" },
  offline: { color: "#888",    badge: "blue",   label: "Off-Duty" },
};

export default function FleetOptimization() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const fetchFleet = () => {
    fetch("/api/operations/fleet")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.vehicles.length > 0) {
          const items = d.vehicles.map((v: any, idx: number) => {
            // compute some presentation fields
            return {
              id: v.vehicleId,
              name: v.driver,
              status: v.status,
              deliveries: v.deliveries,
              rating: v.rating,
              vehicle: v.vehicleType,
              currentLocation: v.currentLocation,
              fuelLevel: v.fuel,
              packages: v.packages || 0,
              eta: v.eta || "–",
              route: v.route && v.route !== "[]" ? v.route : "–",
              city: v.city || "Unknown",
              vehicleId: v.vehicleId.slice(0, 8).toUpperCase(),
            };
          });
          setVehicles(items);
          setStats(d.stats);
          setSelected((prev: any) => {
            const stillExists = items.find((x: any) => x.id === prev?.id);
            return stillExists || items[0];
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  const fleetSummary = [
    { label: "Total Vehicles", val: stats?.total ?? "0", color: "var(--myntra-purple)" },
    { label: "On Road", val: stats?.active ?? "0", color: "var(--success)" },
    { label: "Idle", val: stats?.idle ?? "0", color: "var(--warning)" },
    { label: "Offline", val: stats?.offline ?? "0", color: "var(--text-tertiary)" },
    { label: "Avg Load", val: "14.2 pkgs", color: "var(--info)" },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Fleet Monitoring Dashboard</h2>
        <p>Live driver tracking, vehicle telemetry, and delivery status across all regions</p>
      </div>

      {/* Fleet Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 24 }}>
        {fleetSummary.map((s, idx) => (
          <div key={idx} className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Driver Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Active Drivers</div>
            <span className="badge green" style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D084", display: "inline-block" }} /> Live Telemetry
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Packages</th>
                  <th>ETA</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((drv) => {
                  const meta = statusMeta[drv.status] || statusMeta.offline;
                  return (
                    <tr
                      key={drv.id}
                      onClick={() => setSelected(drv)}
                      style={{ cursor: "pointer", background: selected?.id === drv.id ? "var(--bg-tertiary)" : undefined }}
                    >
                      <td>
                        <div style={{ fontWeight: 600 }}>{drv.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{drv.id.slice(0, 8)}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{drv.vehicle}</div>
                        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{drv.vehicleId}</div>
                      </td>
                      <td>
                        <span className={`badge ${meta.badge}`} style={{ display: "flex", alignItems: "center", gap: 5, width: "fit-content" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
                          {meta.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={12} fill="var(--warning)" color="var(--warning)" />
                          <strong>{drv.rating}</strong>
                        </div>
                      </td>
                      <td>{drv.packages > 0 ? `${drv.packages} pkgs` : "–"}</td>
                      <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>{drv.eta}</td>
                      <td>{drv.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver Detail Panel */}
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card-glass">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <User size={22} style={{ color: "white" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
                  <span className={`badge ${(statusMeta[selected.status] || statusMeta.offline).badge}`} style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, width: "fit-content" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: (statusMeta[selected.status] || statusMeta.offline).color, display: "inline-block" }} />
                    {(statusMeta[selected.status] || statusMeta.offline).label}
                  </span>
                </div>
              </div>

              {[
                { l: "Vehicle ID", v: `${selected.vehicle} (${selected.vehicleId})`, icon: <Truck size={13} /> },
                { l: "Location", v: `${selected.city} — GPS Active`, icon: <MapPin size={13} /> },
                { l: "Current Route", v: selected.route, icon: <Navigation size={13} /> },
                { l: "Packages Loaded", v: selected.packages > 0 ? `${selected.packages} packages` : "Unloaded", icon: <Package size={13} /> },
                { l: "ETA", v: selected.eta !== "–" ? selected.eta : "Not on Route", icon: <Clock size={13} /> },
                { l: "Rating", v: `⭐ ${selected.rating} / 5.0`, icon: <Star size={13} /> },
                { l: "Today's Deliveries", v: `${selected.deliveries} completed`, icon: <CheckCircle size={13} /> },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "8px 0", borderBottom: "1px solid var(--border)", gap: 8 }}>
                  <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--myntra-pink)" }}>{row.icon}</span> {row.l}
                  </span>
                  <strong style={{ textAlign: "right", maxWidth: 150, fontSize: 11.5 }}>{row.v}</strong>
                </div>
              ))}
            </div>


          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 24, color: "var(--text-tertiary)" }}>Select a driver</div>
        )}
      </div>
    </div>
  );
}
