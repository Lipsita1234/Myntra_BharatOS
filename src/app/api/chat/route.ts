import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genAI } from "@/lib/ai";

type Persona = "seller" | "admin" | "ops";

const systemPrompts: Record<Persona, string> = {
  seller: `You are BharatOS AI Business Advisor, a helpful and intelligent assistant embedded inside Myntra BharatOS — an AI logistics platform for Indian small-business sellers. 
You help sellers understand their sales performance, inventory levels, regional demand patterns, and delivery efficiency. 
Be concise, actionable, and data-driven. Always reference the specific numbers provided in the context.
CRITICAL FORMATTING RULES:
1. Format ALL responses as semantic HTML using <p>, <h3>, <ul>, <li>, <strong>, <em>, and <hr> tags only.
2. Do NOT use Markdown (no **, no ##, no *, no backticks).
3. Return the raw HTML string directly — no code blocks, no preamble.
4. Keep responses focused and under 400 words.`,

  admin: `You are BharatOS Admin Logistics Copilot, a powerful AI assistant with full visibility into Myntra BharatOS's national logistics network. 
You help logistics administrators with warehouse capacity management, driver allocation, route optimization, cluster performance, sustainability metrics, and strategic decisions.
Always cite the specific data provided in the context. Be direct, precise, and strategic.
CRITICAL FORMATTING RULES:
1. Format ALL responses as semantic HTML using <p>, <h3>, <ul>, <li>, <table>, <tr>, <th>, <td>, <strong>, and <hr> tags only.
2. Do NOT use Markdown (no **, no ##, no *, no backticks).
3. Return the raw HTML string directly — no code blocks, no preamble.
4. Keep responses focused and under 450 words.`,

  ops: `You are BharatOS Operations Copilot, a real-time AI assistant for logistics operations managers. 
You have live access to delivery statuses, vehicle locations, cluster fill rates, and driver availability.
Help operations teams make fast, data-backed decisions about dispatching, routing, and resource allocation.
CRITICAL FORMATTING RULES:
1. Format ALL responses as semantic HTML using <p>, <h3>, <ul>, <li>, <strong>, and <hr> tags only.
2. Do NOT use Markdown (no **, no ##, no *, no backticks).
3. Return the raw HTML string directly — no code blocks, no preamble.
4. Keep responses concise and action-oriented.`,
};

async function getSellerContext() {
  const [orders, products, forecasts] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { status: true, amount: true, location: true, productName: true, createdAt: true },
    }),
    prisma.product.findMany({
      take: 10,
      orderBy: { sold: "desc" },
      select: { name: true, category: true, stock: true, sold: true, price: true, status: true },
    }),
    prisma.demandForecast.findMany({
      take: 5,
      orderBy: { confidence: "desc" },
      select: { region: true, product: true, change: true, confidence: true, factor: true, predictedDemand: true, currentDemand: true },
    }),
  ]);

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "IN_TRANSIT").length;

  return {
    recentOrders: { total: orders.length, delivered: deliveredOrders, pending: pendingOrders, totalRevenue },
    topProducts: products.slice(0, 5),
    lowStockProducts: products.filter((p) => p.stock < 20).map(p => ({ name: p.name, stock: p.stock, category: p.category })),
    demandForecasts: forecasts,
  };
}

