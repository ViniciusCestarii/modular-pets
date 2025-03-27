import { date, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { breedsTable } from "../breeds/breed";
import { speciesTable } from "../species/specie";
import { imagesTable, sexEnum } from "@/db/schema";
import { petPgSchema } from "../drizzle";

export const petsTable = petPgSchema.table("pets", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
  observations: varchar({ length: 1024 }),
  sex: sexEnum().default("UNKNOWN").notNull(),
  mainImageId: uuid().references(() => imagesTable.id),
  breedId: uuid()
    .references(() => breedsTable.id)
    .notNull(),
  specieId: uuid()
    .references(() => speciesTable.id)
    .notNull(),
});
