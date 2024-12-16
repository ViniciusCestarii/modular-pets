import { uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { petPgSchema } from "../drizzle";

export const speciesTable = petPgSchema.table("species", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull().unique(),
});
