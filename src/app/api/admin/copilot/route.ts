import { NextResponse } from "next/server";
import { model } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("AI service unavailable. Please configure GEMINI_API_KEY to use the Copilot.");
    }

    // 1. Fetch relevant system telemetry from DB
    const warehouses = await prisma.warehouse.findMany({ select: { name: true, utilization: true, capacity: true } });
    const vehicles = await prisma.vehicle.findMany({ select: { vehicleId: true, vehicleType: true, status: true } });
    const clusters = await prisma.cluster.findMany({ select: { name: true, status: true, completionProbability: true }});

    // 2. Query Gemini as an explainer
    const prompt = `
      You are an AI logistics assistant for Myntra BharatOS.
      Answer the user's operational query strictly based on the following real-time database state. 
      Do NOT invent or hallucinate metrics, locations, or vehicle types that are not in this state data.
      
      System State:
      Warehouses: ${JSON.stringify(warehouses)}
      Vehicles: ${JSON.stringify(vehicles)}
      Clusters: ${JSON.stringify(clusters)}
      
      User Query: "${query}"

      Respond STRICTLY in JSON format with exactly the following structure (no markdown, no backticks, no extra text):
      {
        "text": "Your detailed, analytical answer.",
        "confidence": number (0-100),
        "tags": ["Tag1", "Tag2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const answer = JSON.parse(jsonStr);

    return NextResponse.json({
      success: true,
      query,
      answer
    });
  } catch (error) {
    console.error("Copilot AI error:", error);
    return NextResponse.json({ error: "Copilot query failed" }, { status: 400 });
  }
}
