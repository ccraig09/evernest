import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import pg from "pg";

// Important: Configure Neon to use WebSockets for serverless environments
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  console.log("DB DEBUG: starting createPrismaClient (v7 simplified)");

  if (!connectionString) {
    console.error("DB DEBUG: DATABASE_URL is missing!");
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const logConfig: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];

  try {
    // Check if we are running locally (localhost)
    // If so, usage of the Neon adapter (WebSockets) might fail with standard Postgres containers
    const isLocal =
      connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1");

    if (isLocal) {
      console.log(
        "DB DEBUG: Detected local database, using Prisma Client with PG adapter",
      );
      const pool = new pg.Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({
        adapter,
        log: logConfig,
      });
    }

    console.log(
      "DB DEBUG: Initializing PrismaNeon adapter with direct connectionString",
    );
    // Prisma 7 simplified pattern - avoiding manual Pool creation
    const adapter = new PrismaNeon({ connectionString });

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
