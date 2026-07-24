"use client";

import React, { useState, useEffect } from "react";
import { Filter, Layers, RefreshCw } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States";

interface StateData {
  id: string;
  name: string;
  cost: string;
  demand: string;
  delays: number;
  microHubs: number;
  density: string;
  color: string;
  status: "Normal" | "High Cost" | "Delayed" | "Peak Demand";
}

export default function NationalHeatmap() {
  const [statesData, setStatesData] = useState<StateData[]>([]);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [category, setCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/heatmap")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatesData(data.states);
          setSelectedState(data.states.find((s: StateData) => s.name === "Maharashtra") || data.states[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStateFromGeo = (geoName: string) => {
    // TopoJSON sometimes uses slightly different names
    const normalizedGeo = geoName.toLowerCase().replace(/ and /g, " & ");
    return statesData.find(s => {
      const normalizedState = s.name.toLowerCase().replace(/ and /g, " & ");
      return normalizedState === normalizedGeo || normalizedGeo.includes(normalizedState);
    });
  };

  const getStateColor = (geoName: string) => {
    const state = getStateFromGeo(geoName);
    
    if (filterStatus !== "all" && state && state.status !== filterStatus) {
      return "rgba(15, 23, 42, 0.4)"; // Dimmed if filtered out
    }
    
    return state ? state.color : "rgba(30, 41, 59, 0.6)"; // Default slate
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>National Logistics Heatmap</h2>
          <p>Real-time spatial visualization of demand clusters, transit delays, and logistics expenditures across India</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
          <Filter size={15} style={{ color: "#FF3F6C" }} /> Filters:
        </div>

        {/* Date Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 9.5, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Date Range</span>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12 }}>
            <option value="today">Today (Real-time)</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {/* Category Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 9.5, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Category</span>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12 }}>
            <option value="all">All Apparel & Accessories</option>
            <option value="ethnic">Ethnic Wear</option>
            <option value="western">Western Wear</option>
            <option value="footwear">Footwear</option>
          </select>
        </div>

        {/* Status / Metric Layer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 9.5, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Heatmap Layer</span>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 12 }}>
            <option value="all">Show All Metrics</option>
            <option value="High Cost">High Logistics Cost Zones</option>
            <option value="Delayed">Transit Delays</option>
            <option value="Peak Demand">Peak Demand Regions</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Interactive TopoJSON Map */}
        <div className="card" style={{ position: "relative", minHeight: 520, background: "rgba(15,23,42,0.6)", border: "1px solid var(--border)", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, background: "var(--bg-card)", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6, zIndex: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Legend</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF3F6C" }} /> Peak Demand</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5A5A" }} /> High Logistics Cost</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFB547" }} /> Weather/Transit Delays</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D084" }} /> Optimum Performance</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, opacity: 0.5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(30, 41, 59, 0.8)" }} /> No Active Data</div>
          </div>

          {loading ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
            </div>
          ) : (
            <ComposableMap 
              projection="geoMercator" 
              projectionConfig={{ scale: 850, center: [82.5, 22.5] }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const geoName = geo.properties.NAME_1;
                    const isActive = selectedState?.name.toLowerCase() === geoName.toLowerCase();
                    const stateColor = getStateColor(geoName);
                    const stateData = getStateFromGeo(geoName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          if (stateData) setSelectedState(stateData);
                        }}
                        style={{
                          default: {
                            fill: stateColor,
                            stroke: "rgba(255,255,255,0.1)",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 0.3s"
                          },
                          hover: {
                            fill: stateData ? "var(--myntra-pink)" : "rgba(255,255,255,0.2)",
                            stroke: "rgba(255,255,255,0.3)",
                            strokeWidth: 1,
                            outline: "none",
                            cursor: stateData ? "pointer" : "default"
                          },
                          pressed: {
                            fill: stateData ? "var(--myntra-pink)" : "rgba(255,255,255,0.2)",
                            outline: "none"
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {/* Analytics Detail Sidebar Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {selectedState ? (
            <div className="card-glass" style={{ border: `1.5px solid ${selectedState.status === "High Cost" ? "#FF5A5A" : selectedState.status === "Delayed" ? "#FFB547" : "var(--border)"}`, padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{selectedState.name}</h3>
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>REGIONAL NETWORK METRICS</span>
                </div>
                <span className={`badge ${selectedState.status === "Normal" ? "green" : selectedState.status === "Delayed" ? "orange" : selectedState.status === "High Cost" ? "red" : "pink"}`}>
                  {selectedState.status}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Average Delivery Cost", val: selectedState.cost, desc: "National target: ₹52" },
                  { label: "Rath Yatra / demand level", val: selectedState.demand, desc: "Based on search/order density" },
                  { label: "Active Delays", val: `${selectedState.delays} shipments`, desc: "Pending resolution" },
                  { label: "Active Micro Hubs", val: `${selectedState.microHubs} centers`, desc: "Last-mile consolidation hubs" },
                  { label: "Logistics Hub Density", val: selectedState.density, desc: "Capacity efficiency score" },
                ].map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {selectedState.status === "High Cost" && (
                <div style={{ marginTop: 18, padding: 12, background: "rgba(255,90,90,0.06)", border: "1px solid rgba(255,90,90,0.2)", borderRadius: 8, fontSize: 11.5, color: "#FF5A5A", lineHeight: 1.4 }}>
                  <strong>AI Action:</strong> {selectedState.name} requires a new temporary micro hub to resolve low-density long-distance hauling issues immediately.
                </div>
              )}

              {selectedState.status === "Delayed" && (
                <div style={{ marginTop: 18, padding: 12, background: "rgba(255,181,71,0.06)", border: "1px solid rgba(255,181,71,0.2)", borderRadius: 8, fontSize: 11.5, color: "#FFB547", lineHeight: 1.4 }}>
                  <strong>Weather Alert:</strong> heavy rain disruption in {selectedState.name}. Reroute protocols initialized via secondary state highways.
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-tertiary)", textAlign: "center", padding: 40 }}>
              <Layers size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
              Select a state on the heatmap to view live telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
