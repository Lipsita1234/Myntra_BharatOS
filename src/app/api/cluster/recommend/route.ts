import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    recommendations: [
      { id: "REC-1", title: "Merge Odisha Central clusters", savings: "₹18,000/week", confidence: 92 },
      { id: "REC-2", title: "Scale temporary drivers in Patna", savings: "Reduce delays by 14h", confidence: 88 }
    ]
  });
}
