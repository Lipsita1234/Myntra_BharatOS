import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    availableReports: [
      { id: "daily", title: "Daily Logistics Report", size: "2.4 MB" },
      { id: "weekly", title: "Weekly Performance Report", size: "8.1 MB" },
      { id: "sustainability", title: "Monthly Sustainability Report", size: "4.7 MB" }
    ]
  });
}
