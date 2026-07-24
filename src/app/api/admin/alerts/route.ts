import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const alert = await prisma.alert.create({ data: body });
    return NextResponse.json({ success: true, alert });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, resolved } = await req.json();
    const alert = await prisma.alert.update({ where: { id }, data: { resolved } });
    return NextResponse.json({ success: true, alert });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}
