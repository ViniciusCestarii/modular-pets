import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { afterAll } from "bun:test";
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

afterAll(async () => {
  const databaseName = new URL(process.env.DATABASE_URL!).pathname.slice(1);

  eventBus.emit("db:close");
  await dropDatabase(databaseName);
});