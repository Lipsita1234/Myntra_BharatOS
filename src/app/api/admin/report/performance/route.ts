import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("count") === "true";

  const rows = await prisma.vehicle.findMany({
    orderBy: { deliveries: "desc" },
  });

  if (countOnly) return NextResponse.json({ count: rows.length });
  return NextResponse.json({ rows });
}
