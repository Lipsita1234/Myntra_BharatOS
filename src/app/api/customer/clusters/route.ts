import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { userId: payload.userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Extract city from address (e.g. '123 Main St, Bangalore')
    let userCity = "Bangalore";
    if (user.address && user.address.includes(",")) {
      const parts = user.address.split(",");
      userCity = parts[parts.length - 1].trim();
    }

    // Find active cluster in user's city
    const cityClusters = await prisma.cluster.findMany({
      where: { city: userCity, status: "forming" },
      orderBy: { createdAt: "desc" }
    });

    let localCluster = cityClusters.find(c => c.current_volume_m3 < c.fleet_max_volume_m3 * 0.90 && c.status === "forming");

    if (!localCluster) {
      // If all local clusters are full based on volume, spawn a new one dynamically
      localCluster = await prisma.cluster.create({
        data: {
          name: `${userCity}-Cluster-${Math.floor(Math.random() * 1000)}`,
          city: userCity,
          location: "13.0,77.5", // Default approximation
          members: 0,
          maxMembers: 14,
          status: "forming",
          savings: 0,
          eta: "4 days",
          fleet_max_volume_m3: 1.20,
          current_volume_m3: 0
        }
      });
    }

    // Enhance the returned payload with frontend volumetric properties
    const capacity_percentage = Math.round((localCluster.current_volume_m3 / localCluster.fleet_max_volume_m3) * 100);
    const estimated_apparel_spots_left = Math.max(0, Math.floor((localCluster.fleet_max_volume_m3 - localCluster.current_volume_m3) / 0.05));
    const statusLabel = capacity_percentage >= 90 ? "Locked" : "Optimum Spatial Density";

    const enhancedCluster = {
      ...localCluster,
      fleet_type: "Electric 3-Wheeler",
      capacity_percentage,
      estimated_apparel_spots_left,
      displayStatus: statusLabel
    };

    return NextResponse.json({
      success: true,
      clusters: [enhancedCluster]
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer clusters" }, { status: 500 });
  }
}
