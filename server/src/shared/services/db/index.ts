import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "@root/config";
import * as schema from "@services/db/schema";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema: schema });
