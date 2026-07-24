"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, RefreshCw, Leaf, Truck, Map, ShieldCheck, RotateCcw } from "lucide-react";

export default function ReturnPooling() {
  const [returnsList, setReturnsList] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const fetchReturns = () => {
    setLoading(true);
    fetch(`/api/operations/returns?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(async (d) => {
        if (d.success) {
          const items = d.returns.map((ret: any) => ({
            id: ret.orderId,
            orderId: ret.orderId.slice(0, 8).toUpperCase(),
            reason: ret.returnReason || "Quality check",
            savings: ret.returnSavings || 0,
            location: {
              lat: ret.lat || 12.9716,
              lng: ret.lng || 77.5946
            }
          }));
          setReturnsList(items);
          
          if (items.length > 0) {
            await fetchAiRecommendations(items);
          } else {
            setRecommendations([]);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  const fetchAiRecommendations = async (items: any[]) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/operations/returns/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returns: items })
      });
      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    await fetch("/api/operations/returns/reset", { method: "POST" });
    fetchReturns();
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  if (loading || aiLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
        <Sparkles size={32} style={{ animation: "pulse 2s infinite", color: "var(--myntra-pink)" }} />
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)" }}>
          {aiLoading ? "Gemini AI is analyzing spatial distribution and profitability..." : "Loading pending returns..."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Smart AI Return Pooling</h2>
          <p>Autonomous Reverse-Logistics clustering powered by Gemini</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" onClick={handleReset} style={{ color: "var(--text-tertiary)" }}>
            <RotateCcw size={16} /> Reset Data
          </button>
          <button className="btn btn-secondary" onClick={fetchReturns}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {returnsList.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)" }}>
          No pending returns available for clustering.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {recommendations.map((rec, index) => {
            const isTop = index === 0;
            return (
              <div 
                key={rec.id} 
                className={isTop ? "card-glass" : "card"} 
                style={{ 
                  border: isTop ? "2px solid var(--myntra-pink)" : undefined,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {isTop && (
                  <div style={{ position: "absolute", top: 0, left: 0, background: "var(--myntra-pink)", color: "white", padding: "4px 16px", fontSize: 11, fontWeight: 700, borderBottomRightRadius: 12 }}>
                    AI RECOMMENDED
                  </div>
                )}
                
                <div style={{ padding: isTop ? "24px 8px 8px" : "8px", display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: isTop ? "var(--myntra-pink)" : "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                        {isTop && <Sparkles size={20} />} {rec.name}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, maxWidth: 500, lineHeight: 1.5 }}>
                        {rec.explanation}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 1 }}>Confidence Score</div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: rec.confidenceScore > 90 ? "var(--success)" : "var(--warning)" }}>
                        {rec.confidenceScore}%
                      </div>
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, background: "var(--bg-tertiary)", padding: 16, borderRadius: "var(--radius-md)" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><ShieldCheck size={14} /> Total Savings</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--success)", marginTop: 4 }}>₹{rec.savings}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><Leaf size={14} style={{ color: "var(--success)" }}/> CO₂ Reduction</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{rec.co2Reduction} kg</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><Truck size={14} /> Fuel Saved</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{rec.fuelSaved} L</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><Map size={14} /> Route Distance</div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{rec.routeDistance} km</div>
                    </div>
                  </div>

                  {/* Actions & Orders */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Included Orders ({rec.orders.length}):</span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {rec.orders.map((oid: string) => (
                          <span key={oid} className="badge blue" style={{ fontSize: 10 }}>{oid}</span>
                        ))}
                      </div>
                    </div>
                    
                    {isTop && (
                      <button
                        className="btn btn-primary btn-lg"
                        disabled={dispatchingId === rec.id}
                        onClick={async () => {
                          setDispatchingId(rec.id);
                          await fetch("/api/operations/returns", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderIds: rec.orders })
                          });
                          fetchReturns();
                          setDispatchingId(null);
                        }}
                      >
                        <Play size={16} /> {dispatchingId === rec.id ? "Dispatching..." : "Create AI Return Pool"}
                      </button>
                    )}
                    
                    {!isTop && (
                      <button 
                        className="btn btn-secondary"
                        disabled={dispatchingId === rec.id}
                        onClick={async () => {
                          setDispatchingId(rec.id);
                          await fetch("/api/operations/returns", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderIds: rec.orders })
                          });
                          fetchReturns();
                          setDispatchingId(null);
                        }}
                      >
                        <Play size={14} /> {dispatchingId === rec.id ? "Dispatching..." : "Execute Alternate"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
