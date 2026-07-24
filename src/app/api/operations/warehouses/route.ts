import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET all warehouses
export async function GET() {
  try {
    const warehouses: any[] = await prisma.$queryRaw`SELECT * FROM Warehouse`;
    return NextResponse.json({ success: true, warehouses });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 });
  }
}

// POST execute AI recommendation
export async function POST(req: Request) {
  try {
    const { warehouseId, action, warehouseName } = await req.json();
    
    const u = await prisma.user.findFirst();
    if (u) {
      await prisma.notification.create({
        data: {
          userId: u.userId,
          title: "AI Redistribution Executed",
          description: `Action initiated for ${warehouseName}: ${action}`,
          type: "success",
          severity: "high"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute AI action" }, { status: 500 });
  }
}

// PATCH update warehouse
export async function PATCH(req: Request) {
  try {
    const { warehouseId, ...data } = await req.json();
    const warehouse = await prisma.warehouse.update({ where: { warehouseId }, data });
    return NextResponse.json({ success: true, warehouse });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update warehouse" }, { status: 500 });
  }
}
