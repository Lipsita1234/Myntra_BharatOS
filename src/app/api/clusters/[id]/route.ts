import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.cluster.findUnique({
      where: { clusterId: id },
      include: { orders: true }
    });
    if (!item) {
      return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, cluster: item });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cluster" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // clean up body to only include fields existing in Prisma Model
    const { clusterId, orders, ...updateData } = body;

    const cluster = await prisma.cluster.update({
      where: { clusterId: id },
      data: updateData
    });
    return NextResponse.json({ success: true, cluster });
  } catch (error) {
    console.error("Cluster update failed:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.cluster.delete({
      where: { clusterId: id }
    });
    return NextResponse.json({ success: true, message: `Cluster ${id} deleted` });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
