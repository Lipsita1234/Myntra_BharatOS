"use client";

import React, { useState, useEffect } from "react";
import { Bell, CloudRain, AlertTriangle, Truck, Layers, MapPin, RefreshCw } from "lucide-react";

export default function LiveAlerts() {
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "critical">("all");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch("/api/admin/alerts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAlerts(d.alerts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter === "all") return true;
    return alert.severity === severityFilter;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <CloudRain size={18} />;
      case "capacity":
        return <AlertTriangle size={18} />;
      case "driver":
        return <Truck size={18} />;
      case "cluster":
        return <Layers size={18} />;
      default:
        return <MapPin size={18} />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Live System Alerts</h2>
        <p>Real-time notifications of weather anomalies, logistics bottlenecks, capacity failures, or route disruptions</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 }}>
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={18} style={{ color: "var(--myntra-pink)" }} />
            <span>Alerts Feed ({filteredAlerts.length})</span>
          </div>

          <div className="tabs">
            <button className={`tab ${severityFilter === "all" ? "active" : ""}`} onClick={() => setSeverityFilter("all")}>
              All Alerts
            </button>
            <button className={`tab ${severityFilter === "high" ? "active" : ""}`} onClick={() => setSeverityFilter("high")}>
              High Severity
            </button>
            <button className={`tab ${severityFilter === "critical" ? "active" : ""}`} onClick={() => setSeverityFilter("critical")}>
              Critical System
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="alert-item" style={{ borderLeft: `4px solid var(--${alert.severity === "critical" ? "error" : alert.severity === "high" ? "warning" : "info"})` }}>
              <div className={`alert-icon ${alert.severity === "critical" ? "critical" : alert.severity === "high" ? "high" : "medium"}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 14 }}>{alert.title}</strong>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 4 }}>{alert.description}</p>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 6, fontWeight: 600, textTransform: "uppercase" }}>
                  Sector: {alert.region} • ID: {alert.id.slice(0, 8)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
