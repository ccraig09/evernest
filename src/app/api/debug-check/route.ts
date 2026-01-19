import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const envKeys = Object.keys(process.env);
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlLength = process.env.DATABASE_URL?.length || 0;

  let dbStatus = "unchecked";
  let dbError = null;

  try {
    // Attempt a lightweight query
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (e: any) {
    dbStatus = "failed";
    dbError = e.message;
    console.error("Debug Route DB Error:", e);
  }

  return NextResponse.json({
    env: {
      keys: envKeys,
      hasDbUrl,
      dbUrlLength,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
    },
    db: {
      status: dbStatus,
      error: dbError,
    },
    timestamp: new Date().toISOString(),
  });
}
