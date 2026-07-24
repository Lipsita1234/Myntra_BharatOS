"use client";

import React, { useState, useRef } from "react";
import { Brain, Send, User, Sparkles, MapPin, Truck, Warehouse, BarChart2, AlertTriangle, RefreshCw } from "lucide-react";

interface Msg { id: number; role: "user" | "ai"; text: string; ts: string; }

const quickPrompts = [
  { text: "Why are deliveries delayed in Patna?", icon: <Truck size={13} /> },
  { text: "Where should we open the next micro hub?", icon: <MapPin size={13} /> },
  { text: "Which warehouse is overloaded?", icon: <Warehouse size={13} /> },
  { text: "Predict tomorrow's delivery cost", icon: <BarChart2 size={13} /> },
  { text: "Which region needs more drivers?", icon: <Truck size={13} /> },
  { text: "How to reduce return logistics cost?", icon: <RefreshCw size={13} /> },
  { text: "Show cluster performance this week", icon: <Sparkles size={13} /> },
  { text: "What is the route efficiency score?", icon: <BarChart2 size={13} /> },
];

const aiResponses: Record<string, string> = {
  "patna": `🚛 **Delivery Delay Analysis – Patna Zone**

Root causes identified:

1. **Road Congestion** — NH-30 is experiencing 60% above-normal traffic due to ongoing construction near Bailey Road.
2. **Driver Shortage** — Only 4 active drivers for Patna zone (minimum required: 8). Surge allocation needed.
3. **Cluster Low Participation** — Patna cluster CL-BR-012 is only 42% full, limiting dispatch eligibility.
4. **Weather** — Light to moderate rain forecast for the next 48 hours slowing last-mile delivery.

✅ **AI Recommendations:**
• Move 2 drivers from Muzaffarpur (currently idle) to Patna zone
• Drop cluster threshold from 8 to 5 orders for Patna
• Pre-position inventory at Patna Junction micro-hub`,

  "micro hub": `📍 **Top Micro Hub Recommendations:**

| Rank | Location | Expected Orders | Savings/Week | Confidence |
|------|----------|----------------|-------------|------------|
| 1 | **Balasore, Odisha** | 180 orders | ₹28,000 | 95% |
| 2 | **Ranchi, Jharkhand** | 140 orders | ₹21,000 | 88% |
| 3 | **Silchar, Assam** | 110 orders | ₹17,500 | 84% |
| 4 | **Warangal, Telangana** | 95 orders | ₹14,200 | 81% |

🏪 **Balasore Analysis:**
• Suggested Hub: ABC Kirana Store, Main Market Road
• Type: Festival Temporary Hub (Rath Yatra season)
• Setup Cost: ₹8,000/month · ROI: 3.5x`,

  "overloaded": `🏭 **Warehouse Capacity Alert:**

⚠️ **Mumbai Thane Hub (WH-002)** is at **95% utilization** — CRITICAL!
• Current stock: 71,250 of 75,000 units
• Incoming today: +78 units
• Available space: ~3,750 units

🔴 **Immediate Action Required:**
1. Move 8,000 units of Western Wear → Pune Logistics Park (WH-007, currently 71%)
2. Move 5,000 units of Footwear → Bangalore Central (WH-001, currently 78%)
3. Halt all new inbound dispatches to Mumbai for 48 hours

💰 **Cost of inaction:** ₹2.1 Lakhs in storage overflow penalty`,

  "tomorrow": `📊 **Tomorrow's Delivery Cost Prediction:**

Based on: Historical data · Festival calendar · Weather · Day-of-week patterns

| Component | Predicted Cost |
|-----------|---------------|
| Last-mile delivery | ₹82,400 |
| Cluster dispatch | ₹34,200 |
| Return pickup | ₹12,800 |
| Micro hub ops | ₹8,600 |
| **Total Estimate** | **₹1,38,000** |

📉 This is **-8.4% vs yesterday** (Saturday effect).
💡 By maximizing cluster fill rate to 85%+, you can save an additional **₹18,200**.`,

  "drivers": `🚗 **Region Driver Analysis:**

Regions with driver shortages:
1. **Patna, Bihar** — 4 drivers active, 8 needed (-4)
2. **Bhubaneswar, Odisha** — 6 drivers, surge demand needs 10 (-4)
3. **Hyderabad** — 8 drivers, peak demand zone needs 12 (-4)

✅ **Reallocation Plan:**
• Move 2 idle drivers from Muzaffarpur → Patna
• Activate 3 reserve drivers in Hyderabad for evening peak
• Delay Bhubaneswar shortage with cluster-based dispatch`,

  "return": `↩️ **Return Logistics Optimization:**

Current return rate: **11.2%** · Monthly return cost: ₹3.4 Lakhs

Top savings opportunities:
1. **Cluster returns in Bangalore** — 14 returns in 2km radius. Single pickup saves ₹480 vs ₹760 individual.
2. **Cuttack cluster** — 9 returns eligible. Pooling saves ₹340.
3. **Mumbai cluster** — 18 returns. Pooling saves ₹720.

Total monthly savings if all returns pooled: **₹1.2 Lakhs** (35% cost reduction)`,

  "cluster performance": `📊 **Cluster Performance – This Week:**

| Region | Clusters | Fill Rate | Savings | Efficiency |
|--------|----------|-----------|---------|------------|
| Karnataka | 28 | 91% | ₹2,24,000 | 94% |
| Maharashtra | 35 | 88% | ₹2,80,000 | 91% |
| Delhi NCR | 31 | 85% | ₹2,48,000 | 89% |
| Odisha | 12 | 74% | ₹96,000 | 83% |
| **Total** | **156** | **87.5%** | **₹16.2L** | **90.2%** |

🏆 Best performer: Karnataka at 94% efficiency
⚠️ Needs improvement: Odisha at 83% — low cluster density`,

  "route efficiency": `📈 **Route Efficiency Score: 91.4%**

Breakdown by algorithm:
• VRP Optimization: 94.2% efficiency
• Traffic Avoidance: 88.6% success rate
• Cluster Priority: 92.1% dispatch accuracy
• Time Window Compliance: 96.3%

🔝 Top performing routes: Bangalore South → 97.2%
⚠️ Lowest: Bihar cluster routes → 78.4% (driver shortage impact)

💡 If Bihar drivers are filled: Overall score would reach **93.8%**`,

  default: `🤖 I'm analyzing your logistics network in real-time...

**Current Network Status:**
• Active Clusters: 156 (87.5% fill rate)
• Vehicles on Road: 392/490
• Today's Cost Savings: ₹4.2 Lakhs vs traditional
• Critical Alerts: 2 (Mumbai capacity, Patna delays)

Ask me about delays, warehouse capacity, driver allocation, route efficiency, or demand predictions!`,
};

