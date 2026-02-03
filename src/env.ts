import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables (not available on client)
   * Will throw if you access these variables on the client.
   */
  server: {
    // Database
    DATABASE_URL: z
      .string()
      .url()
      .describe("Neon PostgreSQL connection string"),

    // Auth.js
    AUTH_SECRET: z
      .string()
      .min(32)
      .describe("Auth.js secret key (min 32 chars)"),
    AUTH_URL: z.string().url().optional().describe("Auth.js base URL"),

    // AI Providers
    GEMINI_API_KEY: z.string().min(1).describe("Google Gemini API key"),
    OPENAI_API_KEY: z.string().optional().describe("OpenAI API key (optional)"),

    // Node
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  /**
   * Client-side environment variables (available on both client and server)
   * Must be prefixed with NEXT_PUBLIC_
   */
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z
      .string()
      .url()
      .optional()
      .describe("Sentry DSN for error tracking"),
  },

  /**
   * Runtime environment mapping for Next.js bundler
   * For Next.js >= 13.4.4, we can use experimental__runtimeEnv for client vars only
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  /**
   * Skip validation in certain scenarios
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined
   */
  emptyStringAsUndefined: true,
});
