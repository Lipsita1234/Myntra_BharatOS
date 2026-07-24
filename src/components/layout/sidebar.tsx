"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  Settings,
  Shield,
  Map,
  Package,
  BarChart3,
  Truck,
  Brain,
  Bell,
  FileText,
  Layers,
  Leaf,
  Route,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Cpu,
  Users,
  MapPin,
  Play,
  Sparkles,
  Download,
  Search,
  LogOut,
  Database,
} from "lucide-react";

export type DashboardRole = "customer" | "seller" | "operations" | "admin";
export type PageId =
  | "shop"
  | "standard-checkout"
  | "overview"
  | "clusters"
  | "community"
  | "prediction"
  | "priority"
  | "sustainability"
  | "live-map"
  | "seller-overview"
  | "demand-heatmap"
  | "demand-forecast"
  | "inventory-ai"
  | "delivery-performance"
  | "ai-advisor"
  | "ops-overview"
  | "cluster-monitor"
  | "route-optimizer"
  | "fleet"
  | "warehouse"
  | "traffic-weather"
  | "return-pooling"
  | "micro-hubs"
  | "sustainability-ops"
  | "digital-twin"
  | "ai-copilot-ops"
  | "smart-alerts"
  | "admin-analytics"
  | "ai-copilot"
  | "live-alerts"
  | "reports"
  | "admin-heatmap"
  | "admin-scenario"
  | "admin-recommendations"
  | "admin-insights"
  | "admin-system-roles"
  | "dataset-ml"
  | "data-management";

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navConfig: Record<DashboardRole, NavSection[]> = {
  customer: [
    {
      title: "Dashboard",
      items: [
        { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
        { id: "shop", label: "Shop Catalog", icon: <Store /> },
        { id: "clusters", label: "AI Smart Cluster", icon: <Layers /> },
        { id: "community", label: "Community Delivery", icon: <Users /> },
        { id: "prediction", label: "AI Prediction", icon: <Brain /> },
      ],
    },
    {
      title: "Delivery",
      items: [
        { id: "sustainability", label: "Sustainability", icon: <Leaf /> },
      ],
    },
  ],
  seller: [
    {
      title: "Seller Portal",
      items: [
        { id: "seller-overview", label: "Overview", icon: <Store /> },
        { id: "demand-forecast", label: "Demand Forecast", icon: <BarChart3 /> },
        { id: "demand-heatmap", label: "Seller Heatmap", icon: <Map /> },
        { id: "inventory-ai", label: "Smart Inventory", icon: <ShoppingCart /> },
        { id: "delivery-performance", label: "Delivery Performance", icon: <Truck /> },
        { id: "ai-advisor", label: "AI Business Advisor", icon: <Brain /> },
      ],
    },
  ],
  operations: [
    {
      title: "Control Center",
      items: [
        { id: "ops-overview", label: "Overview", icon: <Settings /> },
        { id: "cluster-monitor", label: "Cluster Monitor", icon: <Layers /> },
        { id: "fleet", label: "Fleet Monitoring", icon: <Truck /> },
      ],
    },
    {
      title: "Infrastructure",
      items: [
        { id: "warehouse", label: "Warehouse Intel", icon: <Warehouse /> },
        { id: "micro-hubs", label: "Micro Hubs", icon: <MapPin /> },
        { id: "return-pooling", label: "Return Pooling", icon: <Undo2 /> },
      ],
    },
    {
      title: "Intelligence",
      items: [
        { id: "sustainability-ops", label: "Sustainability", icon: <Leaf /> },
        { id: "digital-twin", label: "AI Scenario Simulator", icon: <Cpu /> },
        { id: "ai-copilot-ops", label: "AI Copilot", icon: <Brain /> },
        { id: "dataset-ml", label: "Dynamic ML Predictor", icon: <Sparkles /> },
      ],
    },
  ],
  admin: [
    {
      title: "Executive Control",
      items: [
        { id: "admin-analytics", label: "Overview", icon: <LayoutDashboard /> },
        { id: "admin-heatmap", label: "National Heatmap", icon: <Map /> },
        { id: "admin-scenario", label: "Scenario Planner", icon: <Play /> },
        { id: "admin-recommendations", label: "AI Recommendations", icon: <Sparkles /> },
      ],
    },
    {
      title: "Business Intelligence",
      items: [
        { id: "reports", label: "Reports Center", icon: <Download /> },
        { id: "admin-insights", label: "AI Insights & Alerts", icon: <Cpu /> },
        { id: "ai-copilot", label: "Logistics Copilot", icon: <Brain /> },
        { id: "admin-system-roles", label: "System & Roles", icon: <Shield /> },
        { id: "dataset-ml", label: "Dynamic ML Predictor", icon: <Sparkles /> },
        { id: "data-management", label: "Data Management", icon: <Database /> },
      ],
    },
  ],
};

const roleLabels: Record<DashboardRole, string> = {
  customer: "Customer",
  seller: "Seller",
  operations: "Operations",
  admin: "Admin",
};

const roleIcons: Record<DashboardRole, string> = {
  customer: "C",
  seller: "S",
  operations: "O",
  admin: "A",
};

interface SidebarProps {
  role: DashboardRole;
  activePageId: PageId;
  onPageChange: (pageId: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  role,
  activePageId,
  onPageChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const sections = navConfig[role];

  // Dynamic user mapping based on active role
  const profileDetails = {
    customer: { name: "Priya Sharma", initial: "P", roleLabel: "Customer" },
    seller: { name: "Aanya Boutiques", initial: "A", roleLabel: "Seller" },
    operations: { name: "Anish Gupta", initial: "A", roleLabel: "Operations" },
    admin: { name: "Executive Admin", initial: "E", roleLabel: "Admin" },
  }[role];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo / Brand */}
      <a href="/" className="sidebar-header" style={{ textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        {!collapsed && (
          <div className="sidebar-brand">
            <h1>Myntra <span style={{ background: "linear-gradient(135deg, #FF3F6C, #6C63FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>BharatOS</span></h1>
            <span>AI Logistics</span>
          </div>
        )}
      </a>

      {/* Search Box in Sidebar */}
      {!collapsed && (
        <div className="sidebar-search animate-fade-in">
          <Search size={14} style={{ color: "var(--text-tertiary)" }} />
          <input type="text" placeholder="Search orders, clusters, regions..." />
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <div className="nav-section-title">{section.title}</div>
            )}
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePageId === item.id ? "active" : ""}`}
                onClick={() => onPageChange(item.id)}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-profile">
        <div className="profile-avatar-circle" style={{ background: role === "customer" ? "#3b82f6" : role === "seller" ? "#00D084" : role === "operations" ? "#FFB547" : "#FF3F6C" }}>
          {profileDetails.initial}
        </div>
        {!collapsed && (
          <>
            <div className="profile-info animate-fade-in">
              <span className="profile-name">{profileDetails.name}</span>
              <span className="profile-role">{profileDetails.roleLabel}</span>
            </div>
            <button 
              className="profile-logout-btn" 
              title="Logout" 
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/';
                } catch (e) {
                  window.location.href = '/';
                }
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>

      {/* Collapse Toggle */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)" }}>
        <button
          className="nav-item"
          onClick={onToggleCollapse}
          style={{ justifyContent: collapsed ? "center" : "flex-start", padding: "8px 12px" }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
          {!collapsed && <span style={{ fontSize: "12px" }}>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}

export { navConfig, roleLabels, roleIcons };
export type { NavItem, NavSection };
