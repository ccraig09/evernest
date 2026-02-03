import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // Also load .env as fallback
import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    // Falls back to dummy URL for build-time generation if real URL is missing
    url:
      process.env.DATABASE_URL ??
      "postgresql://johndoe:randompassword@localhost:5432/mydb",
  },
});
