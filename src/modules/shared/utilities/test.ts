import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import fs from "fs/promises";
import path from "node:path";
import { Pool } from "pg";
import * as schemas from "@/db/schema";

export const generateDatabaseURL = (databaseName: string): string => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not defined");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.pathname = `/${databaseName}`;
  return url.toString();
};

export const generateTestDrizzleConfig = async (databaseName: string) => {
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

  const filename = path.resolve(__dirname, `drizzle-${databaseName}.config.ts`);

  await fs.writeFile(filename, drizzleConfig);

  return filename;
};

export const resetDb = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  await reset(db, schemas);

  await pool.end();
};
