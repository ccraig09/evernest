import { PrismaClient, Prisma } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Important: Configure Neon to use WebSockets for serverless environments
neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  console.log("DB DEBUG: starting createPrismaClient");
  if (connectionString) {
      console.log("DB DEBUG: connectionString found, length:", connectionString.length);
      console.log("DB DEBUG: connectionString start:", connectionString.substring(0, 15) + "...");
  } else {
      console.log("DB DEBUG: connectionString IS MISSING");
  }

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const logConfig: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  // Check if we are running in a Vercel/Neon environment or if the URL specifies Neon
  // We default to the Neon adapter if it looks like a Neon URL (postgres URL on port 5432 usually,
  // but specifically neon.tech/neon.db domains are clear indicators)
  const isNeonDatabase =
    connectionString.includes("neon.tech") ||
    connectionString.includes("neon.db");

  // For testing purposes, we can force the standard adapter if needed (e.g. Docker local)
  const isLocalDocker = !isNeonDatabase;

  console.log("DB DEBUG: isNeonDatabase:", isNeonDatabase);

  if (isLocalDocker) {
    console.log("DB DEBUG: Using Local Docker path");
    // Local development with standard Postgres (typical Docker setup)
    // We use PrismaPg adapter here mostly for consistency, but standard PrismaClient would also work.
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log: logConfig,
    });
  }

  console.log("DB DEBUG: Using Neon Serverless path");
  // Serverless / Production (Neon)
  const pool = new Pool({ connectionString });

  // Cast to any to avoid strict type mismatch between @neondatabase/serverless Pool and Prisma adapter expectations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({
    adapter,
    log: logConfig,
  });
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
