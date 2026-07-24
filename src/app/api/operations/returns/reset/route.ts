import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await prisma.order.updateMany({
      where: { status: 'return_dispatched' },
      data: { status: 'returned' }
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Failed to reset returns" }, { status: 500 });
  }
}
