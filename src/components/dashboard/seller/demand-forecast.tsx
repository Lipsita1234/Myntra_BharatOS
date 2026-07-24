"use client";

import React, { useState, useEffect } from "react";
import { Brain, CloudSun, Calendar, History, Sparkles, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Area, AreaChart
} from "recharts";

export default function DemandForecast() {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const dynamicForecastData = selectedForecast ? [
    { week: "Week 1", actual: Math.round(selectedForecast.currentDemand * 0.85), predicted: null },
    { week: "Week 2", actual: Math.round(selectedForecast.currentDemand * 0.95), predicted: null },
    { week: "Week 3", actual: selectedForecast.currentDemand, predicted: selectedForecast.currentDemand },
    { week: "Week 4", actual: null, predicted: Math.round(selectedForecast.currentDemand + (selectedForecast.predictedDemand - selectedForecast.currentDemand) * 0.33) },
    { week: "Week 5", actual: null, predicted: Math.round(selectedForecast.currentDemand + (selectedForecast.predictedDemand - selectedForecast.currentDemand) * 0.66) },
    { week: "Week 6", actual: null, predicted: selectedForecast.predictedDemand },
  ] : [];

  const dynamicSeasonalFactors = selectedForecast?.weights ? [
    { name: "Historical Sales", score: selectedForecast.weights.historical, color: "#6C63FF", desc: "3Y pattern analysis active" },
    { name: "Festival Calendar", score: selectedForecast.weights.festival, color: "#FF3F6C", desc: "Holiday calendar synced" },
    { name: "Seasonal Trends", score: selectedForecast.weights.seasonal, color: "#00C2FF", desc: "Seasonal patterns detected" },
    { name: "Regional Buying", score: selectedForecast.weights.regional, color: "#00D084", desc: "Local cluster mapping" },
    { name: "Weather Impact", score: selectedForecast.weights.weather, color: "#FFB547", desc: "Meteorological forecast" },
  ] : [];

  useEffect(() => {
    fetch("/api/seller/demand")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.forecasts.length > 0) {
          const items = d.forecasts.map((f: any) => ({
            id: f.id,
            region: f.region,
            product: f.product,
            change: f.change,
            confidence: f.confidence,
            factor: f.factor,
            currentDemand: f.currentDemand,
            predictedDemand: f.predictedDemand,
            weights: f.weights,
            insights: f.insights
          }));
          setForecasts(items);
          setSelectedForecast(items[0]);
          if (d.explanation) setAiExplanation(d.explanation);
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

  const chartData = forecasts.map((item) => ({
    name: item.region,
    current: item.currentDemand,
    predicted: item.predictedDemand,
    change: item.change,
  }));

  return (
    <div>
      <div className="page-header">
        <h2>AI Demand Forecasting</h2>
        <p>Predict regional product demand using historical sales, festivals, seasonal patterns & weather data</p>
      </div>

      {/* Highlighted Forecast Card */}
      <div className="grid-cols-3" style={{ marginBottom: 24 }}>
        {selectedForecast && (
          <div className="card-glass" style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span className="badge pink" style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Brain size={12} /> AI Demand Forecast
              </span>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>REGION</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>{selectedForecast.region}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>PRODUCT</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>{selectedForecast.product}</div>

              <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>EXPECTED DEMAND INCREASE</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: selectedForecast.change >= 0 ? "var(--myntra-pink)" : "var(--error)" }}>
                    {selectedForecast.change > 0 ? "+" : ""}{selectedForecast.change}%
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Next 7 Days</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>CONFIDENCE SCORE</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "var(--success)" }}>{selectedForecast.confidence}%</div>
                </div>
              </div>

              <div style={{
                padding: "10px 14px", borderRadius: "var(--radius-md)",
                background: "var(--primary-muted)", border: "1.5px dashed var(--myntra-pink)",
                fontSize: 12, color: "var(--text-secondary)"
              }}>
                <strong style={{ color: "var(--myntra-pink)" }}>📍 Trigger Factor:</strong> {selectedForecast.factor}
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {forecasts.slice(0, 5).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedForecast(item)}
                  style={{
                    padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
                    background: selectedForecast?.id === item.id ? "var(--primary-muted)" : "transparent",
                    cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
                    outline: selectedForecast?.id === item.id ? "1.5px solid var(--myntra-pink)" : "none",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{item.region} – {item.product}</span>
                  <span style={{ color: item.change >= 0 ? "var(--success)" : "var(--error)", fontWeight: 700, fontSize: 12 }}>
                    {item.change > 0 ? "+" : ""}{item.change}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forecast Trend Line Chart */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div className="card-title">6-Week Demand Forecast Trend</div>
            <span className="badge pink"><Sparkles size={10} style={{ marginRight: 4 }} /> Predictive AI</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dynamicForecastData}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3F6C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF3F6C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <ReferenceLine x="Week 3" stroke="var(--text-tertiary)" strokeDasharray="4 4" label={{ value: "Today", fill: "var(--text-tertiary)", fontSize: 11 }} />
              <Area type="monotone" dataKey="actual" name="Actual Demand" stroke="#6C63FF" fill="url(#actualGrad)" strokeWidth={2.5} connectNulls={false} />
              <Area type="monotone" dataKey="predicted" name="AI Predicted" stroke="#FF3F6C" fill="url(#predGrad)" strokeWidth={2.5} strokeDasharray="6 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Regional Demand Comparison: Current vs AI Predicted</div>
          <span className="badge blue">All Regions</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="current" name="Current Demand" fill="var(--text-tertiary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="predicted" name="AI Predicted (7 Days)" fill="var(--myntra-pink)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Explanation Banner */}
      {aiExplanation && (
        <div className="card" style={{ marginBottom: 24, background: "linear-gradient(to right, rgba(108, 99, 255, 0.05), rgba(255, 63, 108, 0.05))", border: "1px solid rgba(108, 99, 255, 0.2)" }}>
          <div className="card-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--myntra-pink)" }}>
              <Brain size={18} /> Copilot AI Insight
            </div>
          </div>
          <div style={{ padding: "0 20px 20px 20px" }}>
            <div 
              style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}
              dangerouslySetInnerHTML={{ __html: aiExplanation }}
            />
          </div>
        </div>
      )}

      {/* AI Prediction Factors */}
      <div className="grid-cols-3">
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CloudSun size={18} style={{ color: "var(--info)" }} /> Meteorological Triggers
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
            <span dangerouslySetInnerHTML={{ __html: selectedForecast?.insights?.weather || "Loading weather insights..." }} />
          </p>
          <span className="badge blue">Weather Model Active</span>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={18} style={{ color: "var(--myntra-pink)" }} /> Cultural Holidays
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
            <span dangerouslySetInnerHTML={{ __html: selectedForecast?.insights?.festival || "Loading calendar insights..." }} />
          </p>
          <span className="badge pink">Holiday Calendar Sync</span>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <History size={18} style={{ color: "var(--success)" }} /> Historical Order Logs
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
            <span dangerouslySetInnerHTML={{ __html: selectedForecast?.insights?.historical || "Loading historical data..." }} />
          </p>
          <span className="badge green">3Y Historical Weights</span>
        </div>
      </div>

      {/* Prediction Factors Scores */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">AI Model Signal Weights</div>
          <span className="badge green">Model v2.4 Active</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {dynamicSeasonalFactors.map((f, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: f.color }}>{f.score}%</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>{f.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{f.desc}</div>
              <div className="progress-bar" style={{ height: 4, marginTop: 8 }}>
                <div className="progress-fill" style={{ width: `${f.score}%`, background: f.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
