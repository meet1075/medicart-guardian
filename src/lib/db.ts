// Neon serverless driver allows Edge deployments via Prisma
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure we have a URL even during build time to prevent crashes
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432";

const adapter = new PrismaNeon({ connectionString });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
