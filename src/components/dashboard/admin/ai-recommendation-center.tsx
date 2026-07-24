"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, CheckCircle, MapPin, Warehouse, Layers, RefreshCw } from "lucide-react";

interface Recommendation {
  id: number;
  type: "microhub" | "inventory" | "cluster";
  title: string;
  reason: string;
  savings: string;
  metric: string;
  details: string;
  status: "pending" | "approved" | "ignored";
}

export default function AIRecommendationCenter() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/recommendations");
      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecs(data.recommendations.map((r: any) => ({ ...r, status: "pending" })));
      } else {
        setError(data.error || "Failed to load recommendations.");
      }
    } catch {
      setError("Network error. Could not reach the AI service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  const handleAction = (id: number, status: "approved" | "ignored") => {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "microhub": return <MapPin size={20} style={{ color: "#FF3F6C" }} />;
      case "inventory": return <Warehouse size={20} style={{ color: "#00C2FF" }} />;
      default: return <Layers size={20} style={{ color: "#6C63FF" }} />;
    }
  };

  const pending = recs.filter(r => r.status === "pending");
  const approved = recs.filter(r => r.status === "approved");

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>AI Recommendation Center</h2>
          <p>Strategic recommendations generated live by Gemini AI from your real logistics data</p>
        </div>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="btn btn-secondary btn-sm"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Generating..." : "Refresh"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Main List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Loading state */}
          {loading && (
            <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
              <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)", margin: "0 auto 12px" }} />
              <div style={{ fontSize: 13 }}>Gemini AI is analysing your live warehouse, cluster, and demand data...</div>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(255,90,90,0.08)", border: "1px solid rgba(255,90,90,0.2)", color: "#FF5A5A", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* All processed */}
          {!loading && !error && pending.length === 0 && (
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, color: "var(--text-tertiary)" }}>
              <CheckCircle size={48} style={{ color: "#00D084", marginBottom: 12 }} />
              <h3>All Recommendations Processed</h3>
              <p style={{ fontSize: 13, marginTop: 4 }}>Click Refresh to generate new AI recommendations</p>
            </div>
          )}

          {/* Pending recommendations */}
          {!loading && pending.map((rec) => (
            <div key={rec.id} className="card-glass" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {getIcon(rec.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800 }}>{rec.title}</h3>
                    <span className="badge pink" style={{ fontSize: 10, flexShrink: 0, marginLeft: 8 }}>AI Recommendation</span>
                  </div>

                  <p style={{ fontSize: 12.5, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 8 }}>
                    <strong>Reasoning:</strong> {rec.reason}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>
                    <strong>Implementation:</strong> {rec.details}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ fontSize: 11, color: "#00D084" }}>
                        Estimated Savings: <strong style={{ fontSize: 12.5 }}>{rec.savings}</strong>
                      </div>
                      <div style={{ fontSize: 11, color: "#6C63FF" }}>
                        Efficiency Gain: <strong style={{ fontSize: 12.5 }}>{rec.metric}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleAction(rec.id, "ignored")}>Decline</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(rec.id, "approved")} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        Approve <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">This Session</div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {[
                { label: "Generated", val: recs.length, color: "var(--text-primary)" },
                { label: "Pending", val: pending.length, color: "#FFB547" },
                { label: "Approved", val: approved.length, color: "#00D084" },
                { label: "Declined", val: recs.filter(r => r.status === "ignored").length, color: "#FF5A5A" },
              ].map(stat => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{stat.label}</span>
                  <strong style={{ color: stat.color }}>{stat.val}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Approved Recommendations</div></div>
            {approved.length === 0 ? (
              <div style={{ fontSize: 11.5, color: "var(--text-tertiary)", textAlign: "center", padding: "14px 0" }}>
                No recommendations approved yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                {approved.map(r => (
                  <div key={r.id} style={{ display: "flex", gap: 8, fontSize: 11.5, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                    <CheckCircle size={13} style={{ color: "#00D084", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.title}</div>
                      <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Savings: {r.savings}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-tertiary)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
            <Sparkles size={12} style={{ display: "inline", marginRight: 4, color: "var(--myntra-pink)" }} />
            Recommendations are generated fresh from your live warehouse, cluster, and demand forecast data each time.
          </div>
        </div>
      </div>
    </div>
  );
}
