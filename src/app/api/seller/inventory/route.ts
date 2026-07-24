import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

// GET seller inventory
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    const sellerId = payload?.userId || "USR-SELLER";

    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { updatedAt: "desc" },
    });

    const recommendations = [];
    let recId = 1;

    for (const p of products) {
      if (p.stock < p.reorderLevel) {
        recommendations.push({
          id: recId++,
          productId: p.productId,
          type: "increase",
          title: `Increase Stock of ${p.name}`,
          detail: `Stock is critically low (${p.stock} units remaining).`,
          region: "National Hub",
          action: `Restock +${Math.max(50, p.reorderLevel * 2)} units`,
          urgency: p.stock === 0 ? "Critical" : "High",
          color: "var(--myntra-pink)",
          badge: "red",
          stockToAdd: Math.max(50, p.reorderLevel * 2)
        });
      } else if (p.stock > p.reorderLevel * 3 && p.sold < p.stock * 0.2) {
         recommendations.push({
          id: recId++,
          productId: p.productId,
          type: "reduce",
          title: `Reduce Production of ${p.name}`,
          detail: `Excess inventory detected (${p.stock} units) with slow sales velocity.`,
          region: "Pan India",
          action: "Scale back restocking rate",
          urgency: "Low",
          color: "var(--warning)",
          badge: "orange",
          stockToAdd: 0
        });
      }
      if (recommendations.length >= 3) break;
    }

    // Fallbacks if perfectly healthy
    if (recommendations.length === 0 && products.length > 0) {
      const p = products[0];
      recommendations.push({
        id: recId++,
        productId: p.productId,
        type: "transfer",
        title: `Optimize Positioning for ${p.name}`,
        detail: `Move inventory closer to high-demand clusters.`,
        region: "North India",
        action: "Transfer 50 units",
        urgency: "Medium",
        color: "var(--info)",
        badge: "blue",
        stockToAdd: 0
      });
    }

    return NextResponse.json({ success: true, products, recommendations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// POST create new product
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    const sellerId = payload?.userId || "USR-SELLER";

    const body = await req.json();
    const product = await prisma.product.create({
      data: { ...body, sellerId },
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PATCH update product stock / status
export async function PATCH(req: Request) {
  try {
    const { productId, stockToAdd, ...data } = await req.json();
    
    const product = await prisma.product.findUnique({ where: { productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const newStock = stockToAdd !== undefined ? product.stock + stockToAdd : (data.stock ?? product.stock);
    let newStatus = product.status;

    if (newStock === 0) newStatus = "critical";
    else if (newStock <= product.reorderLevel) newStatus = "low";
    else newStatus = "healthy";

    const updated = await prisma.product.update({ 
      where: { productId }, 
      data: { ...data, stock: newStock, status: newStatus } 
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    await prisma.product.delete({ where: { productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
