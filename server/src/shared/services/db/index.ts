// import { drizzle } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";
import { neon, neonConfig } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { config } from "@root/config";
import { Pool } from "pg";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

neonConfig.fetchConnectionCache = true;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});


export const db = drizzle({ client: pool });