// Hardcoded responses removed

export default function AICopilotOps() {
  const [messages, setMessages] = useState<Msg[]>([{
    id: 1, role: "ai",
    text: "<p>👋 <strong>BharatOS AI Logistics Copilot</strong> is ready — now powered by Gemini AI with live data!</p><p>Ask me about delivery delays, warehouse status, driver allocation, route efficiency, or any other logistics question.</p>",
    ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  const send = async (text?: string) => {
    const q = text || input.trim();
    if (!q || typing) return;
    setInput("");
    const userMsg: Msg = { id: Date.now(), role: "user", text: q, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    historyRef.current = [...historyRef.current, { role: "user", text: q }];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current, persona: "ops" }),
      });
      const data = await res.json();
      const responseText = data.response || data.error || "Sorry, I could not process that request.";
      historyRef.current = [...historyRef.current, { role: "model", text: responseText }];
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: responseText, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: "⚠️ Connection error. Please try again.", ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>AI Logistics Copilot</h2>
        <p>Conversational AI assistant with full access to your real-time logistics network data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, height: "calc(100vh - 200px)", minHeight: 580 }}>
        {/* Chat */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, rgba(255,63,108,0.05), rgba(108,99,255,0.05))" }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={20} style={{ color: "white" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>BharatOS Copilot</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block", boxShadow: "0 0 5px var(--success)" }} />
                Ops Intelligence Engine · Live Network Access
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: msg.role === "user" ? "var(--myntra-purple)" : "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {msg.role === "user" ? <User size={16} style={{ color: "white" }} /> : <Brain size={16} style={{ color: "white" }} />}
                </div>
                <div style={{ maxWidth: "76%" }}>
                  <div style={{ padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: msg.role === "user" ? "var(--myntra-pink)" : "var(--bg-tertiary)", color: msg.role === "user" ? "white" : "var(--text-primary)", fontSize: 13, lineHeight: 1.6, border: msg.role === "ai" ? "1px solid var(--border)" : "none" }}>
                    {msg.role === "ai"
                      ? <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      : msg.text
                    }
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 3, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.ts}</div>
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={16} style={{ color: "white" }} />
                </div>
                <div style={{ padding: "10px 16px", borderRadius: "4px 16px 16px 16px", background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-tertiary)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about delays, warehouses, routes, demand..."
              style={{ flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
            <button className="btn btn-primary" onClick={() => send()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Send size={14} /> Ask
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-header"><div className="card-title" style={{ fontSize: 13 }}>Quick Questions</div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => send(p.text)} style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-tertiary)", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--text-primary)", fontWeight: 500, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--myntra-pink)"; e.currentTarget.style.background = "var(--primary-muted)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-tertiary)"; }}
                >
                  <span style={{ color: "var(--myntra-pink)" }}>{p.icon}</span>{p.text}
                </button>
              ))}
            </div>
          </div>

          <div className="card-glass">
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={13} style={{ color: "var(--myntra-pink)" }} /> AI Network Status
            </div>
            {[
              { l: "Active Alerts", v: "6", c: "var(--danger)" },
              { l: "Network Health", v: "91.4%", c: "var(--success)" },
              { l: "Data Sources", v: "14 Live", c: "var(--info)" },
              { l: "Clusters Monitored", v: "156", c: "var(--myntra-purple)" },
              { l: "Last Sync", v: "Just now", c: "var(--text-secondary)" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
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
