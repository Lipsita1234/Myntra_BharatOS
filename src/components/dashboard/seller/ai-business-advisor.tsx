"use client";

import React, { useState, useRef } from "react";
import { Brain, Send, User, Sparkles, TrendingUp, Package, MapPin, BarChart2, RefreshCw } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  isHtml?: boolean;
  timestamp: string;
}

const quickQuestions = [
  { text: "Which product should I restock?", icon: <Package size={13} /> },
  { text: "Where should I increase inventory?", icon: <MapPin size={13} /> },
  { text: "Why have my sales dropped?", icon: <TrendingUp size={13} /> },
  { text: "What products will trend next month?", icon: <BarChart2 size={13} /> },
  { text: "Show cluster performance this week", icon: <Sparkles size={13} /> },
  { text: "How can I reduce return rates?", icon: <RefreshCw size={13} /> },
];



export default function AIBusinessAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: "ai",
      text: "👋 Welcome to your <strong>AI Business Advisor</strong> — now powered by Gemini AI!<br/><br/>I have live access to your store data. I can help with:<br/>📦 Inventory restocking decisions<br/>📍 Regional demand insights<br/>📊 Sales analysis &amp; trend forecasting<br/>🚚 Delivery performance optimization<br/>↩️ Return rate reduction strategies<br/><br/>Ask me anything about your business!",
      isHtml: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Keep a running chat history to give Gemini conversation context
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  const handleSend = async (text?: string) => {
    const question = text || input.trim();
    if (!question || isTyping) return;

    const userMsg: Message = {
      id: Date.now(), role: "user", text: question, isHtml: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    historyRef.current = [...historyRef.current, { role: "user", text: question }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current, persona: "seller" }),
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || "Request failed");
      }
      
      const responseText = data.response || "Sorry, I could not process that request.";
      historyRef.current = [...historyRef.current, { role: "model", text: responseText }];
      
      const aiMsg: Message = {
        id: Date.now() + 1, role: "ai", text: responseText, isHtml: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      // Remove the last user message from history so the error state doesn't break future context
      historyRef.current = historyRef.current.slice(0, -1);
      
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: "ai", 
        isHtml: false, 
        text: e.message || "⚠️ Connection error. Please try again.", 
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
      }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>AI Business Advisor</h2>
        <p>Your AI-powered business assistant — ask anything about sales, inventory, demand, or delivery</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, height: "calc(100vh - 220px)", minHeight: 560 }}>
        {/* Chat Window */}
        <div className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
          {/* Chat Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg, rgba(255,63,108,0.05), rgba(108,99,255,0.05))",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Brain size={20} style={{ color: "white" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>BharatOS AI Advisor</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block", boxShadow: "0 0 6px var(--success)" }} />
                Powered by Gemini AI · Live DB Context
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: msg.role === "user" ? "var(--myntra-purple)" : "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {msg.role === "user" ? <User size={16} style={{ color: "white" }} /> : <Brain size={16} style={{ color: "white" }} />}
                </div>
                <div style={{ maxWidth: "75%" }}>
                  <div style={{
                    padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    background: msg.role === "user" ? "var(--myntra-pink)" : "var(--bg-tertiary)",
                    color: msg.role === "user" ? "white" : "var(--text-primary)",
                    fontSize: 13, lineHeight: 1.6,
                    border: msg.role === "ai" ? "1px solid var(--border)" : "none",
                  }}>
                    {msg.isHtml 
                      ? <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      : msg.text
                    }
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--myntra-pink), var(--myntra-purple))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Brain size={16} style={{ color: "white" }} />
                </div>
                <div style={{ padding: "10px 16px", borderRadius: "4px 16px 16px 16px", background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "var(--text-tertiary)",
                      animation: `bounce 1.2s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about inventory, demand, sales or delivery..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)", background: "var(--bg-tertiary)",
                color: "var(--text-primary)", fontSize: 13, outline: "none",
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleSend()}
              style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>

        {/* Quick Questions Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ fontSize: 13 }}>Quick Questions</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.text)}
                  style={{
                    padding: "10px 12px", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)", background: "var(--bg-tertiary)",
                    cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                    fontSize: 12, color: "var(--text-primary)", fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-muted)"; e.currentTarget.style.borderColor = "var(--myntra-pink)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <span style={{ color: "var(--myntra-pink)" }}>{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          </div>

          <div className="card-glass" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={14} style={{ color: "var(--myntra-pink)" }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>AI Insights</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Data Sources Active", value: "12" },
                { label: "Model Accuracy", value: "94.2%" },
                { label: "Last Updated", value: "Just now" },
                { label: "Predictions Ready", value: "5 regions" },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{item.label}</span>
                  <strong style={{ color: "var(--text-primary)" }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
