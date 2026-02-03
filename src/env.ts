import { z } from "zod";

/**
 * Type-safe environment variable validation using Zod.
 */

const envSchema = z.object({
  // Server-side
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url().optional(),
  GEMINI_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Client-side (prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success && process.env.NODE_ENV !== "test") {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2),
  );

  if (process.env.NODE_ENV === "production" || process.env.STRICT_ENV) {
    throw new Error("Invalid environment variables");
  }
}

export const env: Env = parsed.success ? parsed.data : (processEnv as Env);
