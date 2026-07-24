import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    
    const routes = vehicles.map(v => {
      let lat = v.lat ?? 12.9716;
      let lng = v.lng ?? 77.5946;
      
      // Parse or generate route points array
      let points = [];
      try {
        points = JSON.parse(v.route || "[]");
      } catch (e) {}

      if (points.length === 0) {
        points = [
          { lat, lng },
          { lat: lat + 0.015, lng: lng - 0.01 },
          { lat: lat + 0.03, lng: lng + 0.015 }
        ];
      }

      return {
        driverId: v.vehicleId,
        driverName: v.driver,
        vehicle: v.vehicleType,
        routePoints: points
      };
    });

    return NextResponse.json({
      success: true,
      activeRoutesCount: vehicles.filter(v => v.status === "active").length,
      routes
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch routes data" }, { status: 500 });
  }
}
