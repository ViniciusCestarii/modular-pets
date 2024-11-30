import eventBus from "@/modules/shared/utilities/events/event-emmiter";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV === "test" && !process.env.npm_lifecycle_event) {
  throw new Error(
    "Do not run tests using 'bun test', use 'bun run test' or 'bun test:e2e' instead",
  );
}

console.log("Connecting:", process.env.DATABASE_URL);

const db = drizzle(pool);

eventBus.on("db:close", async () => {
  await pool.end();
});

export default db;
