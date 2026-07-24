"use client";

import React, { useState, useRef } from "react";
import { Brain, Send, User, Sparkles, MapPin, BarChart2, Warehouse, Truck, TrendingDown, CheckCircle } from "lucide-react";

interface Msg { id: number; role: "user" | "ai"; text: string; confidence?: number; tags?: string[]; }

const quickPrompts = [
  { text: "Which state has the highest logistics cost today?", icon: <MapPin size={13} /> },
  { text: "Which warehouse is overloaded?", icon: <Warehouse size={13} /> },
  { text: "Where should we open the next micro hub?", icon: <MapPin size={13} /> },
  { text: "Which delivery clusters are underperforming?", icon: <BarChart2 size={13} /> },
  { text: "Why are deliveries delayed in Odisha?", icon: <Truck size={13} /> },
  { text: "Predict tomorrow's logistics cost", icon: <BarChart2 size={13} /> },
  { text: "Which sellers need inventory support?", icon: <Sparkles size={13} /> },
  { text: "How can we reduce logistics expenses by 10%?", icon: <TrendingDown size={13} /> },
];

// Hardcoded responses replaced by Gemini AI

export default function AICopilot() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "ai", text: "<p>🤖 <strong>BharatOS Admin Copilot</strong> is ready — now powered by Gemini AI with live database access.</p><p>I can answer questions about warehouses, clusters, deliveries, driver allocation, costs, and strategic decisions. Ask me anything!</p>", confidence: 97, tags: ["Gemini AI", "Live"] }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  const send = async (text?: string) => {
    const q = text || input.trim();
    if (!q || typing) return;
    setInput("");
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: q }]);
    setTyping(true);
    historyRef.current = [...historyRef.current, { role: "user", text: q }];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current, persona: "admin" }),
      });
      const data = await res.json();
      const responseText = data.response || data.error || "Sorry, I could not process that request.";
      historyRef.current = [...historyRef.current, { role: "model", text: responseText }];
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: responseText, confidence: 97, tags: ["Gemini AI", "Live"] }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: "⚠️ Connection error. Please try again.", confidence: 0, tags: [] }]);
    } finally {
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>AI Logistics Copilot</h2>
        <p>Ask business questions in plain English — get data-driven answers with charts, maps, and recommendations</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, height: "calc(100vh - 200px)", minHeight: 600 }}>
        {/* Chat Panel */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,rgba(255,63,108,0.05),rgba(108,99,255,0.05))" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#FF3F6C,#6C63FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={20} style={{ color: "white" }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>BharatOS Admin Copilot</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D084", display: "inline-block", boxShadow: "0 0 5px #00D084" }} />
                Admin Intelligence Engine · Full Network Access
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <span className="badge green">Live</span>
              <span className="badge blue">94.2% Accuracy</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: msg.role === "user" ? "#6C63FF" : "linear-gradient(135deg,#FF3F6C,#6C63FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {msg.role === "user" ? <User size={16} style={{ color: "white" }} /> : <Brain size={16} style={{ color: "white" }} />}
                </div>
                <div style={{ maxWidth: "78%" }}>
                  <div style={{ padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: msg.role === "user" ? "#FF3F6C" : "var(--bg-tertiary)", color: "white", fontSize: 13, lineHeight: 1.65, border: msg.role === "ai" ? "1px solid var(--border)" : "none" }}>
                    {msg.role === "ai"
                      ? <div style={{ color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: msg.text }} />
                      : msg.text
                    }
                  </div>
                  {msg.role === "ai" && msg.confidence && (
                    <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "#00D084", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={10} /> Confidence: {msg.confidence}%
                      </span>
                      {msg.tags?.map((tag, i) => (
                        <span key={i} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 99, background: "rgba(108,99,255,0.15)", color: "#6C63FF", border: "1px solid rgba(108,99,255,0.2)" }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#FF3F6C,#6C63FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={16} style={{ color: "white" }} />
                </div>
                <div style={{ padding: "12px 16px", borderRadius: "4px 16px 16px 16px", background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-tertiary)", animation: `bounce ${0.6 + i * 0.2}s ease-in-out infinite alternate` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about costs, warehouses, micro hubs, sellers, demand..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
            <button className="btn btn-primary" onClick={() => send()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Send size={14} /> Ask AI
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-header"><div className="card-title" style={{ fontSize: 13 }}>Admin Quick Questions</div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => send(p.text)}
                  style={{ padding: "8px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-primary)", fontWeight: 500, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF3F6C"; e.currentTarget.style.background = "var(--primary-muted)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                >
                  <span style={{ color: "#FF3F6C" }}>{p.icon}</span>{p.text}
                </button>
              ))}
            </div>
          </div>

          <div className="card-glass">
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={13} style={{ color: "#FF3F6C" }} /> AI Status
            </div>
            {[
              { l: "Model Version", v: "BharatOS-v3.1", c: "#FF3F6C" },
              { l: "Accuracy", v: "94.2%", c: "#00D084" },
              { l: "Data Sources", v: "18 Live APIs", c: "#6C63FF" },
              { l: "Queries Today", v: "284", c: "var(--text-primary)" },
              { l: "Avg Response", v: "1.4 sec", c: "var(--text-secondary)" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "5px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ color: "var(--text-tertiary)" }}>{item.l}</span>
                <strong style={{ color: item.c }}>{item.v}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
