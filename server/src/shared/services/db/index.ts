import { drizzle } from "drizzle-orm/node-postgres";
import { neonConfig } from "@neondatabase/serverless";
import { Pool } from "pg";
import { config } from "@root/config";

neonConfig.fetchConnectionCache = true;
const pool = new Pool({
  // user: "postgres",
  // host: "localhost",
  // database: "fluentify",
  // password: "123",
  // port: 5432,
  connectionString: config.DATABASE_URL,
});

export const db = drizzle({ client: pool });
