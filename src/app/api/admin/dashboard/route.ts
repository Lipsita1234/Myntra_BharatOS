import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalOrders,
      activeClusterCount,
      pendingOrders,
      vehicleCount,
      deliveredOrders,
      warehouseCount,
      sustainability,
      alerts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.cluster.count({ where: { status: "active" } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.vehicle.count({ where: { status: "active" } }),
      prisma.order.count({ where: { status: "delivered" } }),
      prisma.warehouse.count(),
      prisma.sustainability.findFirst({ orderBy: { createdAt: "desc" } }),
      prisma.alert.findMany({ where: { resolved: false }, orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { customer: true } }),
    ]);

    // Compute cluster participation rate
    const communityOrders = await prisma.order.count({ where: { deliveryMode: "community" } });
    const communityRate = totalOrders > 0 ? Math.round((communityOrders / totalOrders) * 100) : 0;

    // Revenue sum
    const revenueAgg = await prisma.order.aggregate({ _sum: { amount: true } });
    const totalRevenue = revenueAgg._sum.amount || 0;

    return NextResponse.json({
      success: true,
      kpis: {
        totalOrders,
        activeClusters: activeClusterCount,
        pendingOrders,
        activeVehicles: vehicleCount,
        deliveredOrders,
        totalWarehouses: warehouseCount,
        communityDeliveryRate: communityRate,
        totalRevenue,
        fuelSaved: sustainability?.fuelSaved || 0,
        co2Reduced: sustainability?.co2Reduced || 0,
        deliveriesOptimized: sustainability?.deliveriesOptimized || 0,
        moneySaved: sustainability?.moneySaved || 0,
      },
      alerts,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        customerName: o.customer.name,
      })),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
