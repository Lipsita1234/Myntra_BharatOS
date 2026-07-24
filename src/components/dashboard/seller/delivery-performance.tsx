"use client";

import React, { useState, useEffect } from "react";
import { Truck, Clock, AlertTriangle, CheckCircle, TrendingDown, Sparkles, Package, ArrowRight, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

import { RefreshCw } from "lucide-react";

export default function DeliveryPerformance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/delivery")
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  const overallMetrics = [
    { label: "Avg Delivery Time", value: `${data.overall.avgDeliveryTime} days`, color: "var(--info)", icon: <Clock size={20} /> },
    { label: "On-Time Delivery", value: `${data.overall.onTimeRate}%`, color: "var(--success)", icon: <CheckCircle size={20} /> },
    { label: "Delayed Shipments", value: `${data.overall.delayedRate}%`, color: "var(--danger)", icon: <TrendingDown size={20} /> },
    { label: "Avg Shipping Cost", value: `₹${data.overall.avgShippingCost}`, color: "var(--warning)", icon: <Package size={20} /> },
    { label: "Cluster Rate", value: `${data.overall.clusterRate}%`, color: "var(--myntra-purple)", icon: <Sparkles size={20} /> },
  ];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h2>Delivery Performance Dashboard</h2>
        <p>Monitor delivery efficiency, detect delays early, and receive AI-powered logistics suggestions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {overallMetrics.map((m, idx) => (
          <div key={idx} className="card" style={{ textAlign: "center", padding: "16px 8px" }}>
            <div style={{ color: m.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{m.value}</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-tertiary)", marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 24, marginBottom: 24, alignItems: "start" }}>
        
        {/* Left Side: Charts & Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Weekly Trend */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Weekly On-Time vs Delayed Deliveries</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="onTime" name="On-Time %" fill="var(--success)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delayed" name="Delayed %" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Regional delivery time bar chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Avg Delivery Time by Region (Days)</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.regionDelivery} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
                  <YAxis type="category" dataKey="region" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar
                    dataKey="avgTime"
                    name="Avg Days"
                    fill="var(--myntra-pink)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Full Regional Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Regional Delivery Breakdown</div>
              <span className="badge blue">All Regions</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Avg Delivery Time</th>
                    <th>On-Time Rate</th>
                    <th>Delayed</th>
                    <th>Avg Shipping Cost</th>
                    <th>Cluster Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.regionDelivery.map((r: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{r.region}</td>
                      <td>{r.avgTime} days</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar" style={{ flex: 1, minWidth: 100 }}>
                            <div className="progress-fill" style={{ width: `${r.onTime}%`, background: r.onTime >= 94 ? "var(--success)" : r.onTime >= 88 ? "var(--warning)" : "var(--error)" }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, width: 40 }}>{r.onTime}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.delayed > 10 ? "red" : r.delayed > 6 ? "orange" : "green"}`}>{r.delayed}%</span>
                      </td>
                      <td>₹{r.cost}</td>
                      <td>{r.cluster}%</td>
                      <td>
                        <span className={`badge ${r.onTime >= 94 ? "green" : r.onTime >= 88 ? "orange" : "red"}`}>
                          {r.onTime >= 94 ? "Excellent" : r.onTime >= 88 ? "Good" : "⚠ Needs Attention"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Alerts */}
        <div className="card" style={{ height: "100%" }}>
          <div className="card-header" style={{ paddingBottom: 16 }}>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18} style={{ color: "var(--danger)" }} /> AI Delivery Alerts
            </div>
            <span className="badge red">{data.alerts.length} Active</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.alerts.map((alert: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: `1.5px solid ${alert.severity === "high" ? "var(--danger)" : "var(--warning)"}`,
                  background: alert.severity === "high" ? "rgba(255,90,90,0.04)" : "rgba(255,181,71,0.04)",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: alert.severity === "high" ? "rgba(255,90,90,0.12)" : "rgba(255,181,71,0.12)",
                  color: alert.severity === "high" ? "var(--danger)" : "var(--warning)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Truck size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 13 }}>Alert · {alert.region}</strong>
                    <span className={`badge ${alert.severity === "high" ? "red" : "orange"}`} style={{ fontSize: 9, padding: "2px 6px" }}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, lineHeight: 1.4 }}>{alert.issue}</p>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, fontWeight: 600, color: "var(--success)", lineHeight: 1.4 }}>
                    <Sparkles size={12} style={{ flexShrink: 0, marginTop: 2 }} /> 
                    <span>Suggested Action: <span style={{ color: "var(--text-primary)" }}>{alert.suggestion}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
