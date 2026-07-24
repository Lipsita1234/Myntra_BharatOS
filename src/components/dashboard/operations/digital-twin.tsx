"use client";

import React, { useState } from "react";
import { Sparkles, Play, CheckCircle, TrendingUp, MapPin, Warehouse, Layers, BarChart2, RefreshCw } from "lucide-react";

const scenarios = [
  {
    id: 1,
    title: "Open New Warehouse in Ranchi",
    icon: <Warehouse size={20} />,
    desc: "Simulate adding a 20,000-unit warehouse in Jharkhand to serve Tier-2 demand.",
    params: { cost: "₹1.2 Cr setup", coverage: "4 new districts" },
    baseline: { deliveryTime: "3.8 days", cost: "₹82/order", clusters: 156, efficiency: 91.4 },
    simulated: { deliveryTime: "2.9 days", cost: "₹61/order", clusters: 184, efficiency: 94.2, savings: "₹48L/year" },
    change: { time: "-0.9 days", cost: "-₹21/order", clusters: "+28", efficiency: "+2.8%" },
  },
  {
    id: 2,
    title: "Add 2 Micro Hubs in Odisha",
    icon: <MapPin size={20} />,
    desc: "Open temporary micro-hubs in Balasore and Cuttack for festival season.",
    params: { cost: "₹16,000/month", coverage: "Odisha Tier-2" },
    baseline: { deliveryTime: "3.1 days", cost: "₹74/order", clusters: 12, efficiency: 83 },
    simulated: { deliveryTime: "2.2 days", cost: "₹52/order", clusters: 24, efficiency: 91, savings: "₹56L/season" },
    change: { time: "-0.9 days", cost: "-₹22/order", clusters: "+12", efficiency: "+8%" },
  },
  {
    id: 3,
    title: "Festival Demand +40% (Odisha)",
    icon: <TrendingUp size={20} />,
    desc: "What if Nuakhai demand spikes 40% above predicted levels?",
    params: { trigger: "Demand surge", duration: "7 days" },
    baseline: { deliveryTime: "3.1 days", cost: "₹74/order", clusters: 12, efficiency: 83 },
    simulated: { deliveryTime: "4.4 days", cost: "₹112/order", clusters: 8, efficiency: 68, savings: "–" },
    change: { time: "+1.3 days ⚠", cost: "+₹38/order", clusters: "-4 strained", efficiency: "-15% ⚠" },
    warning: true,
  },
  {
    id: 4,
    title: "Mumbai Warehouse Goes Offline",
    icon: <Warehouse size={20} />,
    desc: "Simulate WH-002 (Mumbai) going offline for 48 hours — cascade effect analysis.",
    params: { impact: "75,000 units stalled", duration: "48 hours" },
    baseline: { deliveryTime: "2.4 days", cost: "₹52/order", clusters: 35, efficiency: 91 },
    simulated: { deliveryTime: "3.8 days", cost: "₹89/order", clusters: 18, efficiency: 74, savings: "–" },
    change: { time: "+1.4 days ⚠", cost: "+₹37/order", clusters: "-17 clusters", efficiency: "-17% ⚠" },
    warning: true,
  },
];

