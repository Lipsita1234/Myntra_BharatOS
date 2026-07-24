import { NextResponse } from "next/server";
import { predictClusterViability } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { region = "Koramangala Sector 4", category = "Apparel", date = new Date().toISOString() } = body;

    // Simulate location mapping
    const location = { name: region, lat: 12.9352, lng: 77.6244 };

    // Query Gemini model
    const prediction = await predictClusterViability(location, category, date);

    return NextResponse.json({
      success: true,
      prediction: {
        probabilityPercent: prediction.probabilityPercent || 85,
        estimatedTimeMinutes: prediction.estimatedTimeMinutes || 45,
        expectedMembersCount: prediction.expectedMembersCount || 8,
        sustainabilityOffsetKgCO2: prediction.sustainabilityOffsetKgCO2 || 1.2
      }
    });
  } catch (error: any) {
    console.error("Cluster prediction API error:", error);
    // Return a safe fallback if Gemini fails or is unconfigured
    return NextResponse.json({
      success: true,
      prediction: {
        probabilityPercent: 78,
        estimatedTimeMinutes: 50,
        expectedMembersCount: 6,
        sustainabilityOffsetKgCO2: 0.95,
        fallback: true
      }
    });
  }
}
