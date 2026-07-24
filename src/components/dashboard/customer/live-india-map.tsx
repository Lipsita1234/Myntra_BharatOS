"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Map, Layers, Warehouse, Truck, MapPin, Search, AlertCircle } from "lucide-react";

// Dynamically import Leaflet client component
const LeafletMap = dynamic(
  () => import("@/components/maps/leaflet-map-client"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid var(--border)",
            borderTopColor: "var(--myntra-pink)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 500 }}>Initializing Interactive GIS Engine...</span>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    ),
  }
);

export default function LiveIndiaMap() {
  const [filter, setFilter] = useState<"all" | "warehouse" | "cluster" | "driver" | "hub">("all");

  return (
    <div>
      <div className="page-header">
        <h2>Live India Map</h2>
        <p>GIS-backed real-time logistics telemetry visualization across national routes</p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: 20 }}>
        {/* Statistics or Filters */}
        {[
          { label: "Active Warehouses", count: 8, color: "pink", icon: <Warehouse size={18} />, type: "warehouse" as const },
          { label: "AI Consolidated Clusters", count: 156, color: "blue", icon: <Layers size={18} />, type: "cluster" as const },
          { label: "Dispatch Vehicles", count: 342, color: "orange", icon: <Truck size={18} />, type: "driver" as const },
          { label: "Smart Micro Hubs", count: 5, color: "green", icon: <MapPin size={18} />, type: "hub" as const },
        ].map((item) => (
          <div
            key={item.label}
            className={`card cursor-pointer transition-all ${filter === item.type ? "pulse-glow" : ""}`}
            style={{
              borderColor: filter === item.type ? "var(--myntra-pink)" : undefined,
              background: filter === item.type ? "var(--primary-muted)" : undefined,
            }}
            onClick={() => setFilter(filter === item.type ? "all" : item.type)}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{item.count}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{item.label}</div>
              </div>
              <div className={`card-icon ${item.color}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Map Box */}
      <div className="grid-cols-3" style={{ gap: 20 }}>
        {/* The Map itself */}
        <div className="card" style={{ gridColumn: "span 2", padding: 0, overflow: "hidden", height: 500 }}>
          <LeafletMap />
        </div>

        {/* Legend / Info Sidebar */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-header" style={{ marginBottom: 0 }}>
            <div className="card-title">Telemetry Directory</div>
          </div>

          <div className="header-search" style={{ width: "100%", padding: "8px 12px" }}>
            <Search size={14} />
            <input placeholder="Search node directory..." style={{ fontSize: 12 }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, maxHeight: 330 }}>
            {[
              { name: "Bangalore Central (WH-001)", type: "Warehouse", status: "78% utilization", marker: "pink" },
              { name: "Koramangala Sector 4 Cluster", type: "AI Cluster", status: "6 active orders", marker: "blue" },
              { name: "Koramangala Pickup Hub (MH-001)", type: "Micro Hub", status: "45 packages ready", marker: "green" },
              { name: "Rajesh Kumar (DRV-001)", type: "EV Van Driver", status: "72% battery level", marker: "orange" },
            ].map((node, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <span className={`status-dot ${node.marker}`} style={{ width: 10, height: 10 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{node.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{node.type} • {node.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", fontSize: 11 }}>
            <AlertCircle size={16} style={{ color: "var(--myntra-pink)", flexShrink: 0 }} />
            <span>Map centered on <strong>Bangalore logistics zone</strong>. Drag or scroll to zoom. Click markers for popup actions.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export type { LiveIndiaMap };
