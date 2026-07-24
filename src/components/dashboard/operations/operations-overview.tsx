"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import {
  Activity, Layers, Truck, MapPin, Warehouse, ClipboardList,
  RefreshCw, Star, Leaf, AlertTriangle, Clock, TrendingDown,
  TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Download
} from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";

export default function OperationsOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/operations/dashboard", { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    };

    fetchData(); // Initial fetch
    const id = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(id);
  }, []);

  const kpis_raw = data?.kpis ?? {};

  const kpis = [
    { label: "Total Active Orders", val: kpis_raw.totalActiveOrders ?? 0, icon: <ClipboardList size={18} />, color: "pink", change: "Current live volume" },
    { label: "Active Clusters", val: kpis_raw.activeClusters ?? 0, icon: <Layers size={18} />, color: "purple", change: "Forming & Active" },
    { label: "Vehicles on Road", val: kpis_raw.vehiclesOnRoad ?? 0, icon: <Truck size={18} />, color: "blue", change: "Live tracking" },
    { label: "Avg Delivery Time", val: 0, displayVal: kpis_raw.avgDeliveryTime ?? "0 Hours", icon: <Clock size={18} />, color: "orange", change: "Estimated" },
    { label: "Active Micro Hubs", val: kpis_raw.activeMicroHubs ?? 0, icon: <MapPin size={18} />, color: "green", change: "Optimal status" },
    { label: "Delayed Deliveries", val: kpis_raw.delayedDeliveries ?? 0, icon: <AlertTriangle size={18} />, color: "pink", change: "Needs attention" },
    { label: "Route Efficiency", val: 0, displayVal: `${kpis_raw.routeEfficiencyScore ?? 0}%`, icon: <Activity size={18} />, color: "green", change: "Optimized" },
    { label: "Fuel Saved (L)", val: kpis_raw.totalFuelSaved ?? 0, icon: <Zap size={18} />, color: "blue", change: "Overall" },
    { label: "CO₂ Reduced (kg)", val: kpis_raw.co2Reduced ?? 0, icon: <Leaf size={18} />, color: "green", change: "Overall" },
    { label: "Warehouses", val: data?.warehouses?.length ?? 0, icon: <Warehouse size={18} />, color: "purple", change: `${kpis_raw.warehouseUtilization ?? 0}% avg util` },
  ];

  const liveOrders = data?.liveOrders ?? [];
  const activityFeed = data?.activityFeed ?? [];
  const alerts = data?.activeAlerts ?? [];

  return (
    <div>
      <div className="page-header">
        <h2>Operations Command Center</h2>
        <p>Live data — refreshes every 10 seconds</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className={`card animate-fade-in stagger-${(i % 5) + 1}`}>
            <div className="card-header">
              <div>
                <div className="card-subtitle">{kpi.label}</div>
                <div className="card-value" style={{ marginTop: 4 }}>
                  {kpi.displayVal ?? (
                    <AnimatedCounter end={typeof kpi.val === "number" ? kpi.val : 0} decimals={kpi.val !== Math.round(kpi.val as number) ? 1 : 0} />
                  )}
                </div>
              </div>
              <div className={`card-icon ${kpi.color}`}>{kpi.icon}</div>
            </div>
            <div className="card-change positive" style={{ fontSize: 11 }}>{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-cols-3" style={{ gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-header">
            <div className="card-title">Live Order Volume & Cluster Activity</div>
            <span className="badge green">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={liveOrders}>
              <defs>
                <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3F6C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF3F6C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cluG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="orders" name="Orders" stroke="#FF3F6C" fill="url(#ordG)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="clusters" name="Clusters" stroke="#6C63FF" fill="url(#cluG)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Activity Feed */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Live Activity Feed</div>
            <span className="badge pink" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D084", animation: "bounce 1.2s infinite" }} />Live
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", maxHeight: 280 }}>
            {activityFeed.length === 0 && !loading ? (
               <div style={{ textAlign: "center", padding: 24, color: "var(--text-tertiary)" }}>No recent activity</div>
            ) : (
              activityFeed.map((item: any) => (
                <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, color: "var(--text-primary)", lineHeight: 1.4 }}>{item.msg}</div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>{item.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alerts + Warehouses */}
      <div className="grid-cols-2" style={{ gap: 20 }}>
        {/* Active Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Active Alerts</div>
            <span className="badge pink">{alerts.length} Open</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "var(--text-tertiary)" }}>No active alerts</div>
            ) : (
              alerts.map((a: any) => (
                <div key={a.id} className={`alert-item`} style={{ borderLeft: `4px solid ${a.severity === "critical" ? "var(--error)" : a.severity === "high" ? "var(--warning)" : a.severity === "medium" ? "var(--info)" : "var(--success)"}` }}>
                  <div className={`alert-icon ${a.severity}`}>
                    {a.type === "weather" ? "🌧️" : a.type === "traffic" ? "🚦" : a.type === "capacity" ? "🏭" : a.type === "driver" ? "🚗" : a.type === "route" ? "🛣️" : "📢"}
                  </div>
                  <div>
                    <strong style={{ fontSize: 13 }}>{a.title}</strong>
                    <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>{a.description}</p>
                    <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{a.region}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Warehouse Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Warehouse Utilization</div>
            <span className="badge blue">{data?.warehouses?.length ?? 0} Active</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(data?.warehouses ?? []).slice(0, 5).map((wh: any) => (
              <div key={wh.warehouseId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <Warehouse size={16} style={{ color: "var(--myntra-purple)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{wh.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{wh.city}, {wh.state}</div>
                  <div className="progress-bar" style={{ marginTop: 4 }}>
                    <div className="progress-fill" style={{
                      width: `${wh.utilization}%`,
                      background: wh.utilization > 90 ? "var(--error)" : wh.utilization > 70 ? "var(--warning)" : "var(--success)",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: wh.utilization > 90 ? "var(--error)" : "var(--text-primary)" }}>
                  {wh.utilization}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
