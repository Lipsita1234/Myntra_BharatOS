"use client";

import React, { useState, useEffect } from "react";
import { Warehouse, Sparkles, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WarehouseIntelligence() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  const fetchWarehouses = () => {
    fetch("/api/operations/warehouses")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.warehouses.length > 0) {
          const items = d.warehouses.map((wh: any, idx: number) => ({
            id: wh.warehouseId,
            warehouseId: wh.warehouseId.slice(0, 8),
            name: wh.name,
            city: wh.city || wh.name.split(" ")[0],
            state: wh.state || "India",
            capacity: wh.capacity,
            orders: wh.orders || wh.inventory,
            utilization: wh.utilization,
            incoming: wh.incoming || 0,
            outgoing: wh.outgoing || 0,
            ai_recommendation: wh.aiRecommendation || "Utilization optimal.",
            alert: wh.utilization >= 80,
          }));
          setWarehouses(items);
          setSelected((prev: any) => {
            const stillExists = items.find((x: any) => x.id === prev?.id);
            return stillExists || items[0];
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <RefreshCw size={32} style={{ animation: "spin 1s linear infinite", color: "var(--myntra-pink)" }} />
      </div>
    );
  }

  const cityGroups = warehouses.reduce((acc, wh) => {
    if (!acc[wh.city]) acc[wh.city] = { sum: 0, count: 0 };
    acc[wh.city].sum += wh.utilization;
    acc[wh.city].count += 1;
    return acc;
  }, {} as Record<string, { sum: number, count: number }>);

  const utilizationChart = Object.keys(cityGroups)
    .map(city => ({
      name: city,
      utilization: Math.round(cityGroups[city].sum / cityGroups[city].count),
      capacity: 100,
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 15); // Top 15 cities

  const totalInventory = warehouses.reduce((s,w) => s + w.orders, 0);
  const avgUtilization = warehouses.length > 0
    ? Math.round(warehouses.reduce((s,w) => s + w.utilization, 0) / warehouses.length)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h2>Warehouse Intelligence</h2>
        <p>Real-time inventory monitoring, capacity alerts, and AI redistribution recommendations</p>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Warehouses", value: warehouses.length, color: "var(--info)" },
          { label: "Total Inventory Units", value: totalInventory.toLocaleString(), color: "var(--myntra-pink)" },
          { label: "Avg Utilization", value: `${avgUtilization}%`, color: "var(--warning)" },
          { label: "Near-Capacity Alerts", value: warehouses.filter(w => w.utilization >= 80).length, color: "var(--error)" },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 10.5, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Utilization Bar Chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Warehouse Utilization by City</div>
          <span className="badge orange">{warehouses.filter(w => w.utilization >= 80).length} Near Capacity</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={utilizationChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 12 }} domain={[0, 100]} unit="%" />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: any) => [`${v}%`, "Utilization"]} />
            <Bar dataKey="utilization" name="Utilization %" fill="var(--myntra-pink)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Warehouse List + Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* List */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">All Warehouses</div>
            <span className="badge blue">{warehouses.length} Active</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>City</th>
                  <th>Utilization</th>
                  <th>Orders</th>
                  <th>Incoming</th>
                  <th>Outgoing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((wh) => (
                  <tr key={wh.id} onClick={() => setSelected(wh)} style={{ cursor: "pointer", background: selected?.id === wh.id ? "var(--bg-tertiary)" : undefined }}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{wh.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{wh.warehouseId}</div>
                    </td>
                    <td>{wh.city}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${wh.utilization}%`, background: wh.utilization >= 80 ? "var(--error)" : "var(--success)" }} />
                        </div>
                        <strong style={{ fontSize: 12, color: wh.utilization >= 80 ? "var(--error)" : "var(--success)" }}>{wh.utilization}%</strong>
                      </div>
                    </td>
                    <td>{wh.orders.toLocaleString()}</td>
                    <td style={{ color: "var(--info)" }}>+{wh.incoming}</td>
                    <td style={{ color: "var(--success)" }}>-{wh.outgoing}</td>
                    <td>
                      {wh.alert
                        ? <span className="badge red">⚠ Alert</span>
                        : <span className="badge green">Normal</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card-glass">
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>{selected.city}, {selected.state} · {selected.warehouseId}</div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span>Storage Utilization</span>
                  <strong style={{ color: selected.utilization >= 80 ? "var(--error)" : "var(--success)" }}>
                    {selected.utilization}%
                  </strong>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${selected.utilization}%`, background: selected.utilization >= 80 ? "var(--error)" : "var(--success)" }} />
                </div>
              </div>

              {[
                { l: "Total Capacity", v: `${(selected.capacity / 1000).toFixed(0)}K units` },
                { l: "Current Orders", v: `${selected.orders.toLocaleString()}` },
                { l: "Incoming (Today)", v: `+${selected.incoming} units` },
                { l: "Outgoing (Today)", v: `-${selected.outgoing} units` },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{row.l}</span>
                  <strong>{row.v}</strong>
                </div>
              ))}
            </div>



            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }} onClick={fetchWarehouses}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 24, color: "var(--text-tertiary)" }}>Select a warehouse</div>
        )}
      </div>
    </div>
  );
}
