"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, ArrowRight, Zap, Truck, Warehouse, CloudRain, Layers, RefreshCw } from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  weather:  <CloudRain size={16} />,
  traffic:  <Truck size={16} />,
  capacity: <Warehouse size={16} />,
  driver:   <Truck size={16} />,
  route:    <Zap size={16} />,
  cluster:  <Layers size={16} />,
};

const severityConfig: Record<string, { badge: string; border: string; bg: string; color: string }> = {
  critical: { badge: "red",    border: "var(--danger)",  bg: "rgba(255,90,90,0.05)",    color: "var(--danger)" },
  high:     { badge: "orange", border: "var(--warning)", bg: "rgba(255,181,71,0.05)",   color: "var(--warning)" },
  medium:   { badge: "blue",   border: "var(--border)",  bg: "var(--bg-tertiary)",       color: "var(--info)" },
  low:      { badge: "green",  border: "var(--border)",  bg: "var(--bg-tertiary)",       color: "var(--success)" },
};

export default function SmartAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filterSev, setFilterSev] = useState<string>("all");
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

  const handleResolve = async (id: string, resolvedStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved: resolvedStatus }),
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const filtered = filterSev === "all" ? alerts : alerts.filter(a => a.severity === filterSev);

  const counts = {
    critical: alerts.filter(a => a.severity === "critical" && !a.resolved).length,
    high:     alerts.filter(a => a.severity === "high" && !a.resolved).length,
    medium:   alerts.filter(a => a.severity === "medium" && !a.resolved).length,
    low:      alerts.filter(a => a.severity === "low" && !a.resolved).length,
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
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Smart Alerts Center</h2>
          <p>Intelligent priority-based alerts for your logistics operations — AI-powered monitoring 24/7</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge red" style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px" }}>
            <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)", display: "inline-block" }} />
            {activeAlerts.length} Active Alerts
          </span>
        </div>
      </div>

      {/* Alert Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Critical", value: counts.critical, color: "var(--danger)", icon: "🔴" },
          { label: "High Priority", value: counts.high, color: "var(--warning)", icon: "orange" },
          { label: "Medium", value: counts.medium, color: "var(--info)", icon: "yellow" },
          { label: "Low Priority", value: counts.low, color: "var(--success)", icon: "green" },
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 24 }}>
              {item.label === "Critical" ? "🔴" : item.label === "High Priority" ? "🟠" : item.label === "Medium" ? "🟡" : "🟢"}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "critical", "high", "medium", "low"].map(sev => (
          <button key={sev} onClick={() => setFilterSev(sev)} className={`btn btn-sm ${filterSev === sev ? "btn-primary" : "btn-secondary"}`}>
            {sev.charAt(0).toUpperCase() + sev.slice(1)}
          </button>
        ))}
        <button onClick={fetchAlerts} className="btn btn-secondary btn-sm" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <RefreshCw size={12} /> Refresh Feed
        </button>
      </div>

      {/* Alert Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.medium;
          const isResolved = alert.resolved;
          const ts = new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={alert.id}
              style={{
                padding: "18px 20px", borderRadius: "var(--radius-md)",
                border: `1.5px solid ${isResolved ? "var(--border)" : cfg.border}`,
                background: isResolved ? "var(--bg-tertiary)" : cfg.bg,
                display: "flex", gap: 16, alignItems: "flex-start",
                opacity: isResolved ? 0.6 : 1, transition: "all 0.3s",
              }}
            >
              {/* Type Icon */}
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cfg.color}18`, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {typeIcons[alert.type] || <Layers size={16} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <strong style={{ fontSize: 14, textDecoration: isResolved ? "line-through" : "none" }}>{alert.title}</strong>
                  <span className={`badge ${cfg.badge}`}>{alert.severity.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} /> {ts} · 📍 {alert.region}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{alert.description}</p>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {!isResolved && (
                  <button className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Resolve Detail <ArrowRight size={12} />
                  </button>
                )}
                <button
                  className={`btn btn-sm ${isResolved ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => handleResolve(alert.id, !isResolved)}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  {isResolved ? "Reopen" : <><CheckCircle size={13} /> Resolve</>}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--text-tertiary)", fontSize: 14 }}>
            <CheckCircle size={40} style={{ color: "var(--success)", marginBottom: 12 }} />
            <div>No alerts in this category. All clear! ✅</div>
          </div>
        )}
      </div>
    </div>
  );
}
