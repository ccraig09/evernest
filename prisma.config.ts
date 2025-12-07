import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables
import "dotenv/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    migrations: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
