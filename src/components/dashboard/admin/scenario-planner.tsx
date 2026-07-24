"use client";

import React, { useState } from "react";
import { Play, RefreshCw, Zap, CheckCircle, Warehouse, Fuel, Sparkles, AlertTriangle } from "lucide-react";

const SCENARIOS = [
  {
    id: 1, icon: <Warehouse size={28} style={{ color: "var(--myntra-pink)" }} />,
    title: "Open Warehouse in Ranchi",
    question: "What happens if we open a 20,000-unit warehouse in Jharkhand?",
    cost: "₹1.2 Cr setup · ₹18L/month ops",
  },
  {
    id: 2, icon: <Fuel size={28} style={{ color: "#FFB547" }} />,
    title: "Fuel Prices Increase 20%",
    question: "What if diesel prices rise by 20% starting next month?",
    cost: "External factor — no setup cost",
  },
  {
    id: 3, icon: <Sparkles size={28} style={{ color: "#00C2FF" }} />,
    title: "Diwali Demand Surge +40%",
    question: "What if demand spikes 40% during Diwali (Oct 28 – Nov 5)?",
    cost: "Pre-positioning: ₹8L inventory reallocation",
  },
  {
    id: 4, icon: <AlertTriangle size={28} style={{ color: "var(--error)" }} />,
    title: "Mumbai Warehouse Offline 48h",
    question: "What if WH-002 Mumbai goes offline for emergency maintenance?",
    cost: "Cascade rerouting cost: ~₹2.4L",
  },
];

interface SimResult {
  deliveryTime: { before: string; after: string; change: string };
  costPerOrder: { before: string; after: string; change: string };
  coverage: { before: string; after: string; change: string };
  carbon: { before: string; after: string; change: string };
  revenue: { before: string; after: string; change: string };
  recommendation: boolean;
  summary: string;
  keyChanges: string[];
}

