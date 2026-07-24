import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    services: {
      apiGateway: "99.98% Online",
      database: "Normal (12% Load)",
      aiPrediction: "Normal (142ms Latency)",
      webSocketConnections: 1240
    },
    systemMetrics: {
      cpuUtilization: 32,
      ramUtilization: 64,
      bufferCacheHitRate: 99.8
    }
  });
}
