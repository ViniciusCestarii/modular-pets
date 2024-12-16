import { pgSchema, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const petSchema = pgSchema("pet");

export const speciesTable = petSchema.table("species", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull().unique(),
});
