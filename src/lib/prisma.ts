import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma_v2: PrismaClient | undefined;
};

// On Vercel, the filesystem is read-only. SQLite requires write access for locking.
// We copy the bundled DB to /tmp to allow Prisma to function.
if (process.env.NODE_ENV === "production") {
  const tmpDbPath = path.join("/tmp", "dev.db");
  if (!fs.existsSync(tmpDbPath)) {
    const bundledDbPath = path.join(process.cwd(), "prisma", "prisma", "dev.db");
    const fallbackDbPath = path.join(process.cwd(), "prisma", "dev.db");
    if (fs.existsSync(bundledDbPath)) {
      fs.copyFileSync(bundledDbPath, tmpDbPath);
    } else if (fs.existsSync(fallbackDbPath)) {
      fs.copyFileSync(fallbackDbPath, tmpDbPath);
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}

export const prisma =
  globalForPrisma.prisma_v2 ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v2 = prisma;
