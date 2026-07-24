"use client";

import React, { useState, useEffect } from "react";
import { Navigation, Zap, Clock, Fuel, DollarSign, TrendingDown, Truck, CheckCircle, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./route-map"), { ssr: false });

export default function RouteOptimizer() {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  // Fetch available cities
  useEffect(() => {
    fetch("/api/optimize")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.cities.length > 0) {
          setCities(d.cities);
          setSelectedCity(d.cities[0]);
        }
      })
      .catch(console.error);
  }, []);

  const fetchCityData = (city: string) => {
    setLoading(true);
    fetch(`/api/optimize?city=${city}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d);
        } else {
          setData(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch optimization data when city changes
  useEffect(() => {
    if (!selectedCity) return;
    fetchCityData(selectedCity);
  }, [selectedCity]);

  const handleOptimize = async () => {
    if (!data) return;
    setAnimating(true);
    try {
      await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clusterIds: data.clusterIds })
      });
      
      // Mock animation delay to let the user feel the "AI" working
      setTimeout(() => {
        setAnimating(false);
        // Refresh the data to clear the dispatched clusters from the screen
        fetchCityData(selectedCity);
      }, 2000);
    } catch (e) {
      setAnimating(false);
    }
  };

  if (!selectedCity || loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2>AI Route Optimization</h2>
            <p>Vehicle Routing Problem (VRP) solver with traffic awareness and cluster priority</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select 
              style={{ width: "200px", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", outline: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c} Zone</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-glass" style={{ textAlign: "center", padding: "60px 40px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CheckCircle size={48} style={{ color: "var(--success)", opacity: 0.8 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>All caught up in {selectedCity}!</div>
            <div style={{ marginTop: 4 }}>No active or forming clusters available right now to optimize.</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}
            onClick={async () => {
              setLoading(true);
              try {
                await fetch("/api/optimize", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ city: selectedCity })
                });
                fetchCityData(selectedCity);
              } catch (e) {
                setLoading(false);
              }
            }}
          >
            <RefreshCw size={14} /> Reset Demo Data
          </button>
        </div>
      </div>
    );
  }

  const savings = {
    distance: data.traditional.distance - data.optimized.distance,
    fuel: (data.traditional.fuel - data.optimized.fuel).toFixed(1),
    time: "1h 15m", // Mock time saving difference for visual impact
    cost: data.traditional.cost - data.optimized.cost,
    co2: (data.traditional.co2 - data.optimized.co2).toFixed(1),
    vehicles: data.traditional.vehicles - data.optimized.vehicles,
  };

  const getPathString = (route: any[]) => {
    return route.map(p => p.name).join(" → ");
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>AI Route Optimization</h2>
          <p>Vehicle Routing Problem (VRP) solver with traffic awareness and cluster priority</p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select 
            style={{ width: "200px", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", outline: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c} Zone</option>
            ))}
          </select>
        </div>
      </div>

      {/* Savings Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Distance Reduced", val: `${savings.distance} km`, icon: <Navigation size={16} />, color: "var(--myntra-pink)" },
          { label: "Fuel Saved", val: `${savings.fuel} L`, icon: <Fuel size={16} />, color: "var(--success)" },
          { label: "Time Saved", val: savings.time, icon: <Clock size={16} />, color: "var(--info)" },
          { label: "Cost Saved", val: `₹${savings.cost.toLocaleString()}`, icon: <DollarSign size={16} />, color: "var(--success)" },
          { label: "CO₂ Reduced", val: `${savings.co2} kg`, icon: <TrendingDown size={16} />, color: "var(--success)" },
          { label: "Vehicles Freed", val: `${savings.vehicles} vehicles`, icon: <Truck size={16} />, color: "var(--myntra-purple)" },
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ textAlign: "center", padding: 14 }}>
            <div style={{ color: item.color, display: "flex", justifyContent: "center", marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.val}</div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Route Comparison */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Traditional */}
        <div className="card" style={{ border: "1.5px solid var(--danger)" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5A5A", display: "inline-block" }} />
              <div className="card-title">Traditional Route</div>
            </div>
            <span className="badge red">Inefficient</span>
          </div>
          <RouteMap route={data.traditional.route} type="traditional" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
            {[
              { l: "Distance", v: `${data.traditional.distance} km` },
              { l: "Fuel Used", v: `${data.traditional.fuel} L` },
              { l: "Time", v: data.traditional.time },
              { l: "Cost", v: `₹${data.traditional.cost.toLocaleString()}` },
              { l: "Vehicles", v: `${data.traditional.vehicles}` },
              { l: "CO₂", v: `${data.traditional.co2} kg` },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "8px", borderRadius: "var(--radius-sm)", background: "rgba(255,90,90,0.06)" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--danger)" }}>{item.v}</div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{item.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(255,90,90,0.06)", borderRadius: "var(--radius-md)", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            🛣️ {getPathString(data.traditional.route)}
          </div>
        </div>

        {/* AI Optimized */}
        <div className="card" style={{ border: "1.5px solid var(--success)" }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D084", display: "inline-block", boxShadow: "0 0 8px #00D084" }} />
              <div className="card-title">AI Optimized Route</div>
            </div>
            <span className="badge green">Optimal</span>
          </div>
          <RouteMap route={data.optimized.route} type="optimized" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
            {[
              { l: "Distance", v: `${data.optimized.distance} km` },
              { l: "Fuel Used", v: `${data.optimized.fuel} L` },
              { l: "Time", v: data.optimized.time },
              { l: "Cost", v: `₹${data.optimized.cost.toLocaleString()}` },
              { l: "Vehicles", v: `${data.optimized.vehicles}` },
              { l: "CO₂", v: `${data.optimized.co2} kg` },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "8px", borderRadius: "var(--radius-sm)", background: "rgba(0,208,132,0.06)" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--success)" }}>{item.v}</div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{item.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(0,208,132,0.06)", borderRadius: "var(--radius-md)", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            🚀 {getPathString(data.optimized.route)}
          </div>
        </div>
      </div>

      {/* Optimize Button + VRP Info */}
      <div className="grid-cols-2" style={{ gap: 20 }}>
        <div className="card-glass" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Navigation size={28} style={{ color: "white" }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Apply AI Optimized Route</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              Re-dispatch {selectedCity} deliveries using AI-calculated VRP route
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: "12px 32px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
            onClick={handleOptimize}
          >
            {animating ? <><CheckCircle size={16} /> Applied!</> : <><Zap size={16} /> Optimize Now</>}
          </button>
          {animating && (
            <div style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
              ✅ Route optimized · Saving ₹{savings.cost.toLocaleString()} on this run!
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">VRP Optimization Techniques</div>
            <span className="badge pink">AI Engine</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Vehicle Routing Problem (VRP)", desc: "Calculates optimal multi-stop routes minimizing total distance" },
              { title: "3D Volumetric Constraints", desc: "Maps vehicle capacity strictly to order dimensions (L×W×H) instead of unit count" },
              { title: "Distance Optimization", desc: "Nearest neighbor + 2-opt swapping algorithm for shortest path" },
              { title: "Traffic Awareness", desc: "Real-time congestion data from IMD and traffic APIs" },
              { title: "Cluster Priority", desc: "Dispatch full clusters first to maximize savings per vehicle" },
              { title: "Time Window Constraints", desc: "Respects delivery time windows and warehouse schedules" },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle size={14} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
