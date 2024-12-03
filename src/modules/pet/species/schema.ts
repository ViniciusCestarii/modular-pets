import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { speciesTable } from "./specie";

export const specieSchema = createSelectSchema(speciesTable);

export const createSpecieSchema = createInsertSchema(speciesTable);
