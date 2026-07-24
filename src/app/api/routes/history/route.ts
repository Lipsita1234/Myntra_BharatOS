import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    historicalStats: [
      { date: "2024-01-10", totalDistanceSavedKm: 850, fuelOffsetLitres: 56, complianceRate: 98.2 },
      { date: "2024-01-11", totalDistanceSavedKm: 920, fuelOffsetLitres: 61, complianceRate: 97.4 },
      { date: "2024-01-12", totalDistanceSavedKm: 780, fuelOffsetLitres: 52, complianceRate: 98.9 }
    ]
  });
}
