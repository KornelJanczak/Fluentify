import { drizzle } from "drizzle-orm/node-postgres";
import { neonConfig } from "@neondatabase/serverless";
import { Pool } from "pg";
import { config } from "@root/config";

neonConfig.fetchConnectionCache = true;
const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle({ client: pool });
