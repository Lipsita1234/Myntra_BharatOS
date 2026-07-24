"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Brain, AlertTriangle, TrendingUp, Users, CloudRain, Bell, RefreshCw, CheckCircle, Flame } from "lucide-react";

interface Insight {
  id: number;
  type: "success" | "warning" | "info" | "trend";
  category: string;
  text: string;
  timestamp: string;
  impact: string;
}

interface AlertForecast {
  id: number;
  type: "capacity" | "weather" | "spike";
  title: string;
  prob: number;
  impactTime: string;
  description: string;
  recommendation: string;
  actionTaken: boolean;
}

const initialInsights: Insight[] = [
  { id: 1, type: "success", category: "Cost Savings", text: "Logistics delivery cost has reduced by 18% compared to last week due to smart clustering.", timestamp: "10 mins ago", impact: "-₹1.4 Lakhs/day" },
  { id: 2, type: "info", category: "Community", text: "Community Delivery participation increased by 12% in Karnataka Tier-2 corridors.", timestamp: "2 hours ago", impact: "68% total usage" },
  { id: 3, type: "warning", category: "Warehouse Capacity", text: "Warehouse utilization in Hyderabad (WH-004) has crossed 95% threshold limit.", timestamp: "3 hours ago", impact: "Risk of inbound queue delays" },
  { id: 4, type: "trend", category: "Demand Spike", text: "Demand for Ethnic Wear is expected to increase in Odisha next week ahead of Rath Yatra festival.", timestamp: "5 hours ago", impact: "+24% predicted demand" },
  { id: 5, type: "success", category: "Carbon Reduction", text: "Consolidated packaging operations saved approximately 420kg CO₂ emissions today.", timestamp: "1 day ago", impact: "587 trees equivalent" },
];

const initialAlerts: AlertForecast[] = [
  {
    id: 1, type: "capacity", title: "Warehouse Capacity Alert (98%)", prob: 98, impactTime: "2 days",
    description: "Jaipur Regional Hub (WH-005) is receiving incoming festival inventory exceeding maximum processing speed.",
    recommendation: "Increase temporary worker dispatch by 12% and route new North India express orders to Jaipur-B hub.",
    actionTaken: false
  },
  {
    id: 2, type: "weather", title: "Assam Rainfall Corridor Block", prob: 88, impactTime: "12 hours",
    description: "IMD forecast predicts heavy rainfall and flash flood warnings along the NH-37 corridor in Assam.",
    recommendation: "Proactively reroute all Silchar-bound deliveries via secondary hilly highways (+45 mins transit, safe from flood blocks).",
    actionTaken: false
  },
  {
    id: 3, type: "spike", title: "Raksha Bandhan Regional Demand Spike", prob: 95, impactTime: "5 days",
    description: "AI demand forecasting predicts a major surge in Ethnic Wear and accessory purchases in Haryana, Punjab and Uttar Pradesh.",
    recommendation: "Pre-position 15,000 top-selling SKUs at Delhi NCR warehouse to guarantee same-day deliveries.",
    actionTaken: false
  }
];

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [alerts, setAlerts] = useState<AlertForecast[]>(initialAlerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyRecommendation = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, actionTaken: true } : a));
  };

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/insights");
      const data = await res.json();
      if (data.success && data.insights && data.alerts) {
        setInsights(data.insights);
        setAlerts(data.alerts);
      } else {
        setError(data.error || "Failed to load insights.");
      }
    } catch {
      setError("Network error. Showing cached data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRefresh = () => fetchInsights();

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>AI Insights & Predictive Alerts</h2>
          <p>Proactive logistics optimization using live database telemetry and Gemini AI</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }} disabled={loading}>
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Generating..." : "Refresh Insights"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(255,90,90,0.08)", border: "1px solid rgba(255,90,90,0.2)", color: "#FF5A5A", fontSize: 13, marginBottom: 16 }}>
          ⚠️ {error} Showing last known data.
        </div>
      )}

      {loading && (
        <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <RefreshCw size={16} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
          Gemini AI is analyzing your live logistics data...
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, opacity: loading ? 0.5 : 1, transition: "opacity 0.3s" }}>
        {/* Left Column: Live AI Insights */}
        <div>
          <div className="card-header" style={{ paddingLeft: 0, marginBottom: 14 }}>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={18} style={{ color: "#FF3F6C" }} />
              <span>Real-Time AI Insights Panel</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {insights.map((ins) => {
              const borderColors = {
                success: "#00D084",
                warning: "#FF5A5A",
                info: "#00C2FF",
                trend: "#6C63FF"
              };
              return (
                <div key={ins.id} style={{ padding: "16px 20px", borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `5px solid ${borderColors[ins.type]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: borderColors[ins.type], textTransform: "uppercase", letterSpacing: "0.5px" }}>{ins.category}</span>
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{ins.timestamp}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 8 }}>{ins.text}</p>
                  <div style={{ fontSize: 11.5, color: borderColors[ins.type], fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={11} /> Expected Impact: {ins.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Predictive Alerts / Warnings */}
        <div>
          <div className="card-header" style={{ paddingLeft: 0, marginBottom: 14 }}>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={18} style={{ color: "#FFB547" }} />
              <span>Predictive Alerts Center</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {alerts.map((al) => {
              const theme = al.type === "capacity" ? { bg: "rgba(255,90,90,0.04)", border: "#FF5A5A", icon: <AlertTriangle size={16} /> }
                          : al.type === "weather" ? { bg: "rgba(0,194,255,0.04)", border: "#00C2FF", icon: <CloudRain size={16} /> }
                          : { bg: "rgba(255,181,71,0.04)", border: "#FFB547", icon: <Flame size={16} /> };

              return (
                <div key={al.id} style={{ padding: "18px 20px", borderRadius: "var(--radius-md)", background: theme.bg, border: `1.5px solid ${al.actionTaken ? "var(--border)" : theme.border}`, opacity: al.actionTaken ? 0.7 : 1, transition: "all 0.3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13.5, color: al.actionTaken ? "var(--text-secondary)" : theme.border }}>
                      {theme.icon} {al.title}
                    </div>
                    <span className="badge" style={{ background: "var(--border)", border: "1px solid var(--border)", fontSize: 10 }}>Probability: {al.prob}%</span>
                  </div>

                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>{al.description}</p>

                  <div style={{ background: "var(--bg-tertiary)", padding: "10px 12px", borderRadius: 6, fontSize: 11.5, color: "var(--text-primary)", marginBottom: 12, border: "1px solid var(--border)" }}>
                    <strong>Recommended Action:</strong> {al.recommendation}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Estimated Impact in: <strong>{al.impactTime}</strong></span>
                    <button
                      className={`btn btn-sm ${al.actionTaken ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => handleApplyRecommendation(al.id)}
                      disabled={al.actionTaken}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      {al.actionTaken ? <><CheckCircle size={12} /> Optimization Applied</> : "Apply Recommendation"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        :global(.spin) { animation: spin 1.2s linear infinite; }
      `}</style>
    </div>
  );
}
