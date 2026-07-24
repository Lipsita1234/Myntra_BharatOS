"use client";

import React, { useState } from "react";
import { CloudRain, AlertTriangle, Wind, Navigation, CheckCircle, Sparkles, Clock, ArrowRight, MapPin } from "lucide-react";

const weatherAlerts = [
  {
    id: 1, type: "rain", severity: "critical",
    title: "Heavy Rain Detected", region: "Puri, Odisha",
    description: "IMD issues red alert for coastal Odisha. 8+ cm rainfall expected. Active route disruption in 3 clusters.",
    suggestion: "Redirect deliveries via NH16. Pre-position stock at Bhubaneswar micro-hub.",
    timeSaved: "35 minutes", affectedOrders: 47,
    icon: "🌧️", color: "var(--info)",
  },
  {
    id: 2, type: "traffic", severity: "high",
    title: "Traffic Congestion", region: "NH-48, Bangalore",
    description: "Major accident on NH-48 near Tumkur Road. 4 km tailback. ETA for affected clusters extended by 90 minutes.",
    suggestion: "Reroute via Mysore Road (SH-17). 12 deliveries already rerouted.",
    timeSaved: "55 minutes", affectedOrders: 29,
    icon: "🚦", color: "var(--warning)",
  },
  {
    id: 3, type: "flood", severity: "critical",
    title: "Flood Alert", region: "Assam Corridor",
    description: "National Highway 37 partially submerged. Estimated 6-hour closure. 8 warehouses in affected zone.",
    suggestion: "Halt all dispatches to Guwahati zone. Activate pre-stocked Silchar micro-hub.",
    timeSaved: "2 hours", affectedOrders: 83,
    icon: "🌊", color: "var(--danger)",
  },
  {
    id: 4, type: "heatwave", severity: "medium",
    title: "Heatwave Warning", region: "Rajasthan",
    description: "Temperatures exceeding 46°C in Jaipur and Jodhpur zones. EV battery efficiency reduced by ~18%.",
    suggestion: "Shift EV dispatch to early morning (before 8 AM) and evening (after 6 PM) slots.",
    timeSaved: "–", affectedOrders: 22,
    icon: "🌡️", color: "var(--orange)",
  },
  {
    id: 5, type: "closure", severity: "medium",
    title: "Road Closure", region: "Mumbai-Pune Expressway",
    description: "Planned maintenance closure at km 68. Alternative Sinhagad Road adds 34 km to route.",
    suggestion: "Reroute via NH-48 for all Pune deliveries today.",
    timeSaved: "–", affectedOrders: 18,
    icon: "🚧", color: "var(--warning)",
  },
];

const trafficZones = [
  { city: "Bangalore", level: "medium", top: "66%", left: "38%", color: "#FFB547" },
  { city: "Mumbai", level: "high",   top: "54%", left: "27%", color: "#FF5A5A" },
  { city: "Delhi",   level: "low",   top: "22%", left: "38%", color: "#00D084" },
  { city: "Kolkata", level: "medium", top: "44%", left: "72%", color: "#FFB547" },
  { city: "Chennai", level: "low",   top: "80%", left: "42%", color: "#00D084" },
  { city: "Puri",    level: "critical", top: "57%", left: "65%", color: "#FF5A5A" },
  { city: "Guwahati", level: "critical", top: "35%", left: "78%", color: "#FF5A5A" },
];

const severityConfig: Record<string, { badge: string; border: string; bg: string }> = {
  critical: { badge: "red",    border: "var(--danger)",  bg: "rgba(255,90,90,0.04)" },
  high:     { badge: "orange", border: "var(--warning)", bg: "rgba(255,181,71,0.04)" },
  medium:   { badge: "blue",   border: "var(--border)",  bg: "var(--bg-tertiary)" },
  low:      { badge: "green",  border: "var(--border)",  bg: "var(--bg-tertiary)" },
};

