import { generateSchema } from "@/modules/shared/utilities/schema";
import { date, pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { breedsTable } from "../breeds/breed";
import { speciesTable } from "../species/specie";

export const petSchema = generateSchema();

export const sexEnum = pgEnum("sex", ["MALE", "FEMALE", "UNKNOWN"]);

export const petsTable = petSchema.table("pets", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
  observations: varchar({ length: 1024 }),
  sex: sexEnum().default("UNKNOWN").notNull(),
  breedId: uuid()
    .references(() => breedsTable.id)
    .notNull(),
  speciesId: uuid()
    .references(() => speciesTable.id)
    .notNull(),
});
