"use client";

import React, { useState, useEffect } from "react";
import { Leaf, Award, ShieldCheck, Sparkles, Navigation, Globe, RefreshCw } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";

export default function SustainabilityDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/savings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setMetrics(d.sustainability);
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

  const items = [
    { label: "Carbon Emissions Reduced", val: metrics?.co2Saved ?? 18, suffix: " kg CO₂", desc: "Greenhouse gas reduced", icon: <Leaf size={24} />, color: "green", decimals: 0 },
    { label: "Fuel Saved", val: metrics?.fuelSaved ?? 3.4, suffix: " L", desc: "Fossil fuel conserved", icon: <Globe size={24} />, color: "pink", decimals: 1 },
    { label: "Distance Saved", val: metrics?.distanceSaved ?? 148, suffix: " km", desc: "Avoided route travel", icon: <Navigation size={24} />, color: "blue", decimals: 0 },
    { label: "Packaging Optimized", val: metrics?.packagingOptimized ?? 23, suffix: "%", desc: "Eco-packaging used", icon: <Award size={24} />, color: "orange", decimals: 0 },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Sustainability Dashboard</h2>
        <p>Real-time ESG dashboard showing ecological savings unlocked by Myntra community routes</p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: 24 }}>
        {items.map((metric) => (
          <div key={metric.label} className="card sustainability-card">
            <div className={`sustainability-icon ${metric.color}`}>
              {metric.icon}
            </div>
            <div className="sustainability-value">
              <AnimatedCounter end={metric.val} suffix={metric.suffix} decimals={metric.decimals} />
            </div>
            <div className="sustainability-label" style={{ fontWeight: 600, color: "var(--text-primary)", marginTop: 8 }}>{metric.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>{metric.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid-cols-2">
        {/* Environmental Equivalents */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Environmental Equivalent Impact</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🌳
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  <AnimatedCounter end={metrics?.treesEquivalent ?? 587} /> Trees Planted
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Equivalent offset capacity of trees growing for 10 years.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                🚚
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  <AnimatedCounter end={metrics?.tripsReduced ?? 3240} /> Truck Trips Saved
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Consolidated neighborhood journeys avoiding city traffic bottlenecks.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate / Level */}
        <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header">
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} style={{ color: "var(--myntra-pink)" }} />
                <span>Myntra {metrics?.tier ?? "Green"} Citizen Tier</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              You belong to the top <strong>{metrics?.percentile ?? 8}% of eco-conscious delivery citizens</strong> in your area. Keep utilizing Community Delivery to unlock the {metrics?.nextTier ?? "Platinum"} Logistics Badge!
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
            <ShieldCheck size={32} style={{ color: "var(--myntra-pink)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{metrics?.badgeName ?? "Eco Citizen Badge Active"}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Authorized by Myntra ESG Intelligence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
