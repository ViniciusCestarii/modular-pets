import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import fs from "fs/promises";
import path from "node:path";
import { Pool } from "pg";
import * as schemas from "@/db/schema";
import { signToken } from "@/utils/auth/jwt";
import { eq } from "drizzle-orm";
import { fileToBase64Url } from "@/utils/transform";

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

const seedImages = async (db: NodePgDatabase) => {
  const petId = (
    await db
      .select({ id: schemas.petsTable.id })
      .from(schemas.petsTable)
      .orderBy(schemas.petsTable.name)
      .limit(1)
  )[0].id;

  console.log(petId);

  const url = await fileToBase64Url(dogImageFile);

  const imageId = await db
    .insert(schemas.imagesTable)
    .values({
      ownerType: "pet",
      src: url,
      ownerId: petId,
    })
    .returning({ id: schemas.imagesTable.id });

  await db
    .update(schemas.petsTable)
    .set({
      mainImageId: imageId[0].id,
    })
    .where(eq(schemas.petsTable.id, petId));
};

export const seedDb = async (count: number) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  await seed(db, schemas, { count });

  await seedImages(db);

  await pool.end();
};

const tokenTest = await signToken({
  email: "john.doe@gmail.com",
  id: "f93e5473-83da-4e8d-818d-62bc55c1b3a3",
});

export const bearerToken = `Bearer ${tokenTest}`;

const dogImagePath = path.resolve("src/test/assets/milli-dog.jpg");

const imageBuffer = await fs.readFile(dogImagePath);
export const dogImageFile = new File([imageBuffer], "milli-dog.jpg");
