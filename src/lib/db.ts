import { PrismaClient, Prisma } from "@prisma/client";

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

  console.log("DB DEBUG: Using Standard Prisma Connection (Datasources)");

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
