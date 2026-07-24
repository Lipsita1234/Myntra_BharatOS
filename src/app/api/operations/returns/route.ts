import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const returns: any[] = await prisma.$queryRaw`SELECT * FROM \`Order\` WHERE status = 'returned' ORDER BY updatedAt DESC`;

    const totalReturns = returns.length;
    const returnValue = returns.reduce((sum, o) => sum + o.amount, 0);
    const byMode = {
      direct: returns.filter((o) => o.deliveryMode === "direct").length,
      community: returns.filter((o) => o.deliveryMode === "community").length,
      express: returns.filter((o) => o.deliveryMode === "express").length,
    };

    return NextResponse.json({ success: true, returns, stats: { totalReturns, returnValue, byMode } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { orderIds } = await req.json();
    
    // Update statuses to dispatched
    for (const id of orderIds) {
      await prisma.order.update({
        where: { orderId: id },
        data: { status: 'return_dispatched' }
      });
    }

    const u = await prisma.user.findFirst();
    if (u) {
      await prisma.notification.create({
        data: {
          userId: u.userId,
          title: "Return Route Dispatched",
          description: `Consolidated reverse-logistics pickup dispatched for ${orderIds.length} orders.`,
          type: "success",
          severity: "medium"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to dispatch returns" }, { status: 500 });
  }
}
