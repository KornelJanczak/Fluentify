import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { config } from "@root/config";
// import { config } from "dotenv";

// config({ path: ".env" });

neonConfig.fetchConnectionCache = true;
const sql: NeonQueryFunction<boolean, boolean> = neon(
  config.DATABASE_URL || ""
);

//@ts-ignore
export const db = drizzle({ client: sql });
