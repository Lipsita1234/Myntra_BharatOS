import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // In a real app, this would use the user's session and current cart.
    // Here we dynamically calculate based on the current active clusters to simulate real-time conditions.
    const activeCluster = await prisma.cluster.findFirst({
      where: { status: "active" },
      orderBy: { members: "desc" }
    });

    const formingCluster = await prisma.cluster.findFirst({
      where: { status: "forming" },
      orderBy: { members: "desc" }
    });

    const targetCluster = formingCluster || activeCluster;
    
    // Dynamic factors
    const baseShipping = 99;
    const expressMultiplier = 2.5; // Surge pricing based on time of day could go here
    const currentHour = new Date().getHours();
    const trafficSurge = (currentHour > 16 && currentHour < 20) ? 30 : 0; // Rush hour surge
    
    const standardCost = baseShipping + trafficSurge;
    const expressCost = Math.round((baseShipping * expressMultiplier) + (trafficSurge * 2));
    
    // Carbon calculations (dynamic based on distance/members)
    // A standard delivery is ~1.2kg CO2. Clustering divides this.
    const clusterMembers = targetCluster ? Math.max(targetCluster.members, 3) : 5;
    const communityCarbonSaved = (1.2 * (1 - (1 / clusterMembers))).toFixed(2);
    const expressCarbonPenalty = 0.5; // extra CO2 for dedicated dispatch

    return NextResponse.json({
      success: true,
      estimates: {
        normal: {
          cost: `₹${standardCost}`,
          carbonSaved: "0 kg",
          routeMode: "Standard Hub-and-Spoke",
          time: "24 - 48 Hours"
        },
        community: {
          cost: "FREE",
          savings: `₹${standardCost}`,
          carbonSaved: `${communityCarbonSaved} kg CO₂ (${Math.round((1 - (1 / clusterMembers)) * 100)}%)`,
          routeMode: "Clustered EV",
          time: "2 - 4 Hours"
        },
        express: {
          cost: `₹${expressCost}`,
          carbonSaved: `-${expressCarbonPenalty} kg (Penalty)`,
          routeMode: "Direct Route",
          time: "1 Hour"
        }
      }
    });

  } catch (error) {
    console.error("Delivery estimate error:", error);
    return NextResponse.json({ error: "Failed to calculate dynamic estimate" }, { status: 500 });
  }
}
