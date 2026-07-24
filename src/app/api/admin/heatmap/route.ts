import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const forecasts = await prisma.demandForecast.findMany({
      take: 100
    });
    const warehouses = await prisma.warehouse.findMany();

    const stateNames = [
      "Maharashtra", "Karnataka", "Odisha", "Bihar", 
      "Rajasthan", "Uttar Pradesh", "West Bengal", "Tamil Nadu",
      "Gujarat", "Andhra Pradesh", "Telangana", "Kerala", "Madhya Pradesh",
      "Punjab", "Haryana", "Assam", "Jharkhand", "Chhattisgarh"
    ];

    const stateData = stateNames.map(state => {
      const stateForecasts = forecasts.filter(f => f.state === state || f.region.includes(state));
      const hasHighDemand = stateForecasts.some(f => f.change > 10);
      const whCount = warehouses.filter(w => w.state === state || w.location.includes(state)).length;
      
      let baseCost = 45 + (18 - state.length) * 2; 
      let delays = (state.length % 5) * 2;
      
      let status = "Normal";
      let color = "#00D084"; // Green
      
      if (hasHighDemand) {
        status = "Peak Demand";
        color = "#FF3F6C"; // Pink
      } else if (whCount === 0 && state.length % 2 === 0) {
        status = "High Cost";
        color = "#FF5A5A"; // Red
        baseCost += 40;
      } else if (delays > 5) {
        status = "Delayed";
        color = "#FFB547"; // Orange
      }

      return {
        id: state, 
        name: state,
        cost: `₹${baseCost}/order`,
        demand: hasHighDemand ? "High" : (whCount > 0 ? "Optimum" : "Low"),
        delays: delays,
        microHubs: whCount * 2 + (state.length % 3),
        density: hasHighDemand ? "High (92%)" : "Optimum (85%)",
        color,
        status
      };
    });

    return NextResponse.json({ success: true, states: stateData });
  } catch (error) {
    console.error("Heatmap API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch heatmap data" }, { status: 500 });
  }
}
