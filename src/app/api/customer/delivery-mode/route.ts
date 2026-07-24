import { NextResponse } from "next/server";
import { dbMock } from "@/lib/db-mock";

export async function POST(req: Request) {
  try {
    const { userId, mode } = await req.json();
    if (!userId || !mode) {
      return NextResponse.json({ error: "userId and mode are required" }, { status: 400 });
    }
    dbMock.setDeliveryMode(userId, mode);
    return NextResponse.json({ success: true, message: `Delivery mode updated to ${mode}` });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
