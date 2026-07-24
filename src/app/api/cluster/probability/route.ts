import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    model: "Uber H3 Spatial Clustering Indices",
    probabilities: [
      { clusterId: "CL-BBS-203", probabilityPercent: 94.2, status: "stable" },
      { clusterId: "CL-BLR-109", probabilityPercent: 88.7, status: "forming" },
      { clusterId: "CL-MUM-402", probabilityPercent: 91.5, status: "dispatching" }
    ]
  });
}
