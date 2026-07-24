import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * CSV/Excel Dataset Upload Endpoint
 * Accepts multipart form data with a file field.
 * Supported formats: CSV
 * Supported entity types via query param: orders, products, customers
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("type") || "orders";
    const mode = searchParams.get("mode") || "extend"; // "replace" or "extend"

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded. Send a 'file' field in form-data." }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    const isCSV = filename.endsWith(".csv");
    const isExcel = filename.endsWith(".xlsx") || filename.endsWith(".xls");

    if (!isCSV && !isExcel) {
      return NextResponse.json({ error: "Only CSV and Excel (.xlsx/.xls) files are supported." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let rows: Record<string, string>[] = [];

    if (isCSV) {
      // Parse CSV manually (avoid browser-only papaparse)
      const text = buffer.toString("utf-8");
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      rows = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
      });
    } else if (isExcel) {
      // Dynamic import of xlsx to avoid SSR issues
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" }) as Record<string, string>[];
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "File is empty or could not be parsed." }, { status: 400 });
    }

    let inserted = 0;
    const errors: string[] = [];

    // ── Import by entity type ────────────────────────────────────────────────
    if (entityType === "orders") {
      if (mode === "replace") {
        await prisma.order.deleteMany({ where: { createdAt: { not: undefined } } });
      }
      // Need a default customer/seller for uploaded orders
      const defaultCustomer = await prisma.user.findFirst({ where: { role: "customer" } });
      const defaultSeller = await prisma.user.findFirst({ where: { role: "seller" } });
      if (!defaultCustomer || !defaultSeller) {
        return NextResponse.json({ error: "No customer or seller found in DB. Generate base data first." }, { status: 400 });
      }
      for (const row of rows) {
        try {
          await prisma.order.create({
            data: {
              customerId: defaultCustomer.userId,
              sellerId: defaultSeller.userId,
              productName: String(row.productName || row.product_name || row.product || "Uploaded Product"),
              status: String(row.status || "pending"),
              deliveryMode: String(row.deliveryMode || row.delivery_mode || "direct"),
              amount: parseFloat(String(row.amount || row.price || "0")) || 0,
              shippingCost: parseFloat(String(row.shippingCost || row.shipping_cost || "50")) || 50,
              location: String(row.location || row.city || "India"),
              lat: parseFloat(String(row.lat || row.latitude || "20.5937")) || 20.5937,
              lng: parseFloat(String(row.lng || row.longitude || "78.9629")) || 78.9629,
            },
          });
          inserted++;
        } catch (e: any) {
          errors.push(`Row ${inserted + errors.length + 1}: ${e.message}`);
        }
      }
    } else if (entityType === "products") {
      if (mode === "replace") {
        await prisma.order.deleteMany({});
        await prisma.product.deleteMany({});
      }
      const defaultSeller = await prisma.user.findFirst({ where: { role: "seller" } });
      if (!defaultSeller) {
        return NextResponse.json({ error: "No seller found in DB. Generate base data first." }, { status: 400 });
      }
      for (const row of rows) {
        try {
          await prisma.product.create({
            data: {
              name: String(row.name || row.product_name || "Product"),
              category: String(row.category || "Apparel"),
              price: parseFloat(String(row.price || "500")) || 500,
              stock: parseInt(String(row.stock || "100")) || 100,
              sold: parseInt(String(row.sold || "0")) || 0,
              reorderLevel: parseInt(String(row.reorderLevel || row.reorder_level || "10")) || 10,
              status: String(row.status || "healthy"),
              sellerId: defaultSeller.userId,
            },
          });
          inserted++;
        } catch (e: any) {
          errors.push(`Row ${inserted + errors.length + 1}: ${e.message}`);
        }
      }
    } else if (entityType === "customers") {
      for (const row of rows) {
        try {
          await prisma.user.upsert({
            where: { email: String(row.email || `upload.${inserted + 1}@example.com`) },
            update: {},
            create: {
              name: String(row.name || "Uploaded Customer"),
              email: String(row.email || `upload.${inserted + 1}@example.com`),
              password: "password123",
              role: "customer",
              phone: String(row.phone || ""),
              address: String(row.address || ""),
            },
          });
          inserted++;
        } catch (e: any) {
          errors.push(`Row ${inserted + errors.length + 1}: ${e.message}`);
        }
      }
    } else {
      return NextResponse.json(
        { error: `Unknown entity type '${entityType}'. Use: orders, products, customers` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      entityType,
      mode,
      totalRows: rows.length,
      inserted,
      errors: errors.slice(0, 10), // Return first 10 errors max
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "File upload and parsing failed." },
      { status: 500 }
    );
  }
}
