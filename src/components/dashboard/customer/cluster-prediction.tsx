"use client";

import React, { useState, useEffect } from "react";
import { Brain, Sparkles, CheckCircle, RefreshCw } from "lucide-react";

export default function ClusterPrediction() {
  const [region, setRegion] = useState("Koramangala Sector 4");
  const [prediction, setPrediction] = useState<any>({
    probabilityPercent: 91,
    estimatedTimeMinutes: 45,
    expectedMembersCount: 8,
    sustainabilityOffsetKgCO2: 1.2
  });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getPrediction = (selectedRegion: string) => {
    setLoading(true);
    fetch("/api/customer/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: selectedRegion })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.prediction) {
          setPrediction(data.prediction);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getHistory = () => {
    fetch("/api/customer/clusters")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.clusters) {
          setHistory(data.clusters.slice(0, 5));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    getPrediction(region);
    getHistory();
  }, [region]);

  const circleColor = prediction.probabilityPercent >= 75 ? "var(--success)" : "var(--warning)";

  return (
    <div>
      <div className="page-header">
        <h2>AI Cluster Prediction</h2>
        <p>Real-time machine learning prediction models forecasting cluster viability</p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: 24 }}>
        {/* ML Recommendation Engine */}
        <div className="card-glass" style={{ position: "relative" }}>
          {loading && (
            <div style={{ position: "absolute", inset: 0, background: "var(--bg-card)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-lg)", zIndex: 10 }}>
              <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
            </div>
          )}
          <div className="card-header">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={18} style={{ color: "var(--myntra-pink)" }} />
              <span>AI Recommendation Engine</span>
            </div>
            <span className="badge pink">Gemini AI Active</span>
          </div>

          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "8px solid var(--border)",
                borderTopColor: circleColor,
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
                transition: "border-color 0.3s ease"
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 900, color: circleColor }}>{prediction.probabilityPercent}%</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: 600 }}>Probability</div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {prediction.probabilityPercent >= 75 ? "High Cluster Completion Viability" : "Moderate Cluster Completion Viability"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
              Expected Completion: <strong>Within {prediction.estimatedTimeMinutes} Minutes</strong>
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Based on historical purchasing trends, weather, and active shopper traffic.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: "var(--radius-md)",
              background: prediction.probabilityPercent >= 75 ? "rgba(16, 185, 129, 0.08)" : "rgba(245, 158, 11, 0.08)",
              border: prediction.probabilityPercent >= 75 ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <CheckCircle size={20} style={{ color: prediction.probabilityPercent >= 75 ? "var(--success)" : "var(--warning)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: 13, color: prediction.probabilityPercent >= 75 ? "var(--success)" : "var(--warning)" }}>
                AI Recommendation: {prediction.probabilityPercent >= 75 ? `Wait ${prediction.estimatedTimeMinutes} minutes!` : "Direct shipment recommended"}
              </strong>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                {prediction.probabilityPercent >= 75 
                  ? `We project the group cluster will fully finalize soon. Expected Savings: ₹${prediction.expectedMembersCount * 15}. Delivery Date remains unchanged.`
                  : "We recommend proceeding with direct delivery to avoid delays as clustering traffic is currently low in this sector."}
              </p>
            </div>
          </div>
        </div>

        {/* Predictive Factors & Metrics */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Key Prediction Parameters</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Expected Active Shoppers", val: `${prediction.expectedMembersCount} members`, pct: Math.min(prediction.expectedMembersCount * 12, 100) },
              { label: "Predicted Carbon Reduction", val: `${prediction.sustainabilityOffsetKgCO2} kg CO2`, pct: Math.min(prediction.sustainabilityOffsetKgCO2 * 60, 100) },
              { label: "Cluster Density Rating", val: prediction.probabilityPercent >= 80 ? "Excellent" : "Average", pct: prediction.probabilityPercent },
              { label: "Weather Conditions Factor", val: "Favorable (Clear Sky)", pct: 98 },
            ].map((factor, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{factor.label}</span>
                  <strong>{factor.val}</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: `${factor.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginTop: 20, paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <div>
              <div style={{ color: "var(--text-tertiary)" }}>Forecast Confidence</div>
              <strong style={{ fontSize: 15 }}>94.2% Accuracy</strong>
            </div>
            <div>
              <div style={{ color: "var(--text-tertiary)" }}>Expected Arrival</div>
              <strong style={{ fontSize: 15 }}>Today, 4:30 PM</strong>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
