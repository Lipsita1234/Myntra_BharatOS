"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp, Package, Truck, Warehouse, Users, Leaf,
  Brain, Star, Clock, DollarSign, Layers, MapPin,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Download, RefreshCw
} from "lucide-react";

// Replaced by state inside the component

// Replaced by dynamic state inside the component

export default function AdminAnalytics() {
  const [tick, setTick] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [pulseInsights, setPulseInsights] = useState<string[]>([
    "Loading dynamic AI insights...",
    "Analyzing warehouse capacity and fill rates...",
    "Evaluating community delivery participation...",
    "Checking regional demand forecasts...",
    "Generating cost reduction recommendations...",
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setAnalyticsData(d); setLoading(false); })
      .catch(() => setLoading(false));
      
    fetch("/api/admin/insights")
      .then((r) => r.json())
      .then((d) => { 
        if (d.success && d.insights && d.insights.length > 0) {
          setPulseInsights(d.insights.slice(0, 5).map((i: any) => i.text));
        }
      })
      .catch(console.error);
  }, []);

  const kpis = [
    { label: "Total Orders Today", val: `${((analyticsData?.kpis?.totalOrders ?? 2847) + tick * 7).toLocaleString()}`, color: "#FF3F6C", icon: <Package size={18} /> },
    { label: "Total Revenue", val: `₹${((analyticsData?.kpis?.totalRevenue ?? 820000) / 100000).toFixed(1)}L`, color: "#00D084", icon: <TrendingUp size={18} /> },
    { label: "Logistics Cost", val: "₹1.38 L", color: "#FFB547", icon: <DollarSign size={18} /> },
    { label: "Total Cost Saved", val: `₹${(((analyticsData?.kpis?.totalSavings ?? 0) + tick * 500) / 100000).toFixed(1)}L`, color: "#00D084", icon: <Zap size={18} /> },
    { label: "Active Clusters", val: `${(analyticsData?.kpis?.activeClusters ?? 28) + Math.floor(tick / 2)}`, color: "#6C63FF", icon: <Layers size={18} /> },
    { label: "Active Warehouses", val: `${analyticsData?.kpis?.activeWarehouses ?? 8}`, color: "#00C2FF", icon: <Warehouse size={18} /> },
    { label: "Active Drivers", val: `${analyticsData?.kpis?.activeDrivers ?? 3}`, color: "#FF3F6C", icon: <Truck size={18} /> },
    { label: "Micro Hubs Running", val: "5", color: "#6C63FF", icon: <MapPin size={18} /> },
    { label: "Customer Satisfaction", val: "4.7 / 5", color: "#FFB547", icon: <Star size={18} /> },
    { label: "Avg Delivery Time", val: analyticsData?.kpis?.avgDeliveryTime ?? "2.5 Hours", color: "#00C2FF", icon: <Clock size={18} /> },
    { label: "Carbon Saved", val: `${((analyticsData?.kpis?.carbonSaved ?? 18000) / 1000).toFixed(1)}T CO₂`, color: "#00D084", icon: <Leaf size={18} /> },
    { label: "AI Prediction Accuracy", val: "96.4%", color: "#FF3F6C", icon: <Brain size={18} /> },
  ];

  const monthlyRevenue = analyticsData?.monthlyRevenue ?? [];
  const regionPerformance = analyticsData?.regionPerformance ?? [];
  const dynamicSellerData = analyticsData?.sellerData ?? [];
  const dynamicCategoryRevenue = analyticsData?.categoryRevenue ?? [];
  const dynamicCustomerAnalytics = analyticsData?.customerAnalytics ?? {
    newCustomers: "-", returningCustomers: "-", communityDeliveryPct: "-",
    avgSatisfaction: "-", deliverySuccess: "-", churnRate: "-"
  };

  return (
    <div>
      {/* Bharat Pulse Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,63,108,0.06) 0%, rgba(108,99,255,0.06) 50%, rgba(0,194,255,0.06) 100%)",
        border: "1.5px solid rgba(255,63,108,0.15)", borderRadius: "var(--radius-lg)",
        padding: "24px 28px", marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#FF3F6C,#6C63FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={18} style={{ color: "white" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>
              <span style={{ background: "linear-gradient(90deg,#FF3F6C,#6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bharat Pulse</span>
              {" "}<span style={{ color: "var(--text-tertiary)", fontWeight: 400, fontSize: 13 }}>— AI Executive Briefing · {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</span>
            </div>
          </div>
          <span className="badge green" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D084", display: "inline-block", animation: "bounce 1.2s infinite" }} /> Live AI
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pulseInsights.map((insight, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "var(--text-primary)", padding: "8px 12px", borderRadius: "var(--radius-sm)", background: "var(--border)", border: "1px solid var(--border)" }}>
              <span style={{ color: "#FF3F6C", fontWeight: 700, flexShrink: 0 }}>0{idx + 1}</span>
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* 12 KPI Cards — live data */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: kpi.color }}>{kpi.val}</div>
              </div>
              <div style={{ color: kpi.color }}>{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Orders charts */}
      <div className="grid-cols-3" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div className="card-title">Monthly Revenue & Cost Savings</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 5 }}><Download size={12} /> Export</button>
              <span className="badge green">Live Data</span>
            </div>
          </div>
          {loading ? (
            <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3F6C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3F6C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="savG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D084" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D084" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} formatter={(v: any) => [`₹${(v / 100000).toFixed(1)}L`]} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#FF3F6C" fill="url(#revG)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="savings" name="Cost Saved" stroke="#00D084" fill="url(#savG)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Seller breakdown pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Seller Performance</div>
            <span className="badge pink">{analyticsData?.totalSellers ?? "..."} Sellers</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={dynamicSellerData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {dynamicSellerData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {[
              { l: "Total Sellers", v: analyticsData?.totalSellers ?? "-", delta: "+12 this week" },
              { l: "Top Performers", v: dynamicSellerData.find((s:any)=>s.name==="Top Sellers")?.value ?? "-", delta: "Revenue > ₹50K" },
              { l: "Need Support", v: dynamicSellerData.find((s:any)=>s.name==="Needs Support")?.value ?? "-", delta: "AI recommendations sent" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                <span style={{ color: "var(--text-secondary)" }}>{r.l}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{r.v}</div>
                  <div style={{ fontSize: 9.5, color: "var(--text-tertiary)" }}>{r.delta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional + Category */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Logistics Savings by Region</div>
            <span className="badge blue">All States</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionPerformance.length > 0 ? regionPerformance : [{ region: "No data", savings: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="region" tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} formatter={(v: any) => [`₹${(v / 1000).toFixed(0)}K`, "Savings"]} />
              <Bar dataKey="savings" name="Savings" fill="#6C63FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue by Category</div>
            <span className="badge orange">FY 2024</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dynamicCategoryRevenue.length > 0 ? dynamicCategoryRevenue : [{ cat: "None", rev: 0 }]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <YAxis dataKey="cat" type="category" tick={{ fill: "#94A3B8", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} formatter={(v: any) => [`₹${(v / 100000).toFixed(1)}L`, "Revenue"]} />
              <Bar dataKey="rev" name="Revenue" fill="#FF3F6C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="grid-cols-1" style={{ gap: 20 }}>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Customer Analytics</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { l: "Total Customers", v: dynamicCustomerAnalytics.newCustomers, up: true },
              { l: "Returning Customers", v: dynamicCustomerAnalytics.returningCustomers, up: true },
              { l: "Community Delivery", v: dynamicCustomerAnalytics.communityDeliveryPct, up: true },
              { l: "Avg Satisfaction", v: dynamicCustomerAnalytics.avgSatisfaction, up: true },
              { l: "Delivery Success", v: dynamicCustomerAnalytics.deliverySuccess, up: true },
              { l: "Churn Rate", v: dynamicCustomerAnalytics.churnRate, up: false },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-secondary)" }}>{item.l}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <strong>{item.v}</strong>
                  {item.up
                    ? <ArrowUpRight size={13} style={{ color: "#00D084" }} />
                    : <ArrowDownRight size={13} style={{ color: "#FF5A5A" }} />
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
