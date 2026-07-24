"use client";

import React, { useState, useEffect } from "react";
import Sidebar, { DashboardRole, PageId, navConfig } from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme-provider";
import { useSearchParams } from "next/navigation";

// Customer Dashboards
import CustomerOverview from "@/components/dashboard/customer/customer-overview";
import SmartCluster from "@/components/dashboard/customer/smart-cluster";
import CommunityDelivery from "@/components/dashboard/customer/community-delivery";
import ClusterPrediction from "@/components/dashboard/customer/cluster-prediction";
import DeliveryPriority from "@/components/dashboard/customer/delivery-priority";
import SustainabilityDashboard from "@/components/dashboard/customer/sustainability-dashboard";
import LiveIndiaMap from "@/components/dashboard/customer/live-india-map";
import ShopCatalog from "@/components/dashboard/customer/shop-catalog";
import StandardCheckout from "@/components/dashboard/customer/standard-checkout";

// Seller Dashboards
import SellerOverview from "@/components/dashboard/seller/seller-overview";
import SellerHeatmap from "@/components/dashboard/seller/seller-heatmap";
import DemandForecast from "@/components/dashboard/seller/demand-forecast";
import InventoryAI from "@/components/dashboard/seller/inventory-ai";
import DeliveryPerformance from "@/components/dashboard/seller/delivery-performance";
import AIBusinessAdvisor from "@/components/dashboard/seller/ai-business-advisor";

// Operations Dashboards
import OperationsOverview from "@/components/dashboard/operations/operations-overview";
import ClusterMonitor from "@/components/dashboard/operations/cluster-monitor";
import RouteOptimizer from "@/components/dashboard/operations/route-optimizer";
import FleetOptimization from "@/components/dashboard/operations/fleet-optimization";
import WarehouseIntelligence from "@/components/dashboard/operations/warehouse-intelligence";
import TrafficWeather from "@/components/dashboard/operations/traffic-weather";
import MicroHubRecommendation from "@/components/dashboard/operations/micro-hub-recommendation";
import ReturnPooling from "@/components/dashboard/operations/return-pooling";
import SustainabilityOps from "@/components/dashboard/operations/sustainability-ops";
import DigitalTwin from "@/components/dashboard/operations/digital-twin";
import SmartAlerts from "@/components/dashboard/operations/smart-alerts";
import AICopilotOps from "@/components/dashboard/operations/ai-copilot-ops";

// Admin Dashboards
import AdminAnalytics from "@/components/dashboard/admin/admin-analytics";
import AICopilot from "@/components/dashboard/admin/ai-copilot";
import LiveAlerts from "@/components/dashboard/admin/live-alerts";
import ReportsPanel from "@/components/dashboard/admin/reports-panel";
import NationalHeatmap from "@/components/dashboard/admin/national-heatmap";
import AIScenarioPlanner from "@/components/dashboard/admin/scenario-planner";
import AIRecommendationCenter from "@/components/dashboard/admin/ai-recommendation-center";
import AIInsights from "@/components/dashboard/admin/ai-insights";
import SystemRoles from "@/components/dashboard/admin/system-roles";
import DatasetML from "@/components/dashboard/shared/dataset-ml";
import DataManagement from "@/components/dashboard/admin/data-management";

// Component wrapper that wraps everything inside Suspense to support searchParams
function DashboardContent() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<DashboardRole>("customer");
  const [activePageId, setActivePageId] = useState<PageId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Hide sidebar by default on mobile devices
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }

    fetch("/api/auth/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.user?.role) {
          const userRole = d.user.role as DashboardRole;
          setRole(userRole);
          const defaultPage = navConfig[userRole][0].items[0].id;
          setActivePageId(defaultPage);
        }
      });
  }, []);

  // Set default page when switching roles
  const handleRoleChange = (newRole: DashboardRole) => {
    // Role changing disabled for real auth, but keep function signature for header/sidebar props
  };

  const renderActivePage = () => {
    switch (activePageId) {
      // Customer
      case "shop":
        return <ShopCatalog onNavigate={setActivePageId} />;
      case "standard-checkout":
        return <StandardCheckout />;
      case "overview":
        return <CustomerOverview />;
      case "clusters":
        return <SmartCluster />;
      case "community":
        return <CommunityDelivery />;
      case "prediction":
        return <ClusterPrediction />;
      case "priority":
        return <DeliveryPriority />;
      case "sustainability":
        return <SustainabilityDashboard />;
      case "live-map":
        return <LiveIndiaMap />;

      // Seller
      case "seller-overview":
        return <SellerOverview />;
      case "demand-heatmap":
        return <SellerHeatmap />;
      case "demand-forecast":
        return <DemandForecast />;
      case "inventory-ai":
        return <InventoryAI />;
      case "delivery-performance":
        return <DeliveryPerformance />;
      case "ai-advisor":
        return <AIBusinessAdvisor />;

      // Operations
      case "ops-overview":
        return <OperationsOverview />;
      case "cluster-monitor":
        return <ClusterMonitor />;
      case "route-optimizer":
        return <RouteOptimizer />;
      case "fleet":
        return <FleetOptimization />;
      case "warehouse":
        return <WarehouseIntelligence />;
      case "traffic-weather":
        return <TrafficWeather />;
      case "micro-hubs":
        return <MicroHubRecommendation />;
      case "return-pooling":
        return <ReturnPooling />;
      case "sustainability-ops":
        return <SustainabilityOps />;
      case "digital-twin":
        return <DigitalTwin />;
      case "smart-alerts":
        return <SmartAlerts />;
      case "ai-copilot-ops":
        return <AICopilotOps />;

      // Admin
      case "admin-analytics":
        return <AdminAnalytics />;
      case "ai-copilot":
        return <AICopilot />;
      case "live-alerts":
        return <LiveAlerts />;
      case "reports":
        return <ReportsPanel />;
      case "admin-heatmap":
        return <NationalHeatmap />;
      case "admin-scenario":
        return <AIScenarioPlanner />;
      case "admin-recommendations":
        return <AIRecommendationCenter />;
      case "admin-insights":
        return <AIInsights />;
      case "admin-system-roles":
        return <SystemRoles />;
      case "dataset-ml":
        return <DatasetML />;
      case "data-management":
        return <DataManagement />;

      default:
        return <CustomerOverview />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        role={role}
        activePageId={activePageId}
        onPageChange={setActivePageId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-content">
        <Header
          role={role}
          onRoleChange={handleRoleChange}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="page-content">{renderActivePage()}</main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <React.Suspense
      fallback={
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          Loading dashboard context...
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
