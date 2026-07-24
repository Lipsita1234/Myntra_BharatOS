import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { scenarioId } = await req.json();

    if (scenarioId === 1) {
      // 1. Open Warehouse in Ranchi
      // Check if it already exists
      const existing = await prisma.warehouse.findFirst({
        where: { city: "Ranchi" },
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "Ranchi Warehouse is already active in the database.",
          details: `Active as: ${existing.name} (Capacity: ${existing.capacity})`
        });
      }

      const newWarehouse = await prisma.warehouse.create({
        data: {
          name: "Ranchi Micro Hub (WH-006)",
          location: "Ranchi Industrial Area, Kokar",
          city: "Ranchi",
          state: "Jharkhand",
          capacity: 20000,
          inventory: 4500,
          utilization: 22.5,
          orders: 120,
          lat: 23.3441,
          lng: 85.3096,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully opened Ranchi Warehouse in the database!",
        details: `Created new warehouse: ${newWarehouse.name} with 20,000 capacity.`
      });
    }

    if (scenarioId === 3) {
      // 3. Diwali Demand Surge +40%
      // Pre-position inventory: increase stock of all products by 40%
      const products = await prisma.product.findMany();
      
      await prisma.$transaction(
        products.map(p => 
          prisma.product.update({
            where: { productId: p.productId },
            data: { stock: Math.round(p.stock * 1.4) }
          })
        )
      );

      return NextResponse.json({
        success: true,
        message: "Inventory pre-positioning applied successfully!",
        details: `Increased stock levels of all ${products.length} active products by +40% in database.`
      });
    }

    return NextResponse.json({ error: "This scenario cannot be approved or implemented." }, { status: 400 });

  } catch (error: any) {
    console.error("[Implement Scenario Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to implement scenario." }, { status: 500 });
  }
}
