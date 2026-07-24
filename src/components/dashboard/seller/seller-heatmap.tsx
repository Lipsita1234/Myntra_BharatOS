"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles, MapPin, TrendingUp, Package, Star, Truck, RotateCcw, RefreshCw } from "lucide-react";

const HeatmapLeaflet = dynamic(() => import("@/components/maps/heatmap-leaflet"), {
  ssr: false,
  loading: () => <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}><RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "var(--text-tertiary)" }} /></div>
});

const levelColors: Record<string, string> = {
  high: "#FF3F6C",
  medium: "#FFB547",
  low: "#6C63FF",
};

export default function SellerHeatmap() {
  const [stateData, setStateData] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cluster/analytics", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.regionalPerformance) {
          const items = d.regionalPerformance.map((p: any, idx: number) => {
            const level = p.orders > 150 ? "high" : p.orders > 80 ? "medium" : "low";

            return {
              name: p.region,
              level,
              orders: p.orders,
              revenue: p.revenue,
              topCategory: p.topCategory,
              delivery: p.delivery,
              rating: p.rating,
              returnRate: p.returnRate,
              lat: p.lat,
              lng: p.lng,
              color: levelColors[level],
              idx
            };
          });
          setStateData(items);
          setSelectedState(items[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
        <h2>Regional Demand Heatmap</h2>
        <p>Visualize where your products are selling most. Click any region to see detailed analytics.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginBottom: 24 }}>
        {/* Map Visual */}
        <div className="card" style={{ position: "relative", minHeight: 460, display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title">India Sales Heatmap</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["high", "High Demand"], ["medium", "Medium Demand"], ["low", "Low Demand"]].map(([level, label]) => (
                <span key={level} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: levelColors[level], display: "inline-block" }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 360 }}>
            <HeatmapLeaflet mapData={stateData} selectedState={selectedState} setSelectedState={setSelectedState} />
          </div>
        </div>

        {/* State Detail Panel */}
        {selectedState && (
          <div className="card-glass" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: levelColors[selectedState.level], display: "inline-block",
                  boxShadow: `0 0 8px ${levelColors[selectedState.level]}`,
                }} />
                <span className="card-title">{selectedState.name}</span>
                <span className={`badge ${selectedState.level === "high" ? "red" : selectedState.level === "medium" ? "orange" : "blue"}`} style={{ marginLeft: "auto" }}>
                  {selectedState.level === "high" ? "🔥 High" : selectedState.level === "medium" ? "📈 Medium" : "📊 Low"} Demand
                </span>
              </div>
            </div>

            {[
              { label: "Total Orders", value: selectedState.orders.toLocaleString(), icon: <Package size={14} />, color: "var(--myntra-purple)" },
              { label: "Revenue Generated", value: `₹${selectedState.revenue.toLocaleString()}`, icon: <TrendingUp size={14} />, color: "var(--success)" },
              { label: "Top Selling Category", value: selectedState.topCategory, icon: <Star size={14} />, color: "var(--warning)" },
              { label: "Avg Delivery Time", value: selectedState.delivery, icon: <Truck size={14} />, color: "var(--info)" },
              { label: "Customer Rating", value: `${selectedState.rating} / 5.0`, icon: <Star size={14} />, color: "var(--warning)" },
              { label: "Return Rate", value: `${selectedState.returnRate}%`, icon: <RotateCcw size={14} />, color: selectedState.returnRate > 10 ? "var(--danger)" : "var(--success)" },
            ].map((row, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-secondary)" }}>
                  <span style={{ color: row.color }}>{row.icon}</span> {row.label}
                </span>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>{row.value}</strong>
              </div>
            ))}

            {/* AI Recommendation Box */}
            <div style={{
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary-muted)",
              border: "1.5px dashed var(--myntra-pink)",
              marginTop: 4,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--myntra-pink)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={12} /> AI Inventory Recommendation
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {selectedState.level === "high"
                  ? `Pre-allocate additional stock of ${selectedState.topCategory} to the ${selectedState.name} cluster. High confidence demand surge detected.`
                  : selectedState.level === "medium"
                  ? `Maintain current stock levels for ${selectedState.topCategory} in ${selectedState.name}. Monitor for 7 more days.`
                  : `Consider reducing ${selectedState.topCategory} inventory in ${selectedState.name}. Demand signals are weak.`
                }
              </p>
            </div>

            {/* State List */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", marginBottom: 8, textTransform: "uppercase" }}>All Regions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                {stateData.map((state) => (
                  <button
                    key={state.name}
                    onClick={() => setSelectedState(state)}
                    style={{
                      display: "flex", alignItems: "center",
                      padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
                      background: selectedState.name === state.name ? "var(--primary-muted)" : "transparent",
                      cursor: "pointer", outline: selectedState.name === state.name ? "1.5px solid var(--myntra-pink)" : "none",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: levelColors[state.level], display: "inline-block" }} />
                      {state.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{state.orders.toLocaleString()} orders</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regional Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Regional Performance Breakdown</div>
          <span className="badge blue">Full View</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Demand Level</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Top Category</th>
                <th>Delivery</th>
                <th>Rating</th>
                <th>Returns</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((state, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{state.name}</td>
                  <td>
                    <span style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: levelColors[state.level], display: "inline-block",
                      marginRight: 6, boxShadow: `0 0 6px ${levelColors[state.level]}`,
                    }} />
                    {state.level.charAt(0).toUpperCase() + state.level.slice(1)}
                  </td>
                  <td>{state.orders.toLocaleString()}</td>
                  <td style={{ color: "var(--success)", fontWeight: 700 }}>₹{state.revenue.toLocaleString()}</td>
                  <td>{state.topCategory}</td>
                  <td>{state.delivery}</td>
                  <td>⭐ {state.rating}</td>
                  <td>
                    <span className={`badge ${state.returnRate > 10 ? "red" : "green"}`}>{state.returnRate}%</span>
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
