import eventBus from "@/modules/shared/utilities/events/event-emmiter";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";

if (process.env.NODE_ENV === "test" && !process.env.npm_lifecycle_event) {
  console.error(
    "Do not run tests using 'bun test', use 'bun run test' or 'bun test:e2e' instead",
  );

  process.exit(1);
}

const client = new SQL(process.env.DATABASE_URL!);

const db = drizzle({ client });

eventBus.on("db:close", async () => {
  await client.end();
});

export default db;
