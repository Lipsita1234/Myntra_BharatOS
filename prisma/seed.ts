/**
 * Prisma Seed — delegates to the Synthetic Data Generator.
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { generateSyntheticData } from "../src/lib/data-generator";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Myntra BharatOS Synthetic Data Seed...");

  await generateSyntheticData({
    customerCount: 250,
    sellerCount: 220,
    productsPerSeller: 3,
    orderCount: 2500,
    warehouseCount: 250,
    vehicleCount: 250,
    clusterCount: 250,
    microHubCount: 250,
    clearFirst: true,
  });

  console.log("🎉 Seed complete! Database is ready with realistic synthetic data.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
