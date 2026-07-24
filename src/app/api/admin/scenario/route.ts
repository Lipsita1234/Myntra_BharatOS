import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { scenarioId } = await req.json();
    
    // Simulate high-fidelity macro scenarios (e.g. Ranchi warehouse, Diwali demand)
    const outputs: Record<string, any> = {
      ranchi: { time: "2.9 days", cost: "₹61/order", coverage: "81%", carbon: "13.4 T/day", revenue: "₹9.1 Cr/month" },
      fuel: { time: "2.6 days", cost: "₹68/order", coverage: "72%", carbon: "20.1 T/day", revenue: "₹7.6 Cr/month" },
      diwali: { time: "1.9 days", cost: "₹44/order", coverage: "76%", carbon: "23.8 T/day", revenue: "₹13.8 Cr/month" },
      mumbai: { time: "4.1 days", cost: "₹89/order", coverage: "61%", carbon: "22.4 T/day", revenue: "₹6.8 Cr/month" }
    };

    const selected = outputs[scenarioId] || outputs.ranchi;
    return NextResponse.json({
      success: true,
      scenario: scenarioId,
      impact: selected
    });
  } catch (error) {
    return NextResponse.json({ error: "Scenario planner parameters incorrect" }, { status: 400 });
  }
}
