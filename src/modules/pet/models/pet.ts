import { generateSchema } from "@/modules/shared/utilities/schema";
import { date, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const petSchema = generateSchema();

export const petsTable = petSchema.table("pets", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
});