import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optimizeRoutes, Node } from "@/lib/algorithms/vrp";

export async function POST(req: Request) {
  try {
    const { routeId, constraintType } = await req.json().catch(() => ({}));
    
    // 1. Fetch Depot (First Warehouse for simplicity)
    const warehouse = await prisma.warehouse.findFirst({
      where: { lat: { not: null }, lng: { not: null } }
    });
    if (!warehouse) throw new Error("No warehouse depot found with coordinates.");

    // 2. Fetch Active Clusters (delivery points)
    const clusters = await prisma.cluster.findMany({
      where: { lat: { not: null }, lng: { not: null }, status: "forming" }
    });

    // 3. Fetch Available Vehicles
    const vehiclesData = await prisma.vehicle.findMany({
      where: { status: "idle" }
    });

    const depot: Node = { id: warehouse.warehouseId, lat: warehouse.lat!, lng: warehouse.lng! };
    const points: Node[] = clusters.map(c => ({
      id: c.clusterId,
      lat: c.lat!,
      lng: c.lng!,
      demand: c.members, // Number of orders is demand
      volume: c.current_volume_m3 // Map volume from DB
    }));

    // Assume fixed capacity for VRP for now based on vehicle type
    const vehicles = vehiclesData.map(v => ({
      id: v.vehicleId,
      capacity: v.vehicleType.toLowerCase() === "truck" ? 50 : 15,
      maxVolume: v.vehicleType.toLowerCase() === "truck" ? 15.0 : 1.2
    }));

    // 4. Run native VRP algorithm
    const optimizedRoutes = optimizeRoutes(depot, points, vehicles);

    // Calculate metrics
    const totalOptimizedDistance = optimizedRoutes.reduce((sum, r) => sum + r.totalDistance, 0);
    // Baseline is simplistic point-to-point without routing
    const distanceKmBaseline = points.length * 20; // Simulated baseline for comparison
    const savingsPercent = distanceKmBaseline > 0 ? ((distanceKmBaseline - totalOptimizedDistance) / distanceKmBaseline) * 100 : 0;

    return NextResponse.json({
      success: true,
      algorithm: "Native TypeScript VRP (Nearest Neighbor)",
      routesAssigned: optimizedRoutes.length,
      metrics: {
        distanceKmBaseline: Math.round(distanceKmBaseline),
        distanceKmOptimized: Math.round(totalOptimizedDistance),
        savingsPercent: Math.max(0, Math.round(savingsPercent * 10) / 10),
        costSavingsRupees: Math.max(0, Math.round((distanceKmBaseline - totalOptimizedDistance) * 15)), // 15 Rs per km saved
        fuelSavingsLitres: Math.max(0, Math.round(((distanceKmBaseline - totalOptimizedDistance) / 12) * 10) / 10) // 12 kmpl
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Optimization request failed" }, { status: 400 });
  }
}
