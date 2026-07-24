import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);  
  const dLon = (lon2 - lon1) * (Math.PI / 180); 
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city");

    // If no city provided, return list of available cities
    if (!city) {
      const warehouses = await prisma.warehouse.findMany({
        select: { city: true },
        distinct: ['city']
      });
      const cities = warehouses.map(w => w.city).filter(c => c !== "");
      return NextResponse.json({ success: true, cities });
    }

    // 1. Fetch Warehouse for the city
    const warehouse = await prisma.warehouse.findFirst({
      where: { city }
    });

    if (!warehouse || !warehouse.lat || !warehouse.lng) {
      return NextResponse.json({ error: "Warehouse missing or invalid coordinates" }, { status: 404 });
    }

    // 2. Fetch MicroHub for the city
    const hub = await prisma.microHub.findFirst({
      where: { city }
    });

    // 3. Fetch Clusters for the city (limit to 5 for the route map)
    const clusters = await prisma.cluster.findMany({
      where: { city, status: { in: ['forming', 'ready'] } },
      take: 4
    });

    if (clusters.length === 0) {
       return NextResponse.json({ error: "No active clusters to route in this city" }, { status: 404 });
    }

    const wPoint = { name: "Warehouse", lat: warehouse.lat, lng: warehouse.lng, type: "warehouse", id: warehouse.warehouseId };
    const hPoint = hub && hub.lat && hub.lng ? { name: "Micro Hub", lat: hub.lat, lng: hub.lng, type: "hub", id: hub.hubId } : null;
    
    const cPoints = clusters.filter(c => c.lat && c.lng).map((c, i) => ({
      name: `Cluster ${i+1}`, lat: c.lat!, lng: c.lng!, type: "cluster", id: c.clusterId
    }));

    // Calculate Traditional Route (Star topology: W -> C -> W -> C -> W)
    let traditionalDistance = 0;
    const traditionalRoute = [];
    
    for (const cp of cPoints) {
      traditionalRoute.push(wPoint);
      traditionalRoute.push(cp);
      const d = getDistance(wPoint.lat, wPoint.lng, cp.lat, cp.lng);
      traditionalDistance += (d * 2); // Out and back
    }
    traditionalRoute.push(wPoint);

    // Calculate AI Optimized Route (TSP Nearest Neighbor starting from W, ending at Hub or W)
    let optimizedDistance = 0;
    const optimizedRoute = [wPoint];
    let current = wPoint;
    const unvisited = [...cPoints];

    while(unvisited.length > 0) {
      // Find nearest
      let nearestIdx = 0;
      let minD = Infinity;
      for(let i=0; i<unvisited.length; i++) {
        const d = getDistance(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }
      optimizedDistance += minD;
      current = unvisited[nearestIdx];
      optimizedRoute.push(current);
      unvisited.splice(nearestIdx, 1);
    }

    // Return to Hub (if exists) then Warehouse, or just Warehouse
    if (hPoint) {
      const d1 = getDistance(current.lat, current.lng, hPoint.lat, hPoint.lng);
      optimizedDistance += d1;
      optimizedRoute.push(hPoint);
      const d2 = getDistance(hPoint.lat, hPoint.lng, wPoint.lat, wPoint.lng);
      optimizedDistance += d2;
    } else {
      const d = getDistance(current.lat, current.lng, wPoint.lat, wPoint.lng);
      optimizedDistance += d;
    }
    optimizedRoute.push(wPoint);

    // Calculate realistic metrics
    // Assumptions:
    // Fuel: 10 km / L for traditional (trucks), maybe 12 km/L for optimized (smaller EVs from hub)
    // Time: 35 km/h average city speed
    // Cost: ₹20 / km for trucks
    // CO2: 0.26 kg / km
    const tFuel = traditionalDistance / 10;
    const tTime = traditionalDistance / 35; // hours
    const tCost = traditionalDistance * 20;
    const tCo2 = traditionalDistance * 0.26;
    const tVehicles = cPoints.length; // One per run

    const oFuel = optimizedDistance / 12;
    const oTime = optimizedDistance / 35;
    const oCost = optimizedDistance * 15; // slightly cheaper fleet mix
    const oCo2 = optimizedDistance * 0.20;
    const oVehicles = Math.ceil(cPoints.length / 3); // Consolidated

    const formatTime = (h: number) => {
      const hrs = Math.floor(h);
      const mins = Math.round((h - hrs) * 60);
      return `${hrs}h ${mins}m`;
    };

    return NextResponse.json({
      success: true,
      city,
      clusterIds: cPoints.map(c => c.id),
      traditional: {
        route: traditionalRoute,
        distance: Math.round(traditionalDistance),
        fuel: Number(tFuel.toFixed(1)),
        time: formatTime(tTime),
        cost: Math.round(tCost),
        co2: Number(tCo2.toFixed(1)),
        vehicles: tVehicles
      },
      optimized: {
        route: optimizedRoute,
        distance: Math.round(optimizedDistance),
        fuel: Number(oFuel.toFixed(1)),
        time: formatTime(oTime),
        cost: Math.round(oCost),
        co2: Number(oCo2.toFixed(1)),
        vehicles: oVehicles
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to optimize route" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { clusterIds } = await req.json();
    if (!clusterIds || !Array.isArray(clusterIds)) {
      return NextResponse.json({ error: "Invalid cluster IDs" }, { status: 400 });
    }

    // Dispatch these clusters
    await prisma.cluster.updateMany({
      where: { clusterId: { in: clusterIds } },
      data: { status: 'completed' }
    });

    // Create notification
    const u = await prisma.user.findFirst();
    if (u) {
      await prisma.notification.create({
        data: {
          userId: u.userId,
          title: "AI Route Dispatched",
          description: `Dispatched ${clusterIds.length} clusters using optimized VRP loop.`,
          type: "success",
          severity: "high"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { city } = await req.json();
    if (!city) {
      return NextResponse.json({ error: "City required" }, { status: 400 });
    }

    // Reset clusters in this city to 'forming' for the demo
    await prisma.cluster.updateMany({
      where: { city },
      data: { status: 'forming' }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
