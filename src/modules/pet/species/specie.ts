import { generateSchema } from "@/modules/shared/utilities/schema";
import { uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const specieSchema = generateSchema();

export const speciesTable = specieSchema.table("species", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull().unique(),
});
