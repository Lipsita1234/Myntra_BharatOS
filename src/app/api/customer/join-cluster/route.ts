import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clusterId, cart_volume_m3, is_oversized: frontend_oversized } = await req.json();

    if (!clusterId) {
      return NextResponse.json({ error: "Missing clusterId" }, { status: 400 });
    }

    const cluster = await prisma.cluster.findUnique({
      where: { clusterId }
    });

    if (!cluster) {
      return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
    }

    // 1. Oversized Pre-Filter Check 
    const is_oversized = frontend_oversized || false;
    let bypassed_heavy_orders = [];
    
    if (is_oversized) {
      bypassed_heavy_orders.push(`heavy_freight_order_${Math.floor(Math.random() * 10000)}`);
      // Automatically routed via Heavy Freight, bypass EV pool
      return NextResponse.json({
        success: true,
        routed_via_heavy_freight: true,
        bypassed_heavy_orders,
        cluster: {
          ...cluster,
          capacity_percentage: Math.round((cluster.current_volume_m3 / cluster.fleet_max_volume_m3) * 100),
          status: "Optimum Spatial Density"
        }
      });
    }

    // 2. KNN Spatial Validation (Simulated Haversine Distance)
    const distanceKm = Math.random() * 1.5; // Simulate distance within the 1.8km radius
    const spatial_radius_km = cluster.spatial_radius_km || 1.8;

    if (distanceKm > spatial_radius_km) {
      return NextResponse.json({ error: `Order falls outside KNN spatial radius (${distanceKm.toFixed(2)}km > ${spatial_radius_km}km)` }, { status: 400 });
    }

    // 3. Volumetric Bin-Packing Constraint
    const addedVolume = cart_volume_m3 || (0.04 + (Math.random() * 0.02)); // use exact cart volume or fallback
    const newVolume = parseFloat((cluster.current_volume_m3 + addedVolume).toFixed(4));
    
    if (newVolume > cluster.fleet_max_volume_m3) {
      return NextResponse.json({ error: "Item volume exceeds remaining fleet capacity" }, { status: 400 });
    }

    const newMembers = cluster.members + 1;
    const capacityPct = (newVolume / cluster.fleet_max_volume_m3) * 100;
    const isLocked = capacityPct >= 90;
    const newStatus = isLocked ? "active" : "forming";

    const updatedCluster = await prisma.cluster.update({
      where: { clusterId },
      data: {
        members: newMembers,
        current_volume_m3: newVolume,
        status: newStatus,
        completionProbability: isLocked ? 100 : Math.min(99, capacityPct)
      }
    });

    const enhancedCluster = {
      ...updatedCluster,
      capacity_percentage: Math.round(capacityPct),
      displayStatus: isLocked ? "Locked" : "Optimum Spatial Density",
    };

    return NextResponse.json({
      success: true,
      cluster: enhancedCluster,
      bypassed_heavy_orders,
      knn_distance_km: distanceKm.toFixed(2)
    });
  } catch (error) {
    console.error("Join cluster error:", error);
    return NextResponse.json({ error: "Failed to join cluster" }, { status: 500 });
  }
}
