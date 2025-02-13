import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "@root/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/shared/services/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
