"use client";

import React, { useState, useEffect } from "react";
import { Brain, MapPin, Navigation2, RefreshCw } from "lucide-react";

export default function MicroHubRecommendation() {
  const [hubs, setHubs] = useState<any[]>([]);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  const fetchHubs = () => {
    fetch("/api/operations/microhubs")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.microHubs.length > 0) {
          setHubs(d.microHubs);
          setSelectedHub(d.microHubs[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHubs();
  }, []);

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
        <h2>Smart Micro Hub Recommendations</h2>
        <p>AI-suggested temporary pickup lockers & consolidation nodes based on local buying density</p>
      </div>

      {/* Suggested Hubs cards */}
      <div className="grid-cols-3" style={{ marginBottom: 24 }}>
        {hubs.map((hub) => (
          <div
            key={hub.hubId}
            className={`card cursor-pointer transition-all ${selectedHub?.hubId === hub.hubId ? "selected-card" : ""}`}
            style={{
              borderColor: selectedHub?.hubId === hub.hubId ? "var(--myntra-pink)" : undefined,
              background: selectedHub?.hubId === hub.hubId ? "var(--primary-muted)" : undefined,
            }}
            onClick={() => setSelectedHub(hub)}
          >
            <div className="card-header">
              <div>
                <span className={`badge ${hub.hubType === "permanent" ? "blue" : "orange"}`}>
                  {hub.hubType.toUpperCase()}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{hub.name}</h3>
              </div>
              <span className="card-icon pink"><MapPin size={18} /></span>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Daily Savings</div>
                <strong style={{ color: "var(--success)" }}>₹{hub.savings}</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Active Orders</div>
                <strong>{hub.orders}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Simulation detail */}
      {selectedHub && (
        <div className="grid-cols-2">
          {/* Hub Logistics impact */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Consolidation Impact: {selectedHub.name}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Transit Fleet Reductions", val: `${selectedHub.fleetReductions || 0} km/day saved`, status: "optimal" },
                { label: "Expected Sector Density", val: `${selectedHub.orders} customer units`, status: "optimal" },
                { label: "Locker Occupancy Rate", val: `${Math.min(100, Math.round((selectedHub.orders / selectedHub.capacity) * 100))}% capacity allocated`, status: "standard" },
                { label: "Projected Cost Offset", val: `₹${selectedHub.savings} / cycle`, status: "optimal" },
              ].map((metric, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{metric.label}</span>
                  <strong style={{ color: metric.status === "optimal" ? "var(--success)" : undefined }}>{metric.val}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* AI Route Optimization Details */}
          <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="card-header">
                <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Brain size={18} style={{ color: "var(--myntra-pink)" }} />
                  <span>AI Logistics Routing Matrix</span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                By dispatching the consolidation batch to <strong>{selectedHub.name}</strong>, standard door-to-door delivery runs are bypassed. Local shoppers collect directly, saving over <strong>35% last-mile logistics expenditures</strong>.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Navigation2 size={24} style={{ color: selectedHub.status === "dispatched" ? "var(--success)" : "var(--myntra-pink)", transform: selectedHub.status === "dispatched" ? "none" : "rotate(45deg)" }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: selectedHub.status === "dispatched" ? "var(--success)" : "inherit" }}>
                    Dispatch Status: {selectedHub.status === "dispatched" ? "Dispatched" : "Recommended"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    {selectedHub.status === "dispatched" ? "Consolidation batch has been routed." : "Approve to trigger truck dispatch."}
                  </div>
                </div>
              </div>
              
              {selectedHub.status !== "dispatched" && (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={async () => {
                    setDispatching(true);
                    await fetch("/api/operations/microhubs", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ hubId: selectedHub.hubId, hubName: selectedHub.name })
                    });
                    setDispatching(false);
                    fetchHubs();
                  }}
                >
                  {dispatching ? "Approving..." : "Approve Dispatch"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
