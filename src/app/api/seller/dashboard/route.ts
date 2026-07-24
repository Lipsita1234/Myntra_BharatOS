import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    const sellerId = payload?.userId || "USR-SELLER";

    const [products, orders, demandForecasts] = await Promise.all([
      prisma.product.findMany({ where: { sellerId } }),
      prisma.order.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.demandForecast.findMany({ orderBy: { forecastDate: "desc" }, take: 8 }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const returnedOrders = orders.filter((o) => o.status === "returned").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    const criticalStock = products.filter((p) => p.status === "critical").length;
    const lowStock = products.filter((p) => p.status === "low").length;

    // Weekly revenue trend (last 7 days)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyTrend = days.map((day, i) => {
      const dayOrders = orders.filter((o) => new Date(o.createdAt).getDay() === (i + 1) % 7); // Adjust index if needed, but we'll stick to simplistic logic
      return {
        day,
        revenue: dayOrders.reduce((sum, o) => sum + o.amount, 0), // Removed mock fallback
        orders: dayOrders.length, // Removed mock fallback
      };
    });

    // Dynamic Performance Metrics Calculation
    const totalOrders = orders.length || 1; 
    const totalProducts = products.length || 1;
    
    const returnRateScore = Math.round(100 - ((returnedOrders / totalOrders) * 100));
    const onTimeShippingScore = Math.round(((deliveredOrders + pendingOrders) / totalOrders) * 100) || 91; // Base 91 if empty
    const inventoryScore = Math.round(100 - ((criticalStock / totalProducts) * 100));
    const orderAccuracyScore = Math.round(100 - ((returnedOrders / totalOrders) * 20)) || 98; // Base 98
    const salesGrowthScore = Math.min(100, Math.max(60, Math.round(50 + (totalRevenue / 10000))));
    const customerRatingScore = Math.min(100, Math.max(80, Math.round(100 - (returnedOrders / totalOrders) * 50)));

    const performanceMetrics = [
      { label: "Customer Ratings", score: customerRatingScore, max: 100, color: "var(--warning)" },
      { label: "On-Time Shipping", score: onTimeShippingScore, max: 100, color: "var(--success)" },
      { label: "Order Accuracy", score: orderAccuracyScore, max: 100, color: "var(--myntra-purple)" },
      { label: "Return Rate", score: returnRateScore, max: 100, color: "var(--myntra-pink)" },
      { label: "Inventory Availability", score: inventoryScore, max: 100, color: "var(--info)" },
      { label: "Sales Growth", score: salesGrowthScore, max: 100, color: "var(--success)" },
    ];

    // Monthly revenue trend (4 weeks)
    const monthlyTrend = ["W1", "W2", "W3", "W4"].map((week, i) => {
      const weekOrders = orders.slice(i * 7, (i + 1) * 7);
      return {
        day: week,
        revenue: weekOrders.reduce((sum, o) => sum + o.amount, 0),
        orders: weekOrders.length,
      };
    });

    return NextResponse.json({
      success: true,
      kpis: {
        totalRevenue,
        deliveredOrders,
        returnedOrders,
        pendingOrders,
        avgOrderValue,
        totalProducts: products.length,
        criticalStock,
        lowStock,
      },
      products,
      recentOrders: orders.slice(0, 10),
      demandForecasts,
      weeklyTrend,
      monthlyTrend,
      performanceMetrics,
    });
  } catch (error) {
    console.error("Seller dashboard error:", error);
    return NextResponse.json({ error: "Failed to load seller data" }, { status: 500 });
  }
}
