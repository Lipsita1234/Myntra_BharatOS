"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, ArrowRight, Brain, Globe, Truck, ShoppingBag, Database } from "lucide-react";

type Role = "customer" | "seller" | "operations" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("customer@myntra.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to log in. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Keep standard role override for developer easy login testing
    setLoading(true);
    setError("");
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `${role}@myntra.com`,
        password: "password123",
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          router.push("/dashboard");
        } else {
          setError(d.error || "Failed to authenticate.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("An unexpected network error occurred.");
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      {/* Background Floating Nodes */}
      <div className="floating-particles">
        <div className="particle blob-1" />
        <div className="particle blob-2" />
        <div className="particle blob-3" />
      </div>

      <div className="glass-login-card">
        {/* Top Header */}
        <div className="login-header">
          <img src="/logo.jpg" alt="Logo" style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 16px", objectFit: "cover", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
          <h1>Myntra <span style={{ background: "linear-gradient(135deg, #FF3F6C, #6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>BharatOS</span></h1>
          <p>AI-Powered Logistics Intelligence Portal</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-selection-grid">
          {[
            { id: "customer" as Role, label: "Customer", icon: <ShoppingBag size={16} />, email: "customer@myntra.com" },
            { id: "seller" as Role, label: "Seller", icon: <Globe size={16} />, email: "seller@myntra.com" },
            { id: "operations" as Role, label: "Operations", icon: <Truck size={16} />, email: "ops@myntra.com" },
            { id: "admin" as Role, label: "Admin", icon: <Database size={16} />, email: "admin@myntra.com" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              className={`role-tab-btn ${role === r.id ? "active" : ""}`}
              onClick={() => {
                setRole(r.id);
                setEmail(r.email);
                setPassword("password123");
                setError("");
              }}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. logistics@myntra.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ color: "var(--danger)", fontSize: "13.5px", fontWeight: "600", textAlign: "center", marginBottom: 12, padding: "8px 12px", background: "rgba(255,90,90,0.06)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--danger)" }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
            {loading ? "Authenticating Account..." : <>Sign In with Credentials <ArrowRight size={14} /></>}
          </button>
        </form>


        {/* Footer Info */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "var(--text-tertiary)" }}>
          Authorized personnel access only • Powered by BharatOS AI Framework
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 10s ease-in-out infinite alternate;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: var(--myntra-pink);
          top: 10%;
          left: 15%;
        }

        .blob-2 {
          width: 250px;
          height: 250px;
          background: var(--myntra-purple);
          bottom: 15%;
          right: 10%;
          animation-delay: -3s;
        }

        .blob-3 {
          width: 200px;
          height: 200px;
          background: var(--myntra-blue);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -6s;
        }

        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(30px) scale(1.1); }
        }

        .glass-login-card {
          width: 100%;
          max-width: 440px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 36px;
          box-shadow: var(--glass-shadow);
          z-index: 10;
        }

        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-logo {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple));
          color: white;
          font-weight: 800;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          margin: 0 auto 12px;
          box-shadow: 0 4px 12px rgba(255, 63, 108, 0.3);
        }

        .login-header h1 {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
          color: var(--text-primary);
        }

        .login-header p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .role-selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }

        .role-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-tab-btn:hover {
          border-color: var(--myntra-pink);
          color: var(--text-primary);
        }

        .role-tab-btn.active {
          border-color: var(--myntra-pink);
          background: var(--primary-muted);
          color: var(--myntra-pink);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-group label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .input-group input {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          outline: none;
          font-size: 13.5px;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          border-color: var(--myntra-pink);
        }

        .login-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 14px;
          margin-top: 8px;
        }

        .divider-or {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 16px 0;
          color: var(--text-tertiary);
          font-size: 12px;
        }

        .divider-or::before,
        .divider-or::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border);
        }

        .divider-or:not(:empty)::before {
          margin-right: .5em;
        }

        .divider-or:not(:empty)::after {
          margin-left: .5em;
        }

        .google-btn {
          width: 100%;
          justify-content: center;
          gap: 8px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          padding: 10px;
          font-size: 13.5px;
        }

        .google-btn:hover {
          background: var(--bg-secondary);
        }

        .google-icon {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
