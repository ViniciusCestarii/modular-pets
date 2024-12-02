import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { petsTable } from "./pet";

export const petSchema = createSelectSchema(petsTable);

export const createPetSchema = createInsertSchema(petsTable);
