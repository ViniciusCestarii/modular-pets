import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { beforeAll, afterAll } from "bun:test";
import fs from "fs/promises";
import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";

export const setupE2E = async () => {
  const generateTestDrizzleConfig = async (databaseName: string) => {
    const drizzleConfig = `
    import "dotenv/config";
    import { defineConfig } from "drizzle-kit";
    export default defineConfig({
      out: "./drizzle",
      schema: "./src/db/schema.ts",
      dialect: "postgresql",
      dbCredentials: {
        url: "${generateDatabaseURL(databaseName)}",
      },
    });
  `;

    const filename = path.resolve(
      __dirname,
      `drizzle-${databaseName}.config.ts`,
    );

    await fs.writeFile(filename, drizzleConfig);

    return filename;
  };

  const db = drizzle(process.env.DATABASE_URL!);

  const generateDatabaseURL = (databaseName: string): string => {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not defined");
    }

    const url = new URL(process.env.DATABASE_URL);
    url.pathname = `/${databaseName}`;
    return url.toString();
  };

  const createDatabase = async (databaseName: string) => {
    await db.$client.query(`CREATE DATABASE ${databaseName}`);
  };

  const dropDatabase = async (databaseName: string) => {
    await db.$client.query(`DROP DATABASE ${databaseName}`);
  };

  beforeAll(async () => {
    const databaseName = `test_modular_pets_${randomUUID().replaceAll("-", "_")}`;
    process.env.DATABASE_URL = generateDatabaseURL(databaseName);

    await createDatabase(databaseName);

    const filename = await generateTestDrizzleConfig(databaseName);

    execSync(`bunx drizzle-kit migrate --config=${filename}`);

    await fs.unlink(filename);
  });

  afterAll(async () => {
    const databaseName = new URL(process.env.DATABASE_URL!).pathname.slice(1);

    await dropDatabase(databaseName);
  });
};
