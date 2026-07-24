import { NextResponse } from "next/server";
import { dbMock } from "@/lib/db-mock";

export async function POST(req: Request) {
  try {
    const { customerId, product, location, amount } = await req.json();

    if (!customerId || !product || !location || !amount) {
      return NextResponse.json({ error: "Missing required order parameters" }, { status: 400 });
    }

    const orderId = `ORD-${Date.now().toString()}`;
    const newOrder = {
      id: orderId,
      customer: customerId,
      product,
      status: "pending",
      amount,
      date: new Date().toISOString().split("T")[0],
      location,
      clusterId: "CL-BBS-203" // AI clustering automatically clusters into Bhubaneswar #203
    };

    // Store in mock database
    dbMock.addOrder(newOrder);

    // Generate AI notification
    dbMock.addNotification({
      id: `NTF-${Date.now()}`,
      title: "Order Clustered Successfully",
      description: `Your order of ${product} has been clustered with 8 other orders in ${location}. Savings: ₹135.`,
      timestamp: new Date().toISOString(),
      type: "success"
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      savingsUnlocked: 135,
      notification: "AI Clustering consolidated your shipping. You saved ₹135!"
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
}
