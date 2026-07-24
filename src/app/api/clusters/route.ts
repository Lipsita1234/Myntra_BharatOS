import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


// GET all clusters
export async function GET() {
  try {
    const clusters = await prisma.cluster.findMany({
      include: { orders: { select: { orderId: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, clusters });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clusters" }, { status: 500 });
  }
}

// POST create new cluster
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cluster = await prisma.cluster.create({ data: body });
    return NextResponse.json({ success: true, cluster });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create cluster" }, { status: 500 });
  }
}
