import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET all vehicles / fleet
export async function GET() {
  try {
    // We use queryRaw to bypass Prisma client generation issues on Windows
    // ensuring we fetch the newly added columns (city, packages, eta)
    const vehicles: any[] = await prisma.$queryRaw`SELECT * FROM Vehicle`;
    
    const stats = {
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === "active").length,
      idle: vehicles.filter((v) => v.status === "idle").length,
      offline: vehicles.filter((v) => v.status === "offline").length,
      avgFuel: vehicles.length > 0
        ? Math.round(vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length)
        : 0,
      totalDeliveries: vehicles.reduce((sum, v) => sum + v.deliveries, 0),
    };
    return NextResponse.json({ success: true, vehicles, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fleet" }, { status: 500 });
  }
}

// PATCH update vehicle status/location
export async function PATCH(req: Request) {
  try {
    const { vehicleId, ...data } = await req.json();
    const vehicle = await prisma.vehicle.update({ where: { vehicleId }, data });
    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

// POST dispatch track live ping
export async function POST(req: Request) {
  try {
    const { vehicleId, driver } = await req.json();
    
    const u = await prisma.user.findFirst();
    if (u) {
      await prisma.notification.create({
        data: {
          userId: u.userId,
          title: "Live Tracking Initiated",
          description: `Secure telemetry link established with ${driver} (${vehicleId}).`,
          type: "info",
          severity: "low"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to dispatch ping" }, { status: 500 });
  }
}
