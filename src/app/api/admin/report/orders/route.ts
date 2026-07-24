import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("count") === "true";

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { orderId: true, productName: true, status: true, amount: true, location: true, createdAt: true },
  });

  if (countOnly) return NextResponse.json({ count: orders.length });
  return NextResponse.json({ rows: orders });
}