function ImpactBar({ label, before, after, unit, higher = false }: { label: string; before: string; after: string; unit?: string; higher?: boolean }) {
  const good = higher
    ? parseFloat(after) > parseFloat(before)
    : parseFloat(after) < parseFloat(before);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "var(--text-tertiary)" }}>Before: {before}{unit}</span>
          <span style={{ fontWeight: 700, color: good ? "var(--success)" : "var(--danger)" }}>After: {after}{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function DigitalTwin() {
  const [selected, setSelected] = useState(scenarios[0]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setDone(prev => [...prev, selected.id]);
    }, 2200);
  };

  const isRun = done.includes(selected.id);

  return (
    <div>
      <div className="page-header">
        <h2>Logistics AI Scenario Simulator</h2>
        <p>Simulate logistics decisions before implementing them — AI-powered scenario planning</p>
      </div>

      {/* Scenario Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 24 }}>
        {scenarios.map((s) => (
          <div
            key={s.id}
            onClick={() => { setSelected(s); setRunning(false); }}
            style={{
              padding: "16px 20px", borderRadius: "var(--radius-md)",
              border: selected.id === s.id ? "2px solid var(--myntra-pink)" : "1px solid var(--border)",
              background: selected.id === s.id ? "var(--primary-muted)" : "var(--bg-card)",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: s.warning ? "var(--danger)" : "var(--myntra-pink)" }}>{s.icon}</div>
              <strong style={{ fontSize: 14 }}>{s.title}</strong>
              {s.warning && <span className="badge orange" style={{ fontSize: 9 }}>⚠ Risk</span>}
              {done.includes(s.id) && <span className="badge green" style={{ fontSize: 9, marginLeft: "auto" }}>✓ Simulated</span>}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Simulation Panel */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Baseline */}
        <div className="card" style={{ border: "1.5px solid var(--border)" }}>
          <div className="card-header">
            <div className="card-title">📊 Current Baseline</div>
            <span className="badge blue">Actual</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {[
              { l: "Avg Delivery Time", v: selected.baseline.deliveryTime },
              { l: "Cost per Order", v: selected.baseline.cost },
              { l: "Active Clusters", v: String(selected.baseline.clusters) },
              { l: "Network Efficiency", v: `${selected.baseline.efficiency}%` },
            ].map((item, i) => (
              <div key={i} style={{ padding: 14, borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)" }}>{item.v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)" }}>
            <strong>Scenario:</strong> {selected.title}<br />
            {Object.entries(selected.params).map(([k, v]) => (
              <span key={k}>• {k.replace(/_/g," ")}: <strong>{v}</strong>  </span>
            ))}
          </div>
        </div>

        {/* Simulated Result */}
        <div className="card" style={{ border: `1.5px solid ${isRun ? (selected.warning ? "var(--danger)" : "var(--success)") : "var(--border)"}` }}>
          <div className="card-header">
            <div className="card-title">🤖 AI Simulation Result</div>
            {isRun ? <span className={`badge ${selected.warning ? "red" : "green"}`}>{selected.warning ? "⚠ Risk Detected" : "✅ Recommended"}</span> : <span className="badge blue">Pending</span>}
          </div>

          {isRun ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
                {[
                  { l: "Avg Delivery Time", v: selected.simulated.deliveryTime, good: !selected.warning },
                  { l: "Cost per Order", v: selected.simulated.cost, good: !selected.warning },
                  { l: "Active Clusters", v: String(selected.simulated.clusters), good: !selected.warning },
                  { l: "Network Efficiency", v: `${selected.simulated.efficiency}%`, good: !selected.warning },
                ].map((item, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: "var(--radius-md)", background: item.good ? "rgba(0,208,132,0.06)" : "rgba(255,90,90,0.06)", border: `1px solid ${item.good ? "rgba(0,208,132,0.2)" : "rgba(255,90,90,0.2)"}` }}>
                    <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", marginBottom: 4 }}>{item.l}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: item.good ? "var(--success)" : "var(--danger)" }}>{item.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: "var(--radius-md)", background: selected.warning ? "rgba(255,90,90,0.06)" : "rgba(0,208,132,0.06)", border: `1px solid ${selected.warning ? "var(--danger)" : "var(--success)"}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: selected.warning ? "var(--danger)" : "var(--success)" }}>
                  {selected.warning ? "⚠ Risk Analysis" : "✅ Impact Summary"}
                </div>
                {Object.entries(selected.change).map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{k.replace(/_/g," ")}</span>
                    <strong style={{ color: (v as string).includes("⚠") ? "var(--danger)" : v.toString().startsWith("+") && !selected.warning ? "var(--success)" : v.toString().startsWith("-") ? "var(--success)" : "var(--danger)" }}>
                      {v as string}
                    </strong>
                  </div>
                ))}
                {selected.simulated.savings !== "–" && (
                  <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800, color: "var(--success)" }}>
                    Projected Annual Savings: {selected.simulated.savings}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 220, gap: 16, color: "var(--text-tertiary)" }}>
              <BarChart2 size={48} style={{ opacity: 0.3 }} />
              <div style={{ textAlign: "center", fontSize: 13 }}>
                Run the simulation to see AI-predicted impact<br />on delivery time, cost, clusters, and efficiency.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Run Button */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button
          className="btn btn-primary"
          style={{ padding: "14px 48px", fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}
          onClick={handleRun}
          disabled={running}
        >
          {running ? (
            <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Simulating...</>
          ) : isRun ? (
            <><RefreshCw size={18} /> Re-Simulate</>
          ) : (
            <><Play size={18} /> Run AI Simulation</>
          )}
        </button>
        {isRun && !selected.warning && (
          <button className="btn btn-secondary" style={{ padding: "14px 32px", fontSize: 14 }}>
            <CheckCircle size={16} style={{ marginRight: 6 }} /> Approve & Implement
          </button>
        )}
      </div>

    </div>
  );
}
