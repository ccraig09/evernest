import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Important: Configure Neon to use WebSockets for serverless environments
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  console.log("DB DEBUG: starting createPrismaClient (v7)");

  if (!connectionString) {
    console.error("DB DEBUG: DATABASE_URL is missing!");
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const logConfig: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  try {
    console.log("DB DEBUG: Initializing PrismaNeon adapter");
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool as any);

    // In Prisma 7, with url removed from schema, we MUST use adapter
    return new PrismaClient({
      adapter,
      log: logConfig,
    } as any);
  } catch (error) {
    console.error("DB DEBUG: Failed to initialize PrismaClient:", error);
    throw error;
  }
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
