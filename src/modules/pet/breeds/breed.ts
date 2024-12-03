import { generateSchema } from "@/modules/shared/utilities/schema";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { speciesTable } from "../species/specie";

export const breedSchema = generateSchema();

export const breedsTable = breedSchema.table("breeds", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  speciesId: uuid()
    .references(() => speciesTable.id)
    .notNull(),
});
