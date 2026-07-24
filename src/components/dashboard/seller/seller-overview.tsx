"use client";

import React, { useState, useEffect } from "react";
import {
  Store, ShoppingBag, TrendingUp, AlertTriangle, Sparkles,
  Star, Package, Clock, BarChart2, Bell, Download,
  TrendingDown, CheckCircle, ArrowUpRight, ArrowDownRight,
  Shield, Truck, RefreshCw, Target
} from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

const getIconForMetric = (label: string) => {
  if (label.includes("Rating")) return <Star size={16} />;
  if (label.includes("Shipping")) return <Truck size={16} />;
  if (label.includes("Accuracy")) return <CheckCircle size={16} />;
  if (label.includes("Return")) return <RefreshCw size={16} />;
  if (label.includes("Inventory")) return <Package size={16} />;
  if (label.includes("Growth")) return <TrendingUp size={16} />;
  return <BarChart2 size={16} />;
};

export default function SellerOverview() {
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/seller/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleExportReport = () => {
    if (!data) return;
    const csvRows = [
      ["KPI", "Value"], 
      ["Total Revenue", Number(data.kpis.totalRevenue).toFixed(2)], 
      ["Delivered Orders", data.kpis.deliveredOrders], 
      ["Pending Orders", data.kpis.pendingOrders], 
      [], 
      ["Top Products", "Sold", "Revenue", "Stock"]
    ];
    data.products.slice(0, 10).forEach((p: any) => {
      const rev = p.sold * p.price;
      csvRows.push([p.name, p.sold, rev.toFixed(2), p.stock]);
    });
    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Seller_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAIInsights = async () => {
    if (!data) return;
    setIsAILoading(true); setAiInsight(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", text: `Provide a highly concise 3-sentence business insight based on this seller data. Focus on low stock items and revenue trend: Revenue ${data.kpis.totalRevenue}, Orders ${data.kpis.deliveredOrders}.` }], persona: "seller" })
      });
      const chatData = await res.json();
      setAiInsight(chatData.response || chatData.error || "No insights could be generated.");
    } catch (e) { setAiInsight("Error generating insights."); } finally { setIsAILoading(false); }
  };

  const kpis = data?.kpis ?? {};
  const products = data?.products ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const weeklyTrend = data?.weeklyTrend ?? [
    { day: "Mon", revenue: 48000, orders: 124 },
    { day: "Tue", revenue: 52000, orders: 138 },
    { day: "Wed", revenue: 61000, orders: 162 },
    { day: "Thu", revenue: 58000, orders: 151 },
    { day: "Fri", revenue: 74000, orders: 195 },
    { day: "Sat", revenue: 91000, orders: 241 },
    { day: "Sun", revenue: 83000, orders: 218 },
  ];

  const lowStockCount = products.filter((p: any) => p.status !== "healthy").length;
  const inventoryPieData = [
    { name: "Healthy", value: products.filter((p: any) => p.status === "healthy").length || 3, color: "#00D084" },
    { name: "Low Stock", value: products.filter((p: any) => p.status === "low").length || 2, color: "#FFB547" },
    { name: "Critical", value: products.filter((p: any) => p.status === "critical").length || 1, color: "#FF5A5A" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Seller Dashboard</h2>
          <p>AI-powered business intelligence for your Myntra storefront</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportReport} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} /> Export Report
          </button>
          <button onClick={handleAIInsights} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isAILoading ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />} 
            {isAILoading ? "Analyzing..." : "AI Insights"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: kpis.totalRevenue ?? 0, prefix: "₹", change: 18.2, icon: <TrendingUp size={20} />, color: "green" },
          { label: "Orders Delivered", value: kpis.deliveredOrders ?? 0, change: 8.3, icon: <ShoppingBag size={20} />, color: "blue" },
          { label: "Pending Orders", value: kpis.pendingOrders ?? 0, change: -3.1, icon: <Clock size={20} />, color: "orange" },
          { label: "Low Stock Items", value: lowStockCount, change: lowStockCount > 0 ? -10 : 5, icon: <AlertTriangle size={20} />, color: lowStockCount > 0 ? "pink" : "green" },
        ].map((kpi, i) => (
          <div key={i} className={`card animate-fade-in stagger-${i + 1}`}>
            <div className="card-header">
              <div>
                <div className="card-subtitle">{kpi.label}</div>
                <div className="card-value" style={{ marginTop: 4 }}>
                  <AnimatedCounter end={kpi.value} prefix={kpi.prefix} decimals={kpi.prefix === "₹" ? 0 : 0} />
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

      {/* Weekly Trend + Inventory Pie */}
      <div className="grid-cols-3" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div className="card-title">Revenue & Order Trend</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["week", "month"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`btn btn-sm ${activeTab === t ? "btn-primary" : "btn-secondary"}`}
                >
                  {t === "week" ? "This Week" : "This Month"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={activeTab === "month" ? (data?.monthlyTrend ?? []) : weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13 }} formatter={(v: any, name) => [name === "revenue" ? `₹${(v / 1000).toFixed(0)}K` : v, name === "revenue" ? "Revenue" : "Orders"]} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#E91E8C" strokeWidth={2.5} dot={{ r: 4, fill: "#E91E8C" }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#6C63FF" strokeWidth={2.5} dot={{ r: 4, fill: "#6C63FF" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Inventory Health</div>
            {lowStockCount > 0 && <span className="badge pink">{lowStockCount} Alerts</span>}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={inventoryPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {inventoryPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {inventoryPieData.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                </div>
                <strong>{item.value} SKUs</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products from DB */}
      <div className="grid-cols-2" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Products</div>
            <span className="badge blue">{products.length} SKUs</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sold</th>
                <th>Revenue</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(products.slice(0, 5) as any[]).map((p: any) => (
                <tr key={p.productId}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{p.category}</div>
                  </td>
                  <td>{p.sold}</td>
                  <td style={{ fontWeight: 600 }}>₹{(p.sold * p.price).toLocaleString()}</td>
                  <td>{p.stock} units</td>
                  <td>
                    <span className={`badge ${p.status === "healthy" ? "green" : p.status === "low" ? "orange" : "pink"}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Orders</div>
            <span className="badge green">{recentOrders.length} Orders</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Mode</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o: any) => (
                <tr key={o.orderId}>
                  <td style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{o.orderId.slice(0, 8)}...</td>
                  <td style={{ fontSize: 12.5 }}>{o.productName}</td>
                  <td>
                    <span className={`badge ${o.deliveryMode === "community" ? "green" : o.deliveryMode === "express" ? "pink" : "blue"}`}>
                      {o.deliveryMode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{o.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${o.status === "delivered" ? "green" : o.status === "shipped" ? "blue" : o.status === "returned" ? "pink" : "orange"}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight Modal (Inline) */}
      {aiInsight && (
        <div className="card-glass animate-fade-in" style={{ marginBottom: 24, padding: 20, borderLeft: "4px solid var(--myntra-pink)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} style={{ color: "var(--myntra-pink)" }} />
            <strong style={{ fontSize: 16 }}>AI Business Advisor Insight</strong>
            <button onClick={() => setAiInsight(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}>✕</button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: aiInsight }} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }} />
        </div>
      )}

      {/* Performance Metrics */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Seller Performance Scorecard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: (data?.performanceMetrics?.reduce((s:any, m:any) => s + m.score, 0) / (data?.performanceMetrics?.length || 1)) >= 90 ? "var(--success)" : "var(--warning)" }}>
              {Math.round(data?.performanceMetrics?.reduce((s:any, m:any) => s + m.score, 0) / (data?.performanceMetrics?.length || 1)) || 0}%
            </div>
            <span className="badge green">Overall Score</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {(data?.performanceMetrics || []).map((m: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
              <div style={{ color: m.color }}>{getIconForMetric(m.label)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{m.label}</div>
                <div className="progress-bar" style={{ marginTop: 4 }}>
                  <div className="progress-fill" style={{ width: `${m.score}%`, background: m.color }} />
                </div>
              </div>
              <strong style={{ fontSize: 14, color: m.color }}>{m.score}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
