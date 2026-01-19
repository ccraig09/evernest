import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    // Falls back to dummy URL for build-time generation if real URL is missing
    url:
      env("DATABASE_URL") ??
      "postgresql://johndoe:randompassword@localhost:5432/mydb",
  },
});
