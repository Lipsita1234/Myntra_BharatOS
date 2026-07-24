"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, TrendingUp, Package, ArrowRightLeft,
  CheckCircle, ArrowUpRight, Brain, Download, RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dynamic recommendations powered by API

export default function InventoryAI() {
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executedIds, setExecutedIds] = useState<number[]>([]);

  const fetchInventory = () => {
    fetch("/api/seller/inventory")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProducts(d.products);
          setRecommendations(d.recommendations || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleExecute = async (rec: any) => {
    try {
      const res = await fetch("/api/seller/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: rec.productId, stockToAdd: rec.stockToAdd }),
      });
      if (res.ok) {
        setExecutedIds((prev) => [...prev, rec.id]);
        fetchInventory(); // Instantly refresh the UI to prove data changed
      }
    } catch (e) {
      console.error("Execute failed:", e);
    }
  };

  const handleRestock = async (productId: string, currentStock: number, restockQty: number) => {
    try {
      const res = await fetch("/api/seller/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock: currentStock + restockQty }),
      });
      if (res.ok) {
        fetchInventory();
      }
    } catch (e) {
      console.error("Restock failed:", e);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  const stockSummary = [
    { label: "In Stock", count: products.filter(p => p.status === "healthy").length, color: "var(--success)", pct: Math.round((products.filter(p => p.status === "healthy").length / (products.length || 1)) * 100) },
    { label: "Low Stock", count: products.filter(p => p.status === "low").length, color: "var(--warning)", pct: Math.round((products.filter(p => p.status === "low").length / (products.length || 1)) * 100) },
    { label: "Critical Stock", count: products.filter(p => p.status === "critical").length, color: "var(--danger)", pct: Math.round((products.filter(p => p.status === "critical").length / (products.length || 1)) * 100) },
  ];

  const stockChart = products.map((item) => ({
    name: item.name.split(" ")[0],
    stock: item.stock,
    reorder: item.reorderLevel,
    sold: item.sold,
  }));

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Smart Inventory Recommendations</h2>
          <p>AI-driven stock optimization powered by regional demand signals and sales patterns</p>
        </div>
        <button className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Download size={14} /> Inventory Report
        </button>
      </div>

      {/* Stock Health Summary */}
      <div className="grid-cols-3" style={{ marginBottom: 24 }}>
        {stockSummary.map((s, idx) => (
          <div key={idx} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>{s.label}</div>
            <div className="progress-bar" style={{ marginTop: 12, height: 6 }}>
              <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6 }}>{s.pct}% of total SKUs</div>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Brain size={18} style={{ color: "var(--myntra-pink)" }} /> AI Inventory Recommendations
          </div>
          <span className="badge pink"><Sparkles size={10} style={{ marginRight: 4 }} /> Actions Ready</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                padding: "18px 20px",
                borderRadius: "var(--radius-md)",
                border: `1.5px solid ${executedIds.includes(rec.id) ? "var(--success)" : "var(--border)"}`,
                background: executedIds.includes(rec.id) ? "rgba(0, 208, 132, 0.05)" : "var(--bg-card)",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: `${rec.color}18`, color: rec.color,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {rec.type === "increase" ? <TrendingUp size={20} /> : rec.type === "reduce" ? <Package size={20} /> : <ArrowRightLeft size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <strong style={{ fontSize: 14.5 }}>{rec.title}</strong>
                  <span className={`badge ${rec.badge}`}>{rec.urgency} Priority</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 3 }}>{rec.detail}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                  📍 {rec.region} · {rec.action}
                </div>
              </div>
              <button
                className={`btn btn-sm ${executedIds.includes(rec.id) ? "btn-secondary" : "btn-primary"}`}
                style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                onClick={() => handleExecute(rec)}
              >
                {executedIds.includes(rec.id) ? (
                  <><CheckCircle size={14} /> Executed</>
                ) : (
                  <>Execute <ArrowUpRight size={14} /></>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stock vs Sold Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Stock Level vs. Units Sold</div>
          <span className="badge green">Live Data</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stockChart} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="stock" name="Current Stock" fill="var(--myntra-purple)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" name="Units Sold" fill="var(--myntra-pink)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reorder" name="Reorder Level" fill="var(--warning)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full SKU Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Real-Time SKU Dispatch Matrix</div>
          <span className="badge pink"><Brain size={10} style={{ marginRight: 4 }} /> AI Optimization Live</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                const restockQty = Math.max(10, Math.round((item.sold * 0.15 + (item.reorderLevel || 20)) / 10) * 10);
                return (
                <tr key={item.productId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{item.productId.slice(0, 8)}</div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 80, height: 6 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min((item.stock / Math.max(item.stock + item.sold, 500)) * 100, 100)}%`,
                            background: item.status === "healthy" ? "var(--success)" : item.status === "low" ? "var(--warning)" : "var(--danger)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{item.stock} units</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.status === "healthy" ? "green" : item.status === "low" ? "orange" : "red"}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{item.price}
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={() => handleRestock(item.productId, item.stock, restockQty)}>
                      Restock +{restockQty} <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
