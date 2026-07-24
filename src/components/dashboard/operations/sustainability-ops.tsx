"use client";

import React from "react";
import { Leaf, Zap, Navigation, Package, TrendingDown, Wind, TreePine, Download } from "lucide-react";
import {
  AreaChart, Area, ComposedChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell, Legend
} from "recharts";

const dailyImpact = [
  { day: "Mon",   fuel: 28,  co2: 1.8,  distance: 140 },
  { day: "Tue",   fuel: 32,  co2: 2.1,  distance: 160 },
  { day: "Wed",   fuel: 25,  co2: 1.6,  distance: 125 },
  { day: "Thu",   fuel: 36,  co2: 2.4,  distance: 180 },
  { day: "Fri",   fuel: 41,  co2: 2.7,  distance: 205 },
  { day: "Sat",   fuel: 49,  co2: 3.2,  distance: 245 },
  { day: "Today", fuel: 184, co2: 12.8, distance: 920 },
];

const pieData = [
  { name: "EV Vans",        value: 44, color: "#00D084" },
  { name: "Shared Routes",  value: 28, color: "#6C63FF" },
  { name: "Cluster Dispatch", value: 18, color: "#FF3F6C" },
  { name: "Micro Hub",      value: 10, color: "#00C2FF" },
];

const monthlyImpact = [
  { month: "Jan", fuel: 780,  trees: 42 },
  { month: "Feb", fuel: 820,  trees: 48 },
  { month: "Mar", fuel: 950,  trees: 55 },
  { month: "Apr", fuel: 1080, trees: 61 },
  { month: "May", fuel: 1240, trees: 70 },
  { month: "Jun", fuel: 1420, trees: 82 },
  { month: "Jul", fuel: 1580, trees: 91 },
];

const todayStats = [
  { label: "Fuel Saved",       value: "184",   unit: "Litres",    color: "#00D084", icon: <Zap size={20} /> },
  { label: "CO₂ Reduced",      value: "1.2",   unit: "Tons",      color: "#00C2FF", icon: <Wind size={20} /> },
  { label: "Distance Saved",   value: "920",   unit: "km",        color: "#6C63FF", icon: <Navigation size={20} /> },
  { label: "Cost Saved",       value: "₹4.2L", unit: "today",     color: "#FF3F6C", icon: <TrendingDown size={20} /> },
  { label: "Trees Equivalent", value: "587",   unit: "trees",     color: "#00D084", icon: <TreePine size={20} /> },
  { label: "Trips Reduced",    value: "3,240", unit: "trips",     color: "#FFB547", icon: <Package size={20} /> },
  { label: "Pkg Optimised",    value: "23%",   unit: "reduction", color: "#00C2FF", icon: <Package size={20} /> },
];

const esgTargets = [
  { target: "CO₂ Reduction",       goal: "150 Tons",      current: 98.4, unit: " T", pct: 66 },
  { target: "Fuel Efficiency",      goal: "20% reduction", current: 18.2, unit: "%",  pct: 91 },
  { target: "EV Fleet Coverage",    goal: "50% EV",        current: 44,   unit: "%",  pct: 88 },
  { target: "Packaging Optimized",  goal: "30% reduction", current: 23,   unit: "%",  pct: 77 },
];

export default function SustainabilityOps() {
  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Sustainability Analytics</h2>
          <p>Track BharatOS's daily environmental impact across the national logistics network</p>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Download size={14} /> ESG Report
        </button>
      </div>

      {/* Today's Impact Hero */}
      <div style={{
        padding: "28px 32px", borderRadius: "var(--radius-lg)", marginBottom: 24,
        background: "linear-gradient(135deg, rgba(0,208,132,0.08), rgba(0,194,255,0.08))",
        border: "1.5px solid rgba(0,208,132,0.2)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#00D084", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Leaf size={14} /> Today's Environmental Impact
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 20 }}>
          {todayStats.map((item, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ color: item.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{item.unit}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-secondary)", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Daily Fuel Savings Area Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Daily Fuel Savings (Litres)</div>
            <span className="badge green">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyImpact}>
              <defs>
                <linearGradient id="sustFuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00D084" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D084" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC" }}
              />
              <Area type="monotone" dataKey="fuel" name="Fuel Saved (L)" stroke="#00D084" fill="url(#sustFuelGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Breakdown Pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Savings by Delivery Method</div>
            <span className="badge blue">Breakdown</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend — ComposedChart for dual bars */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Monthly CO₂ Reduction & Tree Equivalents</div>
          <span className="badge green">2024 YTD</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={monthlyImpact}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 12 }} />
            <YAxis yAxisId="left"  tick={{ fill: "#94A3B8", fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} />
            <Legend />
            <Bar yAxisId="left"  dataKey="fuel"  name="Fuel Saved (L)"     fill="#00D084" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="trees" name="Tree Equivalents"    fill="#6C63FF" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ESG Targets */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">ESG Target Progress – FY 2024</div>
          <span className="badge pink">On Track</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {esgTargets.map((item, idx) => {
            const color = item.pct >= 90 ? "#00D084" : item.pct >= 70 ? "#FFB547" : "#FF5A5A";
            return (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.target}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color }}>
                  {item.current}{item.unit}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 10 }}>
                  Goal: {item.goal}
                </div>
                <div style={{ background: "var(--border)", borderRadius: 999, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 6 }}>
                  {item.pct}% of target
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
