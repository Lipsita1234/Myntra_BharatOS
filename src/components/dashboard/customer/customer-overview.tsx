"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Layers, Users, Package, TrendingUp, TrendingDown,
  ArrowUpRight, Clock, Zap, Star, RefreshCw,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";

interface DashboardData {
  stats: {
    ordersDelivered: number;
    totalSavings: number;
    totalSpent: number;
    clustersJoined: number;
    carbonSaved: number;
    avgDeliveryTime: string;
  };
  clusters: any[];
  notifications: any[];
  orderTrend: { date: string; orders: number }[];
  deliveryModeBreakdown: { name: string; value: number; color: string }[];
  kpiChanges?: { [key: string]: number };
  rewards?: string[];
}

export default function CustomerOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, profileRes] = await Promise.all([
          fetch("/api/customer/dashboard"),
          fetch("/api/auth/profile"),
        ]);
        if (dashRes.ok) {
          const d = await dashRes.json();
          setData(d);
        }
        if (profileRes.ok) {
          const p = await profileRes.json();
          setUserName(p.user.name.split(" ")[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  const stats = data?.stats;
  const kpiCards = [
    {
      title: "Orders Delivered",
      value: stats?.ordersDelivered ?? 0,
      change: data?.kpiChanges?.ordersDelivered ?? 0,
      icon: <Package size={20} />,
      color: "blue",
    },
    {
      title: "Total Savings",
      value: stats?.totalSavings ?? 0,
      prefix: "₹",
      change: data?.kpiChanges?.totalSavings ?? 0,
      icon: <Layers size={20} />,
      color: "pink",
    },
    {
      title: "Carbon Saved",
      value: stats?.carbonSaved ?? 0,
      suffix: " kg CO₂",
      change: data?.kpiChanges?.carbonSaved ?? 0,
      icon: <Zap size={20} />,
      color: "green",
    },
    {
      title: "Avg Delivery Time",
      value: 0,
      displayValue: stats?.avgDeliveryTime ?? "0 Hours",
      change: data?.kpiChanges?.avgDeliveryTime ?? 0,
      icon: <Clock size={20} />,
      color: "orange",
    },
  ];

  const clusters = data?.clusters ?? [];
  const notifications = data?.notifications ?? [];
  const orderTrend = data?.orderTrend ?? [];
  const deliveryModeBreakdown = data?.deliveryModeBreakdown ?? [
    { name: "Community Delivery", value: 68, color: "#E91E8C" },
    { name: "Direct Delivery", value: 22, color: "#6C63FF" },
    { name: "Express", value: 10, color: "#00C2FF" },
  ];

  const severityColors = { low: "var(--success)", medium: "var(--info)", high: "var(--warning)", critical: "var(--error)" };

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {userName} 👋</h2>
        <p>Here&apos;s your live delivery intelligence overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: 24 }}>
        {kpiCards.map((kpi, i) => (
          <div key={kpi.title} className={`card animate-fade-in stagger-${i + 1}`}>
            <div className="card-header">
              <div>
                <div className="card-subtitle">{kpi.title}</div>
                <div className="card-value" style={{ marginTop: 4 }}>
                  {kpi.displayValue || (
                    <AnimatedCounter
                      end={kpi.value}
                      prefix={kpi.prefix}
                      suffix={kpi.suffix}
                      decimals={0}
                    />
                  )}
                </div>
              </div>
              <div className={`card-icon ${kpi.color}`}>{kpi.icon}</div>
            </div>
            <div className={`card-change ${kpi.change >= 0 ? "positive" : "negative"}`}>
              {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {kpi.change >= 0 ? "+" : ""}{kpi.change}% vs last week
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-cols-2" style={{ marginBottom: 24 }}>
        {/* Order Trends */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Order Trends</div>
            <span className="badge pink">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={orderTrend}>
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E91E8C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#E91E8C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13 }} />
              <Area type="monotone" dataKey="orders" stroke="#E91E8C" fill="url(#orderGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Mode Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Delivery Mode Breakdown</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ResponsiveContainer width="50%" height={260}>
              <PieChart>
                <Pie data={deliveryModeBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value">
                  {deliveryModeBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {deliveryModeBreakdown.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Clusters */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Clusters Near You</div>
          <span className="badge green">{clusters.length} Live</span>
        </div>
        {clusters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px", color: "var(--text-tertiary)" }}>
            No active clusters found in your area.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cluster</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Savings</th>
                  <th>ETA</th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {clusters.slice(0, 5).map((c) => (
                  <tr key={c.clusterId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{c.city}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Users size={14} />
                        {c.members}/{c.maxMembers}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.status === "active" ? "green" : c.status === "completed" ? "blue" : "orange"}`}>
                        <span className={`status-dot ${c.status}`} />
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{Math.round(c.savings)}</td>
                    <td>{c.eta || "–"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${Math.round(c.completionProbability)}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{Math.round(c.completionProbability)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Smart Notifications & Rewards Console */}
      <div className="grid-cols-2" style={{ marginTop: 24 }}>
        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">AI Smart Notifications</div>
            <span className="badge pink">Live Alerts</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.length === 0 ? (
              <div style={{ color: "var(--text-tertiary)", fontSize: 13, textAlign: "center", padding: 16 }}>
                No new notifications
              </div>
            ) : (
              notifications.slice(0, 3).map((n: any) => (
                <div key={n.id} className="alert-item" style={{ borderLeft: `4px solid ${severityColors[n.severity as keyof typeof severityColors] || "var(--border)"}` }}>
                  <div className={`alert-icon ${n.severity}`}>
                    {n.type === "cluster" ? "🎉" : n.type === "info" ? "📦" : "⚡"}
                  </div>
                  <div>
                    <strong style={{ fontSize: 13.5 }}>{n.title}</strong>
                    <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{n.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cluster Rewards */}
        <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="card-header">
              <div className="card-title">Cluster Rewards & ESG Ledger</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>TOTAL SAVINGS ACCRUED</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--success)" }}>
                  ₹{stats?.totalSavings ?? 0} Saved
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>ECOLOGICAL DEDUCTION OFFSET</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--myntra-pink)" }}>
                  {stats?.carbonSaved ?? 0} kg CO₂ Saved
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Rewards Active:</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {(data?.rewards || []).map((reward: string, i: number) => (
                  <span key={i} className={`badge ${i === 0 ? 'green' : 'blue'}`}>{reward}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
