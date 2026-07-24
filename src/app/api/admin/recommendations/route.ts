import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { model } from "@/lib/ai";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service unavailable." }, { status: 503 });
    }

    // Fetch live telemetry
    const [warehouses, microHubs, clusters, demandForecasts] = await Promise.all([
      prisma.warehouse.findMany({
        select: { name: true, city: true, capacity: true, inventory: true, utilization: true },
      }),
      prisma.microHub.findMany({
        select: { name: true, city: true, orders: true, capacity: true, status: true },
      }),
      prisma.cluster.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        select: { clusterId: true, name: true, city: true, members: true, maxMembers: true, savings: true, status: true, completionProbability: true },
      }),
      prisma.demandForecast.findMany({
        take: 10,
        orderBy: { confidence: "desc" },
        select: { region: true, product: true, change: true, factor: true, predictedDemand: true, currentDemand: true, confidence: true },
      }),
    ]);

    const telemetry = {
      warehouses: warehouses.map(w => ({
        name: w.name, city: w.city,
        utilization: Math.round(w.utilization),
        inventory: w.inventory, capacity: w.capacity
      })),
      overloadedWarehouses: warehouses.filter(w => w.utilization > 80).map(w => ({ name: w.name, city: w.city, utilization: Math.round(w.utilization) })),
      microHubs: microHubs.map(h => ({ name: h.name, city: h.city, orders: h.orders, capacity: h.capacity, status: h.status })),
      lowFillClusters: clusters.filter(c => c.maxMembers > 0 && (c.members / c.maxMembers) < 0.7).map(c => ({
        id: c.clusterId.slice(0, 8), name: c.name, city: c.city,
        fillRate: Math.round((c.members / c.maxMembers) * 100),
        savings: c.savings
      })),
      highDemandForecasts: demandForecasts.filter(d => d.change > 15).map(d => ({
        region: d.region, product: d.product, changePercent: Math.round(d.change),
        factor: d.factor, confidence: Math.round(d.confidence)
      })),
    };

    const prompt = `
You are a strategic AI logistics advisor for Myntra BharatOS.
Based on the following live network telemetry, generate exactly 3 actionable recommendations.

Live Telemetry:
${JSON.stringify(telemetry, null, 2)}

Guidelines:
- Each recommendation must be directly driven by the data (mention specific warehouse names, cities, cluster IDs, demand regions).
- Focus on: overloaded warehouses → inventory rebalancing, low-fill clusters → cluster merging, high demand zones → micro hub or stock pre-positioning.
- If no overloaded warehouses exist, suggest optimizations based on what IS in the data.
- Be specific with numbers (percentages, estimated savings, units).
- Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences.

JSON structure (array of 3 objects):
[
  {
    "id": 1,
    "type": "microhub" | "inventory" | "cluster",
    "title": "Short action title",
    "reason": "Data-driven reasoning citing specific names and numbers",
    "savings": "Estimated savings string e.g. ₹4 Lakhs / month",
    "metric": "One key efficiency metric e.g. Fill Rate: +22%",
    "details": "One sentence implementation plan"
  }
]
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    console.log("[Recommendations API] Gemini raw:", rawText.substring(0, 400));

    // Extract JSON array from response
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned unreadable response." }, { status: 500 });
    }

    const recs = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, recommendations: recs });

  } catch (error: any) {
    console.error("[Recommendations API] Error:", error.message);
    return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
  }
}
