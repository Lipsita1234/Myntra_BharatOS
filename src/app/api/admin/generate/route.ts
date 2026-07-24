import { NextResponse } from "next/server";
import { generateSyntheticData } from "@/lib/data-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      customerCount = 30,
      sellerCount = 8,
      productsPerSeller = 6,
      orderCount = 120,
      warehouseCount = 5,
      vehicleCount = 20,
      clearFirst = true,
    } = body;

    const result = await generateSyntheticData({
      customerCount,
      sellerCount,
      productsPerSeller,
      orderCount,
      warehouseCount,
      vehicleCount,
      clearFirst,
    });

    return NextResponse.json({
      success: true,
      message: `Synthetic data generated successfully.`,
      stats: result,
    });
  } catch (error: any) {
    console.error("Data generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate synthetic data." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    description: "POST to this endpoint to generate synthetic data.",
    defaultParams: {
      customerCount: 30,
      sellerCount: 8,
      productsPerSeller: 6,
      orderCount: 120,
      warehouseCount: 5,
      vehicleCount: 20,
      clearFirst: true,
    },
  });
}
