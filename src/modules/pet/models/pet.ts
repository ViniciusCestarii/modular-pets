import { generateSchema } from "@/modules/shared/utilities/schema";
import { randomUUIDv7 } from "bun";
import { date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const tableSchema = generateSchema();

export const petsTable = pgTable("pets", {
  id: uuid().primaryKey().default(randomUUIDv7()),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
});