import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { scenarioId } = await req.json();
    return NextResponse.json({
      success: true,
      simulationState: "completed",
      scenario: scenarioId || "festival-surge",
      steps: [
        { seq: 1, action: "Dispatched EV Fleet", etaDiffMinutes: -12 },
        { seq: 2, action: "Consolidated Patna West cluster", etaDiffMinutes: -34 },
        { seq: 3, action: "Rerouted NH-16 block via state road", etaDiffMinutes: 10 }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Simulation initialization failed" }, { status: 400 });
  }
}
