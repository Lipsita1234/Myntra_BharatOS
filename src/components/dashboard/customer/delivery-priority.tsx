"use client";

import React, { useState, useEffect } from "react";
import { Truck, Users, Zap, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

type PriorityType = "normal" | "community" | "express";

export default function DeliveryPriority() {
  const [selected, setSelected] = useState<PriorityType>("community");
  const [estimates, setEstimates] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/delivery-estimate")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEstimates(data.estimates);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch estimates", err);
        setLoading(false);
      });
  }, []);

  const priorities = [
    {
      id: "normal" as PriorityType,
      title: "Standard Delivery",
      price: estimates?.normal?.cost || "₹49",
      time: estimates?.normal?.time || "24 - 48 Hours",
      desc: "Standard shipping with regular carbon footprints. No cluster requirements.",
      icon: <Truck size={24} />,
      color: "blue",
      badge: null,
    },
    {
      id: "community" as PriorityType,
      title: "SmartCluster Delivery",
      price: estimates?.community?.cost || "FREE",
      time: estimates?.community?.time || "2 - 4 Hours",
      desc: "AI groups the order with nearby deliveries. Lower shipping cost. More sustainable.",
      icon: <Users size={24} />,
      color: "pink",
      badge: "AI Recommended",
    },
    {
      id: "express" as PriorityType,
      title: "Express Delivery",
      price: estimates?.express?.cost || "₹149",
      time: estimates?.express?.time || "1 Hour",
      desc: "Bypasses all clustering pools for immediate direct dispatch. Premium high-speed option.",
      icon: <Zap size={24} />,
      color: "orange",
      badge: "Urgent",
    },
  ];

  const currentImpact = estimates ? estimates[selected] : {
    cost: selected === "community" ? "₹0 (Saved ₹99)" : selected === "express" ? "₹149" : "₹49",
    savings: "₹99",
    carbonSaved: selected === "community" ? "0.85 kg CO₂ (85%)" : "0 kg (Standard)",
    routeMode: selected === "community" ? "Clustered EV" : selected === "express" ? "Direct Route" : "Standard Hub-and-Spoke"
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(2px)" }}>
          <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
        </div>
      )}
      <div style={{ marginTop: 40, marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: "var(--text-primary)" }}>Smart Delivery Priority Simulator</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Explore how your shipping speed impacts costs and sustainability metrics in real-time.</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: 24 }}>
        {priorities.map((item) => (
          <div
            key={item.id}
            className={`priority-card ${selected === item.id ? "selected" : ""}`}
            onClick={() => setSelected(item.id)}
          >
            {item.badge && (
              <span
                className={`badge ${item.id === "community" ? "pink" : "orange"}`}
                style={{ position: "absolute", top: 16, right: 16 }}
              >
                {item.badge}
              </span>
            )}

            <div className={`card-icon ${item.color}`} style={{ marginBottom: 16 }}>
              {item.icon}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
            <div style={{ fontSize: 24, fontWeight: 900, color: item.id === "community" ? "var(--success)" : "var(--text-primary)", marginBottom: 12 }}>
              {item.price}
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
              Delivery Window: {item.time}
            </div>

            <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Policy Impact Summary */}
      <div className="card-glass">
        <div className="card-header">
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} style={{ color: "var(--myntra-pink)" }} />
            <span>Real-time Policy Impact Summary</span>
            <span className="badge green" style={{ marginLeft: "auto" }}>Live Context</span>
          </div>
        </div>

        <div className="grid-cols-3">
          <div style={{ borderRight: "1px solid var(--border)", paddingRight: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Estimated Cost</div>
            <strong style={{ fontSize: 20 }}>
              {selected === "community" ? `${currentImpact.cost} (Saved ${currentImpact.savings})` : currentImpact.cost}
            </strong>
          </div>
          <div style={{ borderRight: "1px solid var(--border)", paddingRight: 16, paddingLeft: 8 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Carbon Saved</div>
            <strong style={{ fontSize: 20, color: selected === "community" ? "var(--success)" : selected === "express" ? "var(--error)" : "var(--text-primary)" }}>
              {currentImpact.carbonSaved}
            </strong>
          </div>
          <div style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Fleet Route Mode</div>
            <strong style={{ fontSize: 20 }}>
              {currentImpact.routeMode}
            </strong>
          </div>
        </div>

        {selected === "express" && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: "var(--radius-md)",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              display: "flex",
              gap: 8,
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            <ShieldAlert size={16} style={{ color: "var(--error)", flexShrink: 0 }} />
            <span>
              <strong>Note:</strong> Urgent deliveries bypass neighborhood consolidation, which causes an estimated penalty of {currentImpact.carbonSaved} in localized carbon footprint.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
