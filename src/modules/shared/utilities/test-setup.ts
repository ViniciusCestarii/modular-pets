import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { afterAll, afterEach } from "bun:test";
import fs from "fs/promises";
import { drizzle } from "drizzle-orm/node-postgres";
import { generateDatabaseURL, generateTestDrizzleConfig } from "./test";
import eventBus from "./events/event-emmiter";

const databaseName = `test_modular_pets_${randomUUID().replaceAll("-", "_")}`;

const db = drizzle(process.env.DATABASE_URL!);

process.env.DATABASE_URL = generateDatabaseURL(databaseName);

await db.$client.query(`CREATE DATABASE ${databaseName}`);

const filename = await generateTestDrizzleConfig(databaseName);

execSync(`bunx drizzle-kit migrate --config=${filename}`);

fs.unlink(filename);

const dropDatabase = async (databaseName: string) => {
  await db.$client.query(`DROP DATABASE ${databaseName}`);
};

afterEach(async () => {
  // TODO - Truncate all tables from all schemas automatically
  const query = `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'pet'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute(query);

  for (const table of tables.rows) {
    const query = `TRUNCATE TABLE pet.${table.table_name} CASCADE;`;
    await db.execute(query);
  }
});

afterAll(async () => {
  const databaseName = new URL(process.env.DATABASE_URL!).pathname.slice(1);

  eventBus.emit("db:close");
  await dropDatabase(databaseName);
});
