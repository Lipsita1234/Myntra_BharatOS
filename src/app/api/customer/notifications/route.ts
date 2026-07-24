import { NextResponse } from "next/server";
import { dbMock } from "@/lib/db-mock";

const defaultNotifs = [
  { id: "NTF-1", title: "Neighbourhood Cluster Complete", description: "Cluster BBS-203 has filled. You saved ₹135.", timestamp: new Date().toISOString(), type: "success" },
  { id: "NTF-2", title: "Consolidated Dispatch Scheduled", description: "Your package is batched for delivery tomorrow at 3 PM.", timestamp: new Date().toISOString(), type: "info" }
];

export async function GET() {
  const custom = dbMock.getNotifications();
  return NextResponse.json({
    success: true,
    notifications: [...custom, ...defaultNotifs]
  });
}

export async function POST(req: Request) {
  try {
    const { title, description, type } = await req.json();
    const newNotif = {
      id: `NTF-${Date.now()}`,
      title,
      description,
      type: type || "info",
      timestamp: new Date().toISOString()
    };
    dbMock.addNotification(newNotif);
    return NextResponse.json({ success: true, notification: newNotif });
  } catch (error) {
    return NextResponse.json({ error: "Invalid notification" }, { status: 400 });
  }
}