async function getAdminContext() {
  const [warehouses, clusters, orders, vehicles, microHubs, sustainability] = await Promise.all([
    prisma.warehouse.findMany({
      select: { name: true, city: true, state: true, capacity: true, inventory: true, utilization: true },
    }),
    prisma.cluster.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { name: true, city: true, status: true, members: true, maxMembers: true, savings: true, completionProbability: true },
    }),
    prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      select: { status: true, location: true, amount: true, productName: true },
    }),
    prisma.vehicle.findMany({
      select: { vehicleType: true, status: true, driver: true, deliveries: true, fuel: true },
    }),
    prisma.microHub.findMany({
      select: { name: true, city: true, orders: true, capacity: true, status: true, hubType: true },
    }),
    prisma.sustainability.findFirst({
      orderBy: { createdAt: "desc" },
      select: { co2Reduced: true, moneySaved: true, fuelSaved: true, deliveriesOptimized: true },
    }),
  ]);

  const criticalWarehouses = warehouses.filter((w) => w.utilization > 85);
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const activeVehicles = vehicles.filter((v) => v.status === "ACTIVE" || v.status === "active").length;

  return {
    warehouses: warehouses.map((w) => ({ ...w, utilization: Math.round(w.utilization) })),
    criticalWarehouses: criticalWarehouses.map(w => ({ name: w.name, city: w.city, utilization: Math.round(w.utilization) })),
    clusterSummary: {
      total: clusters.length,
      active: clusters.filter((c) => c.status === "active" || c.status === "ACTIVE").length,
      totalSavings: clusters.reduce((s, c) => s + c.savings, 0).toFixed(2),
    },
    orders: {
      total: orders.length, totalRevenue,
      byStatus: {
        PENDING: orders.filter(o => o.status === "PENDING" || o.status === "pending").length,
        IN_TRANSIT: orders.filter(o => o.status === "IN_TRANSIT" || o.status === "in_transit").length,
        DELIVERED: orders.filter(o => o.status === "DELIVERED" || o.status === "delivered").length,
      }
    },
    fleet: { total: vehicles.length, active: activeVehicles },
    microHubs: microHubs.slice(0, 5),
    sustainability: sustainability || { co2Reduced: 0, moneySaved: 0, fuelSaved: 0 },
  };
}

async function getOpsContext() {
  const [orders, vehicles, clusters] = await Promise.all([
    prisma.order.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      select: { status: true, location: true, productName: true },
    }),
    prisma.vehicle.findMany({
      select: { vehicleType: true, status: true, driver: true, deliveries: true, fuel: true, currentLocation: true },
    }),
    prisma.cluster.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: { city: true, status: true, members: true, maxMembers: true, completionProbability: true },
    }),
  ]);

  const inTransit = orders.filter((o) => o.status === "IN_TRANSIT" || o.status === "in_transit").length;
  const pending = orders.filter((o) => o.status === "PENDING" || o.status === "pending").length;
  const lowFillClusters = clusters.filter((c) => c.maxMembers > 0 && (c.members / c.maxMembers) < 0.75);

  return {
    deliveryStatus: { inTransit, pending, total: orders.length },
    fleet: {
      total: vehicles.length,
      active: vehicles.filter((v) => v.status === "active" || v.status === "ACTIVE").length,
      idle: vehicles.filter((v) => v.status === "idle" || v.status === "IDLE").length,
      lowFuel: vehicles.filter((v) => v.fuel < 30).length,
    },
    clusters: {
      total: clusters.length,
      lowFill: lowFillClusters.length,
      avgFillRate: clusters.length
        ? Math.round(clusters.reduce((s, c) => s + (c.maxMembers > 0 ? c.members / c.maxMembers : 0), 0) / clusters.length * 100)
        : 0,
    },
  };
}

export async function POST(req: Request) {
  try {
    const { messages, persona = "seller" } = await req.json() as { messages: { role: string; text: string }[]; persona: Persona };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service unavailable. Please configure GEMINI_API_KEY." }, { status: 503 });
    }

    // Fetch live database context based on persona
    let context: any = {};
    if (persona === "seller") context = await getSellerContext();
    else if (persona === "admin") context = await getAdminContext();
    else if (persona === "ops") context = await getOpsContext();

    const systemPrompt = `${systemPrompts[persona]}

LIVE DATABASE CONTEXT (use this real data to answer questions):
${JSON.stringify(context, null, 2).substring(0, 3000)}`;

    // Build Gemini chat session
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite", // Explicitly requested by user
      systemInstruction: systemPrompt,
    });

    const chat = geminiModel.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    });

    const lastMessage = messages[messages.length - 1]?.text || "";
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, response: responseText });
  } catch (error: any) {
    console.error("Chat API error:", error);

    let errorMessage = error?.message || "Failed to generate AI response. Please try again.";
    if (errorMessage.includes("429") || error?.status === 429) {
      errorMessage = "⚠️ AI is currently experiencing high traffic (Rate Limit Exceeded). Please wait a few seconds and try again.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
