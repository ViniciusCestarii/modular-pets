import { unique, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { speciesTable } from "../species/specie";
import { petPgSchema } from "../drizzle";

export const breedsTable = petPgSchema.table(
  "breeds",
  {
    id: uuid().primaryKey().$defaultFn(v7),
    name: varchar({ length: 255 }).notNull(),
    specieId: uuid()
      .references(() => speciesTable.id)
      .notNull(),
  },
  (t) => [unique().on(t.name, t.specieId)],
);
