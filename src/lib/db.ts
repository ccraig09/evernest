import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const logConfig =
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as const)
      : (["error"] as const);

  // Use Neon adapter for production (serverless), PrismaPg for local development
  const isNeonDatabase =
    connectionString.includes("neon.tech") ||
    connectionString.includes("neon.db");

  if (isNeonDatabase) {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({
      adapter,
      log: logConfig,
    });
  }

  // Local development with standard Postgres (Docker)
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: logConfig,
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
