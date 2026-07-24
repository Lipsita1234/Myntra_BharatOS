"use client";

import React, { useState, useRef } from "react";
import { Database, Upload, RefreshCw, CheckCircle, XCircle, Loader2, FileText, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface GenerateStats {
  customers: number;
  sellers: number;
  products: number;
  warehouses: number;
  vehicles: number;
  orders: number;
  clusters: number;
}

interface GenerateConfig {
  customerCount: number;
  sellerCount: number;
  productsPerSeller: number;
  orderCount: number;
  warehouseCount: number;
  vehicleCount: number;
  clearFirst: boolean;
}

export default function DataManagementPanel() {
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; stats?: GenerateStats; uploadResult?: any } | null>(null);
  const [config, setConfig] = useState<GenerateConfig>({
    customerCount: 30,
    sellerCount: 8,
    productsPerSeller: 6,
    orderCount: 120,
    warehouseCount: 5,
    vehicleCount: 20,
    clearFirst: true,
  });
  const [showConfig, setShowConfig] = useState(false);
  const [uploadType, setUploadType] = useState<"orders" | "products" | "customers">("orders");
  const [uploadMode, setUploadMode] = useState<"extend" | "replace">("extend");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, message: data.message, stats: data.stats });
      } else {
        setResult({ success: false, message: data.error || "Generation failed." });
      }
    } catch (e) {
      setResult({ success: false, message: "Network error during generation." });
    } finally {
      setGenerating(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/upload?type=${uploadType}&mode=${uploadMode}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          success: true,
          message: `Uploaded ${data.inserted} ${uploadType} from ${data.totalRows} rows.`,
          uploadResult: data,
        });
      } else {
        setResult({ success: false, message: data.error || "Upload failed." });
      }
    } catch (e) {
      setResult({ success: false, message: "Network error during upload." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const totalGenerated = result?.stats
    ? Object.values(result.stats).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
        <div style={{ background: "linear-gradient(135deg, #6C63FF, #FF3F6C)", borderRadius: "10px", padding: "10px", display: "flex" }}>
          <Database size={22} color="white" />
        </div>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "18px", margin: 0 }}>Data Management</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>Generate synthetic datasets or upload your own CSV/Excel files</p>
        </div>
      </div>

      {/* Result Banner */}
      {result && (
        <div style={{
          background: result.success ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${result.success ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          borderRadius: "12px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}>
          {result.success ? <CheckCircle size={20} color="#22C55E" style={{ flexShrink: 0 }} /> : <XCircle size={20} color="#EF4444" style={{ flexShrink: 0 }} />}
          <div>
            <p style={{ color: result.success ? "#22C55E" : "#EF4444", fontWeight: 600, margin: 0, fontSize: "14px" }}>{result.message}</p>
            {result.stats && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                {Object.entries(result.stats).map(([key, val]) => (
                  <span key={key} style={{ background: "rgba(108, 99, 255, 0.15)", border: "1px solid rgba(108, 99, 255, 0.3)", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: "#A5A0FF" }}>
                    {key}: <strong>{val}</strong>
                  </span>
                ))}
              </div>
            )}
            {result.uploadResult?.errors?.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <p style={{ color: "#FBBF24", fontSize: "12px", margin: 0 }}>⚠️ {result.uploadResult.errors.length} row errors (first 10 shown)</p>
                {result.uploadResult.errors.slice(0, 3).map((e: string, i: number) => (
                  <p key={i} style={{ color: "var(--text-secondary)", fontSize: "11px", margin: "2px 0" }}>{e}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {/* Section 2: CSV/Excel Upload */}
      <div style={{ background: "var(--border)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <Upload size={18} color="#FF3F6C" />
          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, margin: 0, fontSize: "15px" }}>Upload CSV / Excel Dataset</h3>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px", lineHeight: 1.5 }}>
          Upload a <code style={{ background: "var(--border)", padding: "1px 6px", borderRadius: "4px", fontSize: "12px" }}>.csv</code> or <code style={{ background: "var(--border)", padding: "1px 6px", borderRadius: "4px", fontSize: "12px" }}>.xlsx</code> file.
          Required columns vary by entity type — see the guide below.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block", marginBottom: "6px" }}>Entity Type</label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as any)}
              style={{ width: "100%", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 10px", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
            >
              <option value="orders">Orders</option>
              <option value="products">Products</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <div>
            <label style={{ color: "var(--text-secondary)", fontSize: "11px", display: "block", marginBottom: "6px" }}>Upload Mode</label>
            <select
              value={uploadMode}
              onChange={(e) => setUploadMode(e.target.value as any)}
              style={{ width: "100%", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 10px", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
            >
              <option value="extend">Extend (add to existing)</option>
              <option value="replace">Replace (clear & replace)</option>
            </select>
          </div>
        </div>

        {/* Column Guide */}
        <div style={{ background: "var(--bg-card)", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "11px", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={12} /> Expected columns for <strong style={{ color: "var(--text-secondary)" }}>{uploadType}</strong>:
          </p>
          {uploadType === "orders" && <code style={{ color: "#A5A0FF", fontSize: "11px" }}>productName, status, deliveryMode, amount, shippingCost, location, lat, lng</code>}
          {uploadType === "products" && <code style={{ color: "#A5A0FF", fontSize: "11px" }}>name, category, price, stock, sold, reorderLevel, status</code>}
          {uploadType === "customers" && <code style={{ color: "#A5A0FF", fontSize: "11px" }}>name, email, phone, address</code>}
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            background: uploading ? "rgba(255, 63, 108, 0.2)" : "rgba(255, 63, 108, 0.1)",
            border: "2px dashed rgba(255, 63, 108, 0.4)",
            borderRadius: "10px",
            padding: "18px",
            color: "rgba(255, 63, 108, 0.9)",
            fontWeight: 600,
            fontSize: "14px",
            cursor: uploading ? "not-allowed" : "pointer",
            boxSizing: "border-box",
          }}
        >
          {uploading ? (
            <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Processing file...</>
          ) : (
            <><Upload size={16} />Click to select CSV or Excel file</>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select option { background: #1a1a2e; color: var(--text-primary); }
      `}</style>
    </div>
  );
}
