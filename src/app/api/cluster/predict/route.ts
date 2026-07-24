import { NextResponse } from "next/server";
import { predictClusterViability } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { runDBSCAN, Point } from "@/lib/algorithms/dbscan";

export async function POST(req: Request) {
  try {
    const { epsKm = 2.0, minPts = 3 } = await req.json().catch(() => ({}));

    // 1. Fetch unassigned orders that have lat/lng
    const unassignedOrders = await prisma.order.findMany({
      where: { clusterId: null, lat: { not: null }, lng: { not: null } }
    });

    if (unassignedOrders.length === 0) {
      return NextResponse.json({ success: true, message: "No unassigned orders to cluster." });
    }

    // 2. Map to Point interface for DBSCAN
    const points: Point[] = unassignedOrders.map(o => ({
      id: o.orderId,
      lat: o.lat!,
      lng: o.lng!,
      category: o.productName,
      volume: o.calculated_volume_m3
    }));

    // 3. Run Deterministic DBSCAN Algorithm with Volume Capacity (1.20 m³)
    const calculatedClusters = runDBSCAN(points, epsKm, minPts, 1.20);

    // 4. Store the results in the Database
    const savedClusters = [];
    for (const cluster of calculatedClusters) {
      const newCluster = await prisma.cluster.create({
        data: {
          name: `DBSCAN-Cluster-${cluster.id.slice(-4)}`,
          location: `${cluster.centroid.lat.toFixed(3)}, ${cluster.centroid.lng.toFixed(3)}`,
          lat: cluster.centroid.lat,
          lng: cluster.centroid.lng,
          members: cluster.points.length,
          status: "forming",
          completionProbability: 95.0
        }
      });
      
      // Assign orders to this new cluster
      await prisma.order.updateMany({
        where: { orderId: { in: cluster.points.map(p => p.id) } },
        data: { clusterId: newCluster.clusterId }
      });
      savedClusters.push(newCluster);
    }

    // 5. Ask Gemini to EXPLAIN the algorithmic output
    // Assuming location, category, date are passed for the UI's specific coordinate test
    const { location, category, date } = await req.json().catch(() => ({ location: null, category: "", date: "" }));
    let explanation = null;
    if (location) {
        explanation = await predictClusterViability(location, category, date);
    }

    return NextResponse.json({
      success: true,
      algorithm: "Native TypeScript DBSCAN (Haversine)",
      clustersFound: savedClusters.length,
      explanation
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid cluster request" }, { status: 400 });
  }
}
