// Load environment variables
import "dotenv/config";

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://johndoe:randompassword@localhost:5432/mydb",
  },
});
