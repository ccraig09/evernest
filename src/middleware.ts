import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory store for rate limiting
// Note: In a serverless environment (like Vercel), this Map will be reset
// whenever the lambda/edge function is re-instantiated. This provides transient
// protection (e.g. against rapid bursts) but true persistent rate limiting
// would require an external store like Redis/Upstash.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export function middleware(request: NextRequest) {
  // Only limit the generate/create story endpoint
  if (
    request.nextUrl.pathname.startsWith("/api/stories") &&
    request.method === "POST"
  ) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip";
    const now = Date.now();

    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Reset loop if window passed
    if (now - record.lastReset > RATE_LIMIT_WINDOW) {
      record.count = 0;
      record.lastReset = now;
    }

    if (record.count >= MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Please wait a moment before creating another story.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    record.count += 1;
    rateLimitMap.set(ip, record);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/stories/:path*",
};
