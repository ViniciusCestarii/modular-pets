import { uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { speciesTable } from "../species/specie";
import { petPgSchema } from "../drizzle";

export const breedsTable = petPgSchema.table("breeds", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  speciesId: uuid()
    .references(() => speciesTable.id)
    .notNull(),
});
