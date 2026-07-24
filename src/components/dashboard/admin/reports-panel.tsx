"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, RefreshCw, CheckCircle, Clock, TrendingUp, Package, Leaf } from "lucide-react";

interface ReportData {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  fetchUrl: string;
  csvHeaders: string[];
  csvMapper: (row: any) => string[];
}

const REPORTS: ReportData[] = [
  {
    id: "orders",
    title: "Orders & Delivery Report",
    desc: "All recent orders with status, product, amount, and location from the live database.",
    icon: <Package size={28} style={{ color: "var(--myntra-pink)" }} />,
    fetchUrl: "/api/admin/report/orders",
    csvHeaders: ["Order ID", "Product", "Status", "Amount (₹)", "Location", "Date"],
    csvMapper: (r) => [r.orderId, r.productName, r.status, r.amount, r.location, new Date(r.createdAt).toLocaleDateString("en-IN")],
  },
  {
    id: "sustainability",
    title: "Sustainability & ESG Report",
    desc: "CO2 reduced, fuel saved, money saved, deliveries optimised — all from real sustainability records.",
    icon: <Leaf size={28} style={{ color: "#00D084" }} />,
    fetchUrl: "/api/admin/report/sustainability",
    csvHeaders: ["Date", "CO2 Reduced (kg)", "Fuel Saved (L)", "Money Saved (₹)", "Deliveries Optimised", "Trips Reduced"],
    csvMapper: (r) => [new Date(r.createdAt).toLocaleDateString("en-IN"), r.co2Reduced, r.fuelSaved, r.moneySaved, r.deliveriesOptimized, r.tripsReduced],
  },
  {
    id: "performance",
    title: "Fleet & Cluster Performance",
    desc: "Vehicle status, deliveries per driver, cluster savings and fill rates from live data.",
    icon: <TrendingUp size={28} style={{ color: "#00C2FF" }} />,
    fetchUrl: "/api/admin/report/performance",
    csvHeaders: ["Vehicle ID", "Driver", "Type", "Status", "Deliveries", "Fuel (%)", "Rating"],
    csvMapper: (r) => [r.vehicleId, r.driver, r.vehicleType, r.status, r.deliveries, r.fuel, r.rating],
  },
];

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const content = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPanel() {
  const [state, setState] = useState<Record<string, "idle" | "loading" | "done" | "error">>({});
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch row counts for display
    REPORTS.forEach(r => {
      fetch(r.fetchUrl + "?count=true")
        .then(res => res.json())
        .then(data => {
          if (data.count !== undefined) setCounts(prev => ({ ...prev, [r.id]: data.count }));
        })
        .catch(() => {});
    });
  }, []);

  const handleDownload = async (report: ReportData) => {
    setState(prev => ({ ...prev, [report.id]: "loading" }));
    try {
      const res = await fetch(report.fetchUrl);
      const data = await res.json();
      if (!data.rows || !Array.isArray(data.rows)) throw new Error("No data");

      const csvRows = data.rows.map(report.csvMapper);
      downloadCSV(`${report.id}-report-${new Date().toISOString().slice(0, 10)}.csv`, report.csvHeaders, csvRows);
      setState(prev => ({ ...prev, [report.id]: "done" }));
    } catch {
      setState(prev => ({ ...prev, [report.id]: "error" }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Reports Center</h2>
        <p>Download live CSV reports generated directly from the database — no mock data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {REPORTS.map((report) => {
          const s = state[report.id] || "idle";
          const count = counts[report.id];
          return (
            <div key={report.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {report.icon}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{report.title}</div>
                  {count !== undefined && (
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{count} records live</div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {report.desc}
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                {report.csvHeaders.slice(0, 3).map(h => (
                  <span key={h} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "var(--border)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}>
                    {h}
                  </span>
                ))}
                {report.csvHeaders.length > 3 && (
                  <span style={{ fontSize: 10, color: "var(--text-tertiary)", padding: "2px 4px" }}>+{report.csvHeaders.length - 3} more</span>
                )}
              </div>

              <button
                className={`btn btn-sm ${s === "done" ? "btn-secondary" : "btn-primary"}`}
                onClick={() => handleDownload(report)}
                disabled={s === "loading"}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: "auto" }}
              >
                {s === "loading" && <><RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> Generating...</>}
                {s === "done" && <><CheckCircle size={12} /> Downloaded ✓</>}
                {s === "error" && <><FileText size={12} /> Retry Download</>}
                {s === "idle" && <><Download size={12} /> Download CSV</>}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: "var(--radius-md)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", fontSize: 12.5, color: "var(--text-secondary)", display: "flex", gap: 10, alignItems: "center" }}>
        <FileText size={14} style={{ color: "var(--myntra-pink)", flexShrink: 0 }} />
        All reports are generated live from your SQLite database at download time. No cached or mock data is used.
      </div>
    </div>
  );
}
