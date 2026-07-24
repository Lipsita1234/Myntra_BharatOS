"use client";

import React from "react";
import { Search, Bell, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { DashboardRole, roleLabels, roleIcons } from "./sidebar";

const roles: DashboardRole[] = ["customer", "seller", "operations", "admin"];

interface HeaderProps {
  role: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
  onMenuToggle: () => void;
}

export default function Header({ role, onRoleChange, onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-btn" onClick={onMenuToggle} style={{ display: "none" }} id="menu-toggle-desktop">
          <Menu size={18} />
        </button>
        <button className="header-btn mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={18} />
        </button>
        <div className="header-search">
          <Search size={16} />
          <input placeholder="Search orders, clusters, regions..." />
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme} 
          className="theme-pill-toggle"
          aria-label="Toggle Theme"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "56px",
            height: "28px",
            borderRadius: "999px",
            background: theme === "dark" ? "rgba(108, 99, 255, 0.15)" : "rgba(148, 163, 184, 0.15)",
            border: "1px solid " + (theme === "dark" ? "rgba(108, 99, 255, 0.3)" : "rgba(148, 163, 184, 0.3)"),
            position: "relative",
            padding: "0 6px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginRight: "4px"
          }}
        >
          <Sun size={12} style={{ color: theme === "dark" ? "var(--text-tertiary)" : "#FFB547", zIndex: 2, transition: "color 0.2s" }} />
          <Moon size={12} style={{ color: theme === "dark" ? "#A5B4FC" : "var(--text-tertiary)", zIndex: 2, transition: "color 0.2s" }} />
          
          {/* Sliding toggle circle */}
          <div 
            style={{
              position: "absolute",
              top: "2px",
              left: theme === "dark" ? "29px" : "3px",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF3F6C, #6C63FF)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1
            }}
          />
        </button>

        <div style={{ position: "relative" }}>
          <button 
            className="header-btn" 
            onClick={() => { 
              setShowNotifications(!showNotifications); 
              setUnreadNotifications(0); 
            }} 
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && <span className="badge-dot" />}
          </button>
          
          {showNotifications && (
            <div 
              className="card animate-fade-in" 
              style={{ 
                position: "absolute", 
                top: "45px", 
                right: 0, 
                width: "280px", 
                zIndex: 100, 
                boxShadow: "var(--shadow-lg)", 
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "left"
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "13px", borderBottom: "1px solid var(--border)", paddingBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Alerts & Notifications</span>
                <span className="badge pink" style={{ fontSize: "10px" }}>Real-time</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", borderBottom: "1px solid rgba(148, 163, 184, 0.08)", paddingBottom: "6px" }}>
                  <strong style={{ color: "var(--myntra-pink)" }}>Cluster Optimized</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "2px", fontSize: "11px", lineHeight: "1.4" }}>Cluster #OD-204 consolidations complete. Savings generated: ₹1,480.</p>
                </div>
                <div style={{ fontSize: "12px", borderBottom: "1px solid rgba(148, 163, 184, 0.08)", paddingBottom: "6px" }}>
                  <strong style={{ color: "var(--info)" }}>Fleet Rerouted</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "2px", fontSize: "11px", lineHeight: "1.4" }}>Delayed cluster CL-WB-019 rerouted to EV Van-07 bypass line.</p>
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong style={{ color: "var(--success)" }}>Demand Peak Alert</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "2px", fontSize: "11px", lineHeight: "1.4" }}>Sellers in Delhi NCR notified of upcoming weekend saree demand spike.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="role-switcher" style={{ cursor: "default" }} title="Your current role">
          <div className="role-avatar">{roleIcons[role]}</div>
          <span>{roleLabels[role]}</span>
        </div>
      </div>

    </header>
  );
}