export default function TrafficWeather() {
  const [applied, setApplied] = useState<number[]>([]);

  return (
    <div>
      <div className="page-header">
        <h2>Traffic & Weather Intelligence</h2>
        <p>Real-time disruption monitoring with AI-powered route change suggestions</p>
      </div>

      {/* Map + Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, marginBottom: 24 }}>
        {/* Map */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Live Disruption Map</div>
            <div style={{ display: "flex", gap: 12 }}>
              {[["critical", "#FF5A5A", "Critical"], ["high/medium", "#FFB547", "Congested"], ["low", "#00D084", "Clear"]].map(([k, c, l]) => (
                <span key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "var(--text-secondary)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            height: 340, background: "linear-gradient(135deg, rgba(0,194,255,0.04), rgba(255,63,108,0.04))",
            borderRadius: "var(--radius-md)", border: "1px solid var(--border)", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "10%", left: "18%", right: "12%", bottom: "8%", border: "1.5px dashed rgba(108,99,255,0.15)", borderRadius: "20% 30% 40% 20%" }} />
            {trafficZones.map((zone, idx) => (
              <div key={idx} style={{
                position: "absolute", top: zone.top, left: zone.left,
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}>
                <div style={{
                  width: zone.level === "critical" ? 44 : 34, height: zone.level === "critical" ? 44 : 34,
                  borderRadius: "50%", background: zone.color, opacity: 0.7,
                  boxShadow: `0 0 16px ${zone.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "white", fontWeight: 700,
                }}>
                  {zone.level === "critical" ? "⚠" : zone.level === "high" ? "🚦" : "✓"}
                </div>
                <div style={{ fontSize: 9, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{zone.city}</div>
              </div>
            ))}
            <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 11, color: "var(--text-tertiary)" }}>
              🌧️ Heavy rain zone in Puri · 🌊 Flood alert in Guwahati
            </div>
          </div>
        </div>

        {/* Alert Counts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { l: "Critical Alerts", v: weatherAlerts.filter(a => a.severity === "critical").length, c: "var(--danger)", icon: "🔴" },
            { l: "High Priority", v: weatherAlerts.filter(a => a.severity === "high").length, c: "var(--warning)", icon: "🟠" },
            { l: "Medium Priority", v: weatherAlerts.filter(a => a.severity === "medium").length, c: "var(--info)", icon: "🟡" },
            { l: "Orders Affected", v: weatherAlerts.reduce((s, a) => s + a.affectedOrders, 0), c: "var(--myntra-pink)", icon: "📦" },
            { l: "AI Routes Applied", v: applied.length, c: "var(--success)", icon: "✅" },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{item.l}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: item.c }}>{item.v}</div>
              </div>
              <div style={{ fontSize: 24 }}>{item.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {weatherAlerts.map((alert) => {
          const cfg = severityConfig[alert.severity];
          const isApplied = applied.includes(alert.id);
          return (
            <div
              key={alert.id}
              style={{ padding: "18px 20px", borderRadius: "var(--radius-md)", border: `1.5px solid ${cfg.border}`, background: cfg.bg, display: "flex", gap: 16, alignItems: "flex-start" }}
            >
              <div style={{ fontSize: 28, lineHeight: 1 }}>{alert.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 15 }}>{alert.title}</strong>
                  <span className={`badge ${cfg.badge}`}>{alert.severity.toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: "auto" }}>📍 {alert.region}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.5 }}>{alert.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--success)", fontWeight: 600 }}>
                  <Sparkles size={13} /> AI Suggestion:
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{alert.suggestion}</span>
                </div>
                {alert.timeSaved !== "–" && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-tertiary)" }}>
                    ⏱ Time saved by applying route change: <strong style={{ color: "var(--success)" }}>{alert.timeSaved}</strong> ·
                    📦 Orders affected: <strong>{alert.affectedOrders}</strong>
                  </div>
                )}
              </div>
              <button
                className={`btn btn-sm ${isApplied ? "btn-secondary" : "btn-primary"}`}
                style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => setApplied(prev => isApplied ? prev.filter(id => id !== alert.id) : [...prev, alert.id])}
              >
                {isApplied ? <><CheckCircle size={13} /> Applied</> : <><Navigation size={13} /> Apply Route</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
