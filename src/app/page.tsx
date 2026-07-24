"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, AlertTriangle, ShieldCheck, Cpu, Layers, HelpCircle, Navigation, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import AnimatedCounter from "@/components/ui/animated-counter";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedState, setSelectedState] = useState<{ name: string; costRed: string; speed: string; carbon: string } | null>({
    name: "Karnataka",
    costRed: "₹53 / order",
    speed: "3.1 days",
    carbon: "-41%",
  });

  const stateStats: Record<string, { costRed: string; speed: string; carbon: string }> = {
    Karnataka: { costRed: "₹53 / order", speed: "3.1 days", carbon: "-41%" },
    Odisha: { costRed: "₹58 / order", speed: "3.3 days", carbon: "-38%" },
    Maharashtra: { costRed: "₹51 / order", speed: "2.9 days", carbon: "-44%" },
    Delhi: { costRed: "₹52 / order", speed: "3.0 days", carbon: "-40%" },
    Gujarat: { costRed: "₹55 / order", speed: "3.2 days", carbon: "-39%" },
  };

  const handleStateHover = (stateName: string) => {
    const stats = stateStats[stateName] || { costRed: "₹54 / order", speed: "3.2 days", carbon: "-40%" };
    setSelectedState({ name: stateName, ...stats });
  };

  // Detect if user is logged in — always fetch fresh, never use cached response
  useEffect(() => {
    fetch("/api/auth/profile", { cache: "no-store", credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setIsLoggedIn(d.success && !!d.user);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-left">
          <span className="nav-logo-text" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
            Myntra <span style={{ background: "linear-gradient(135deg, #FF3F6C, #6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>BharatOS</span>
          </span>
        </div>
        <div className="nav-links">
          <a href="#hero">Home</a>
          <a href="#problems">Solutions</a>
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>Dashboard</Link>
          <a href="#solutions">Features</a>
          <a href="#map">Analytics</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-pill-toggle"
            aria-label="Toggle Theme"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "56px",
              height: "28px",
              borderRadius: "999px",
              background: theme === "dark" ? "rgba(108, 99, 255, 0.15)" : "rgba(148, 163, 184, 0.15)",
              border: "1px solid " + (theme === "dark" ? "rgba(108, 99, 255, 0.3)" : "rgba(148, 163, 184, 0.3)"),
              position: "relative",
              padding: "0 6px",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            <Sun size={12} style={{ color: theme === "dark" ? "var(--text-tertiary)" : "#FFB547", zIndex: 2, transition: "color 0.2s" }} />
            <Moon size={12} style={{ color: theme === "dark" ? "#A5B4FC" : "var(--text-tertiary)", zIndex: 2, transition: "color 0.2s" }} />
            
            {/* Sliding toggle circle */}
            <div 
              style={{
                position: "absolute",
                top: "2px",
                left: theme === "dark" ? "29px" : "3px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF3F6C, #6C63FF)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 1
              }}
            />
          </button>

          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, background: "linear-gradient(135deg, #FF3F6C, #6C63FF)" }}>
            {isLoggedIn ? "Go to Dashboard →" : "Login"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="hero-section" style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        {/* Curved dashed background paths with MOVING DOTS */}
        <div className="hero-map-bg" style={{ opacity: 0.8 }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 500" fill="none" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
            {/* Dashed background lines */}
            <path id="path1" d="M 100 250 Q 300 100 500 250 Q 700 400 900 250" stroke="rgba(108, 99, 255, 0.15)" strokeWidth="2.5" strokeDasharray="8 6" />
            <path id="path2" d="M 150 150 Q 400 350 650 150 Q 800 250 850 150" stroke="rgba(255, 63, 108, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
            
            {/* Animating truck/dots moving along paths */}
            <circle r="6" fill="#FF3F6C" style={{ filter: "drop-shadow(0 0 4px #FF3F6C)" }}>
              <animateMotion dur="8s" repeatCount="indefinite" path="M 100 250 Q 300 100 500 250 Q 700 400 900 250" />
            </circle>

            <circle r="5" fill="#6C63FF" style={{ filter: "drop-shadow(0 0 4px #6C63FF)" }}>
              <animateMotion dur="10s" repeatCount="indefinite" path="M 150 150 Q 400 350 650 150 Q 800 250 850 150" />
            </circle>
            
            {/* Static junction indicators */}
            <circle cx="240" cy="180" r="6" fill="#FF3F6C" />
            <circle cx="580" cy="300" r="6" fill="#6C63FF" />
            <circle cx="830" cy="210" r="6" fill="#FF3F6C" />
            <circle cx="725" cy="275" r="7" fill="#00D084" />
          </svg>
        </div>

        <div className="hero-content" style={{ zIndex: 10, position: "relative", margin: "0 auto" }}>
          {/* Active clusters badge with blinking dot */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 9999, background: "rgba(108, 99, 255, 0.08)", border: "1px solid rgba(108, 99, 255, 0.15)", fontSize: 12, fontWeight: 600, color: "#6C63FF" }}>
              <span className="blink-dot" />
              12,500 live delivery clusters active
            </span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 16 }}>
            AI-Powered Logistics<br />Intelligence for <span style={{ color: "#FF3F6C" }}>Bh</span><span style={{ color: "#6C63FF" }}>ar</span><span style={{ color: "#00C2FF" }}>at</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Making last-mile deliveries smarter, faster, cheaper and more<br />sustainable using artificial intelligence.
          </p>

          <div className="hero-buttons" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary" style={{ padding: "14px 36px", borderRadius: 8, fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg, #FF3F6C, #6C63FF)" }}>
              {isLoggedIn ? "Go to Dashboard" : "Explore platform"}
            </Link>
          </div>
        </div>
      </header>

      {/* Stat Strip Card */}
      <section style={{ padding: "0 40px", position: "relative", zIndex: 20, marginTop: -40, marginBottom: 60 }}>
        <div className="stats-grid">
          {[
            { label: "Potential logistics savings", val: 24, prefix: "₹", suffix: "M" },
            { label: "Reduction in delivery cost", val: 38, suffix: "%" },
            { label: "Faster deliveries", val: 27, suffix: "%" },
            { label: "Carbon reduction", val: 41, suffix: "%" },
            { label: "Active delivery clusters", val: 12500, suffix: "" },
          ].map((item, idx) => (
            <div key={idx} className="stat-item">
              <div style={{ fontSize: 26, fontWeight: 900, color: "#6C63FF" }}>
                <AnimatedCounter end={item.val} prefix={item.prefix} suffix={item.suffix} />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Structural Gaps (Problem Statement) */}
      <section id="problems" className="section-padding" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.5 }}>
            Five structural gaps quietly inflate cost and slow every order outside metro cores.
          </p>
        </div>

        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { title: "High rural cost", desc: "Logistics costs spike sharply outside metro clusters.", icon: "₹" },
            { title: "Low density", desc: "Scattered orders make single-trip delivery uneconomical.", icon: "♢" },
            { title: "Poor routing", desc: "Static routes ignore live traffic and demand shifts.", icon: "→" },
            { title: "Costly returns", desc: "Reverse logistics erodes margin on every RTO order.", icon: "↺" },
            { title: "No prediction", desc: "Warehouses react to demand instead of anticipating it.", icon: "?" },
          ].map((prob, idx) => (
            <div key={idx} className="card hover-animate" style={{ padding: 20, borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255, 90, 90, 0.08)", color: "#FF5A5A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
                {prob.icon}
              </div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)" }}>{prob.title}</h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{prob.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Six Systems (AI Solution) */}
      <section id="solutions" className="section-padding" style={{ background: "transparent", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FF3F6C", textTransform: "uppercase", letterSpacing: "1px" }}>OUR AI SOLUTION</span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginTop: 8, marginBottom: 12 }}>Six systems, one intelligence layer</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Each module targets a specific inefficiency and compounds with the others.
          </p>
        </div>

        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { title: "AI smart clustering", desc: "Groups nearby orders into delivery-efficient clusters using K-Means.", icon: "⚙" },
            { title: "Community delivery window", desc: "Aligns neighbours into shared time slots to cut trips per area.", icon: "⏰" },
            { title: "Demand prediction", desc: "Forecasts regional demand so sellers stock ahead of spikes.", icon: "▲" },
            { title: "Dynamic micro hubs", desc: "Spins up temporary hubs where cluster density justifies it.", icon: "⬡" },
            { title: "Smart return pooling", desc: "Batches reverse pickups along existing delivery routes.", icon: "↺" },
            { title: "AI logistics copilot", desc: "An LLM assistant that answers ops questions in plain language.", icon: "✦" },
          ].map((sol, idx) => (
            <div key={idx} className="card-glass hover-animate" style={{ padding: 24, borderRadius: 16, border: "1px solid var(--border)", background: "var(--glass-bg)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #FF3F6C, #6C63FF)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 16 }}>
                {sol.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{sol.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>{sol.desc}</p>
              <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "#6C63FF", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                Learn more <span style={{ transition: "transform 0.2s" }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* India Mapped in Real Time */}
      <section id="map" className="section-padding" style={{ background: "#0F172A", color: "#FFFFFF" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#00C2FF", textTransform: "uppercase", letterSpacing: "1px" }}>LIVE NETWORK</span>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginTop: 8, marginBottom: 12 }}>India, mapped in real time</h2>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            Hover any state on the live product to see clusters, warehouses and demand.
          </p>
        </div>

        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 40, maxWidth: 1000, margin: "0 auto", alignItems: "center" }}>
          {/* Radar Circles Layout */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative", height: 320 }}>
            <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: "absolute" }}>
              <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="160" cy="160" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="160" cy="160" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              
              {/* Colored dots */}
              <circle cx="96" cy="112" r="6" fill="#FF3F6C" className="pulse-glow" />
              <circle cx="210" cy="96" r="6" fill="#6C63FF" />
              <circle cx="178" cy="225" r="6" fill="#00C2FF" />
              <circle cx="70" cy="240" r="6" fill="#00D084" />
              <circle cx="230" cy="256" r="6" fill="#FFB547" />
            </svg>
            <div style={{ alignSelf: "center", zIndex: 10, color: "#64748B", fontSize: 12 }}>[ Interactive Radar Grid ]</div>
          </div>

          {/* Legend Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { color: "#FF3F6C", label: "Delivery clusters" },
              { color: "#6C63FF", label: "Warehouse locations" },
              { color: "#00C2FF", label: "High-demand states" },
              { color: "#00D084", label: "Micro hubs" },
              { color: "#FFB547", label: "Congested areas" },
            ].map((leg, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: leg.color }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#E2E8F0" }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional vs BharatOS Table */}
      <section id="comparison" className="section-padding" style={{ background: "transparent" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FF3F6C", textTransform: "uppercase", letterSpacing: "1px" }}>COMPARISON</span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginTop: 8 }}>Traditional logistics vs Bharat<span style={{ color: "#6C63FF" }}>OS</span></h2>
        </div>

        <div className="card" style={{ maxWidth: 900, margin: "0 auto", padding: 0, overflow: "hidden", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Traditional</th>
                <th>Bharat<span style={{ color: "#6C63FF" }}>OS</span></th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Delivery cost", trad: "₹85 / order", os: "₹53 / order" },
                { metric: "Delivery time", trad: "4.2 days", os: "3.1 days" },
                { metric: "Fuel usage", trad: "High", os: "Optimized" },
                { metric: "Carbon emission", trad: "Baseline", os: "-41%" },
                { metric: "Customer satisfaction", trad: "72%", os: "91%" },
                { metric: "Warehouse utilization", trad: "58%", os: "86%" },
                { metric: "Cluster efficiency", trad: "Manual", os: "AI-optimized" },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, padding: "16px 24px" }}>{row.metric}</td>
                  <td style={{ color: "#FF5A5A", fontWeight: 600, padding: "16px 24px" }}>{row.trad}</td>
                  <td style={{ color: "#00D084", fontWeight: 700, padding: "16px 24px" }}>{row.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Built for Everyone in the Chain (Benefits Section) */}
      <section id="about" className="section-padding" style={{ background: "transparent", borderTop: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FF3F6C", textTransform: "uppercase", letterSpacing: "1px" }}>BENEFITS</span>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginTop: 8 }}>Built for everyone in the chain</h2>
        </div>

        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {[
            {
              title: "For customers",
              benefits: ["Community delivery benefits", "Cluster progress tracking", "Unlockable shipping discounts"]
            },
            {
              title: "For sellers",
              benefits: ["Real-time demand monitoring", "High-demand location alerts", "AI inventory recommendations"]
            },
            {
              title: "For Myntra ops",
              benefits: ["Live cluster monitoring", "Route optimization", "Logistics simulation tools"]
            }
          ].map((item, idx) => (
            <div key={idx} className="card hover-animate" style={{ padding: 24, borderRadius: 16, border: "1px solid var(--border)", background: "var(--bg-card)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>{item.title}</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, padding: 0 }}>
                {item.benefits.map((b, bIdx) => (
                  <li key={bIdx} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#00D084", fontWeight: 800 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="footer-container" style={{ background: "#0F172A", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 40px 30px", color: "#FFFFFF" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="nav-logo-text" style={{ fontSize: 24, fontWeight: 800 }}>
              <span style={{ background: "linear-gradient(135deg, #FF3F6C, #6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>BharatOS</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#94A3B8", marginBottom: 16 }}>PRODUCT</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <Link href="/login" style={{ color: "#E2E8F0", textDecoration: "none" }}>Dashboard</Link>
                <a href="#map" style={{ color: "#E2E8F0", textDecoration: "none" }}>Analytics</a>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>Documentation</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#94A3B8", marginBottom: 16 }}>COMPANY</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>About</a>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>Contact</a>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>GitHub</a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#94A3B8", marginBottom: 16 }}>LEGAL</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>Privacy</a>
                <a href="#" style={{ color: "#E2E8F0", textDecoration: "none" }}>Terms</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", paddingTop: 30, fontSize: 12, color: "#64748B" }}>
          © 2026 BharatOS. AI-powered logistics intelligence for Bharat.
        </div>
      </footer>

      <style jsx>{`
        .landing-wrapper {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: background 0.3s ease, color 0.3s ease;
        }

        .nav-bar {
          height: 68px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-header);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-links a {
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 13.5px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #FF3F6C;
        }

        .hero-section {
          text-align: center;
          padding: 80px 20px 60px;
        }

        .hero-map-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .section-padding {
          padding: 60px 40px;
        }

        .hover-animate {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
        }

        .hover-animate:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .blink-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #00D084;
          animation: blink 1.5s infinite ease-in-out;
          display: inline-block;
          box-shadow: 0 0 6px #00D084;
        }

        .stats-grid {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 24px 0;
        }

        .stat-item {
          text-align: center;
          border-right: 1px solid var(--border);
          padding: 0 10px;
        }

        .stat-item:last-child {
          border-right: none;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero-content h1 { font-size: 32px !important; line-height: 1.2 !important; }
          .section-padding { padding: 40px 16px !important; }
          .mobile-stack { grid-template-columns: 1fr !important; gap: 16px !important; }
          
          .stats-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 16px; 
            padding: 24px 16px !important; 
          }
          .stat-item { 
            border-right: none !important; 
            border-bottom: 1px solid var(--border); 
            padding-bottom: 16px; 
          }
          .stat-item:last-child { 
            border-bottom: none; 
            grid-column: span 2; 
          }
          
          .data-table th, .data-table td {
            padding: 12px 8px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
