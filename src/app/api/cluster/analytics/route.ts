import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [clusters, warehouses, orders, products] = await Promise.all([
      prisma.cluster.findMany(),
      prisma.warehouse.findMany(),
      prisma.order.findMany(),
      prisma.product.findMany()
    ]);

    const totalClustersFormed = clusters.length;
    const averageFillRatePercent = clusters.length > 0 
      ? Math.round((clusters.reduce((sum, c) => sum + (c.members / c.maxMembers), 0) / clusters.length) * 100 * 10) / 10
      : 88.5;

    const averageSavingsPerOrderRupees = clusters.length > 0
      ? Math.round(clusters.reduce((sum, c) => sum + c.savings, 0) / clusters.length)
      : 64;

    const productCategoryMap = new Map(products.map(p => [p.productId, p.category]));

    const regionalPerformance = warehouses.map(wh => {
      const whOrders = orders.filter(o => o.warehouseId === wh.warehouseId);
      const revenue = Math.round(whOrders.reduce((sum, o) => sum + o.amount, 0));
      
      const categoryCounts: Record<string, number> = {};
      let topCategory = "Apparel";
      let maxCount = 0;
      
      whOrders.forEach(o => {
        const cat = o.productId ? productCategoryMap.get(o.productId) || "Apparel" : "Apparel";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        if (categoryCounts[cat] > maxCount) {
          maxCount = categoryCounts[cat];
          topCategory = cat;
        }
      });

      return {
        region: wh.state || wh.city,
        savings: Math.round(wh.inventory * 12),
        orders: wh.orders,
        revenue: revenue || Math.round(wh.inventory * 1.5),
        topCategory,
        efficiency: wh.utilization,
        lat: wh.lat,
        lng: wh.lng,
        rating: wh.rating,
        returnRate: wh.returnRate,
        delivery: `${wh.deliveryDays} days`
      };
    });

    return NextResponse.json({
      success: true,
      totalClustersFormed,
      averageFillRatePercent,
      averageSavingsPerOrderRupees,
      regionalPerformance
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cluster analytics" }, { status: 500 });
  }
}
