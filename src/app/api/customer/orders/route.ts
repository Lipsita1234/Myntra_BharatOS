import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

// GET all orders for the logged-in customer
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  const customerId = payload?.userId || "USR-CUST";

  const orders = await prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, orders });
}

// POST create a new order
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    const customerId = payload?.userId || "USR-CUST";

    const body = await req.json();
    const { productName, productId, sellerId, amount, deliveryMode, location, lat, lng } = body;

    const shippingCost = deliveryMode === "community" ? 0 : deliveryMode === "express" ? 199 : 99;

    // Auto-assign to an active cluster if community delivery
    let clusterId: string | undefined;
    if (deliveryMode === "community") {
      const openCluster = await prisma.cluster.findFirst({
        where: { status: { in: ["forming", "active"] }, city: { contains: location || "" } },
      });
      if (openCluster) {
        clusterId = openCluster.clusterId;
        await prisma.cluster.update({
          where: { clusterId: openCluster.clusterId },
          data: { members: { increment: 1 } },
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        sellerId: sellerId || "USR-SELLER",
        productName: productName || "Product",
        productId,
        amount: amount || 0,
        shippingCost,
        deliveryMode,
        location: location || "",
        lat,
        lng,
        status: "pending",
        clusterId,
      },
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: customerId,
        type: "info",
        severity: "low",
        title: "Order Placed Successfully",
        description: `Your order for "${productName}" has been placed. ${
          deliveryMode === "community"
            ? "It has been assigned to a community cluster."
            : "It will be delivered directly."
        }`,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