export default function AIScenarioPlanner() {
  const [selected, setSelected] = useState(SCENARIOS[0]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<number, SimResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [implementing, setImplementing] = useState(false);
  const [implementMessage, setImplementMessage] = useState<string | null>(null);

  const currentResult = results[selected.id];

  const run = async () => {
    setRunning(true);
    setError(null);
    setImplementMessage(null);
    try {
      const res = await fetch("/api/admin/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: selected }),
      });
      const data = await res.json();
      if (data.success && data.simulation) {
        setResults(prev => ({ ...prev, [selected.id]: data.simulation }));
      } else {
        setError(data.error || "Simulation failed.");
      }
    } catch {
      setError("Network error. Could not reach the AI service.");
    } finally {
      setRunning(false);
    }
  };

  const handleImplement = async () => {
    setImplementing(true);
    setError(null);
    setImplementMessage(null);
    try {
      const res = await fetch("/api/admin/simulate/implement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: selected.id }),
      });
      const data = await res.json();
      if (data.success) {
        setImplementMessage(data.message + " " + (data.details || ""));
      } else {
        setError(data.error || "Failed to implement scenario.");
      }
    } catch {
      setError("Network error. Could not connect to database.");
    } finally {
      setImplementing(false);
    }
  };

  const metrics = currentResult
    ? [
        { label: "Avg Delivery Time",   before: currentResult.deliveryTime.before,  after: currentResult.deliveryTime.after,  change: currentResult.deliveryTime.change },
        { label: "Cost per Order",      before: currentResult.costPerOrder.before,   after: currentResult.costPerOrder.after,   change: currentResult.costPerOrder.change },
        { label: "Geographic Coverage", before: currentResult.coverage.before,       after: currentResult.coverage.after,       change: currentResult.coverage.change },
        { label: "Carbon Emissions",    before: currentResult.carbon.before,         after: currentResult.carbon.after,         change: currentResult.carbon.change },
        { label: "Monthly Revenue",     before: currentResult.revenue.before,        after: currentResult.revenue.after,        change: currentResult.revenue.change },
      ]
    : [];

  return (
    <div>
      <div className="page-header">
        <h2>AI Scenario Planner</h2>
        <p>Simulate strategic decisions using your real live database as baseline — Gemini AI computes the projected impact</p>
      </div>

      {/* Scenario Selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 24 }}>
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            onClick={() => { setSelected(s); setError(null); setImplementMessage(null); }}
            style={{
              padding: "16px 20px", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "all 0.2s",
              border: selected.id === s.id ? "2px solid #FF3F6C" : "1px solid var(--border)",
              background: selected.id === s.id ? "var(--primary-muted)" : "var(--bg-card)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "var(--bg-tertiary)" }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{s.question}</div>
              </div>
              {results[s.id] && (
                <span className={`badge ${results[s.id].recommendation ? "green" : "orange"}`} style={{ fontSize: 9, flexShrink: 0 }}>
                  {results[s.id].recommendation ? "✓ Done" : "⚠ Risk"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "10px 16px", borderRadius: 8, background: "rgba(255,90,90,0.08)", border: "1px solid rgba(255,90,90,0.2)", color: "#FF5A5A", fontSize: 13, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Success Implement Notification */}
      {implementMessage && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(0,208,132,0.08)", border: "1px solid rgba(0,208,132,0.2)", color: "#00D084", fontSize: 13, marginBottom: 16 }}>
          ✓ {implementMessage}
        </div>
      )}

      {/* Comparison Panel */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        {/* Baseline */}
        <div className="card" style={{ border: "1.5px solid var(--border)" }}>
          <div className="card-header">
            <div className="card-title">📊 Selected Scenario</div>
            <span className="badge blue">Ready</span>
          </div>
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)", fontSize: 12, color: "var(--text-secondary)" }}>
            <strong>Scenario:</strong> {selected.title}<br />
            <strong>Investment:</strong> {selected.cost}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {selected.question}
            <br /><br />
            Click <strong>"Run AI Simulation"</strong> to compute the projected impact using your live database metrics.
          </div>
        </div>

        {/* Simulated Result */}
        <div className="card" style={{ border: `1.5px solid ${currentResult ? (currentResult.recommendation ? "#00D084" : "#FF5A5A") : "var(--border)"}` }}>
          <div className="card-header">
            <div className="card-title">🤖 AI Simulation</div>
            {currentResult
              ? <span className={`badge ${currentResult.recommendation ? "green" : "red"}`}>{currentResult.recommendation ? "✅ Recommended" : "⚠ Risk"}</span>
              : <span className="badge blue">Pending</span>
            }
          </div>

          {running && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 14, color: "var(--text-secondary)" }}>
              <RefreshCw size={36} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
              <div style={{ textAlign: "center", fontSize: 13 }}>
                Gemini AI is simulating "{selected.title}"<br />
                <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Using your live database as baseline...</span>
              </div>
            </div>
          )}

          {!running && !currentResult && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, color: "var(--text-tertiary)", gap: 12 }}>
              <Zap size={48} style={{ opacity: 0.2 }} />
              <div style={{ textAlign: "center", fontSize: 13 }}>
                Press "Run Simulation" to see<br />AI-predicted impact in real-time
              </div>
            </div>
          )}

          {!running && currentResult && (
            <>
              {/* Before / After metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {metrics.map((m, i) => {
                  const isGood = currentResult.recommendation;
                  return (
                    <div key={i} style={{ padding: 12, borderRadius: "var(--radius-md)", background: isGood ? "rgba(0,208,132,0.06)" : "rgba(255,90,90,0.06)", border: `1px solid ${isGood ? "rgba(0,208,132,0.2)" : "rgba(255,90,90,0.2)"}` }}>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>{m.label}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: isGood ? "#00D084" : "#FF5A5A" }}>{m.after}</div>
                        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>was {m.before}</div>
                      </div>
                      <div style={{ fontSize: 10, color: isGood ? "#00D084" : "#FF5A5A", fontWeight: 700, marginTop: 2 }}>{m.change}</div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div style={{ padding: "12px 14px", borderRadius: "var(--radius-md)", background: currentResult.recommendation ? "rgba(0,208,132,0.06)" : "rgba(255,90,90,0.06)", border: `1px solid ${currentResult.recommendation ? "#00D084" : "#FF5A5A"}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: currentResult.recommendation ? "#00D084" : "#FF5A5A" }}>
                  {currentResult.recommendation ? "✅ Impact Summary" : "⚠ Risk Summary"}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>{currentResult.summary}</p>
                {currentResult.keyChanges?.map((c, i) => (
                  <div key={i} style={{ fontSize: 11.5, padding: "3px 0", borderBottom: i < currentResult.keyChanges.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-primary)" }}>
                    {currentResult.recommendation ? "✓" : "⚠"} {c}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <button
          className="btn btn-primary"
          style={{ padding: "14px 48px", fontSize: 15, display: "flex", alignItems: "center", gap: 10 }}
          onClick={run}
          disabled={running || implementing}
        >
          {running
            ? <><RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} /> Simulating...</>
            : currentResult
            ? <><RefreshCw size={18} /> Re-Simulate</>
            : <><Play size={18} /> Run AI Simulation</>
          }
        </button>
        {currentResult && currentResult.recommendation && (
          <button
            className="btn btn-secondary"
            style={{ padding: "14px 32px", display: "flex", alignItems: "center", gap: 6 }}
            onClick={handleImplement}
            disabled={implementing}
          >
            {implementing ? (
              <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Implementing...</>
            ) : (
              <><CheckCircle size={15} /> Approve & Implement</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
