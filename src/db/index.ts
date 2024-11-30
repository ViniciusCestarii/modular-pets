import eventBus from "@/modules/shared/utilities/events/event-emmiter";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("Connecting:", process.env.DATABASE_URL);

const db = drizzle(pool);

eventBus.on("db:close", async () => {
  await pool.end();
});

export default db;
