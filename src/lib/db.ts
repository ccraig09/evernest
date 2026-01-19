import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Important: Configure Neon to use WebSockets for serverless environments
neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  console.log("DB DEBUG: starting createPrismaClient");
  console.log(
    "DB DEBUG: Environment keys available:",
    Object.keys(process.env).join(", "),
  );

  if (connectionString) {
    console.log(
      "DB DEBUG: connectionString found, length:",
      connectionString.length,
    );
    console.log(
      "DB DEBUG: connectionString start:",
      connectionString.substring(0, 15) + "...",
    );
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
  const isNeonDatabase =
    connectionString.includes("neon.tech") ||
    connectionString.includes("neon.db");

  console.log("DB DEBUG: isNeonDatabase:", isNeonDatabase);

  // Use Neon adapter if it's a Neon URL (production/preview)
  if (isNeonDatabase) {
    console.log("DB DEBUG: Using Neon Serverless path");
    const pool = new Pool({ connectionString });
    // Cast to any to avoid strict type mismatch
    const adapter = new PrismaNeon(pool as any);
    return new PrismaClient({
      adapter,
      log: logConfig,
    });
  }

  // Fallback to standard connection for local/docker
  console.log("DB DEBUG: Using Standard Prisma (Local/Docker) via datasources");

  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: logConfig,
  } as any);
}

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
