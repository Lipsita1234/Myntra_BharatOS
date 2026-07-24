import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContentWithGemini } from "@/lib/ai";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service unavailable. Please configure GEMINI_API_KEY." }, { status: 503 });
    }

    // 1. Fetch live system stats from DB
    const [warehouses, sustainability, clusters, vehicles] = await Promise.all([
      prisma.warehouse.findMany({ select: { name: true, city: true, capacity: true, inventory: true, utilization: true } }),
      prisma.sustainability.findFirst({ orderBy: { createdAt: "desc" } }),
      prisma.cluster.findMany({ select: { name: true, city: true, savings: true, members: true } }),
      prisma.vehicle.findMany({ select: { vehicleType: true, status: true, fuel: true } }),
    ]);

    const systemTelemetry = {
      warehouses: warehouses.map(w => ({ name: w.name, city: w.city, utilization: Math.round(w.utilization) })),
      sustainability: sustainability || { co2Reduced: 120, moneySaved: 5400, fuelSaved: 38 },
      totalClusters: clusters.length,
      clusterSavings: clusters.reduce((acc, c) => acc + c.savings, 0),
      fleetSize: vehicles.length,
      idleVehicles: vehicles.filter(v => v.status === "idle" || v.status === "IDLE").length,
    };

    // 2. Ask Gemini to generate insights from live telemetry
    const prompt = `
You are the AI analytics engine for Myntra BharatOS.
Based on the following live logistics network telemetry snapshot, generate exactly 5 realistic AI insights and exactly 3 predictive alerts.

Telemetry Snapshot:
${JSON.stringify(systemTelemetry, null, 2)}

Rules:
- Insights must directly reference specific warehouse names/cities, sustainability figures, cluster numbers, and vehicle stats from the telemetry above.
- Do NOT fabricate data outside of what is given.
- Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble, no code fences.

The JSON must match this exact structure:
{
  "insights": [
    {
      "id": 1,
      "type": "success",
      "category": "Cost Savings",
      "text": "...",
      "timestamp": "Just now",
      "impact": "..."
    }
  ],
  "alerts": [
    {
      "id": 1,
      "type": "capacity",
      "title": "...",
      "prob": 90,
      "impactTime": "2 days",
      "description": "...",
      "recommendation": "..."
    }
  ]
}

Valid values for insight type: "success", "warning", "info", "trend"
Valid values for alert type: "capacity", "weather", "spike"
`;

    try {
      const result = await generateContentWithGemini(prompt);
      const rawText = result.response.text();
    console.log("[AI Insights API] Raw response (first 500 chars):", rawText.substring(0, 500));

    // Robust JSON extraction — handles markdown fences and preamble text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[AI Insights API] No JSON object found in response:", rawText);
      return NextResponse.json({ error: "AI returned an unreadable response." }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);

    if (!data.insights || !data.alerts) {
      return NextResponse.json({ error: "AI response missing required fields." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      insights: data.insights,
      alerts: data.alerts.map((al: any) => ({ ...al, actionTaken: false }))
    });

  } catch (error: any) {
    console.error("[AI Insights API] Error:", error.message);
    return NextResponse.json({ error: "Failed to generate dynamic AI insights." }, { status: 500 });
  }
}
