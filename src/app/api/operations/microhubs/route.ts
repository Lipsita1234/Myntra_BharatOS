import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const microHubs: any[] = await prisma.$queryRaw`SELECT * FROM MicroHub`;
    return NextResponse.json({ success: true, microHubs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch micro hubs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { hubId, hubName } = await req.json();
    
    // Update hub status
    await prisma.microHub.update({
      where: { hubId },
      data: { status: 'dispatched' }
    });

    const u = await prisma.user.findFirst();
    if (u) {
      await prisma.notification.create({
        data: {
          userId: u.userId,
          title: "Micro Hub Dispatched",
          description: `Consolidation batch dispatched to ${hubName}.`,
          type: "success",
          severity: "high"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to dispatch micro hub" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { hubId, ...data } = await req.json();
    const hub = await prisma.microHub.update({ where: { hubId }, data });
    return NextResponse.json({ success: true, hub });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update micro hub" }, { status: 500 });
  }
}
