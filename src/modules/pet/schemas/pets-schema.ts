import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { petsTable } from "../models/pet";

export const petSchema = createSelectSchema(petsTable);

export const createPetSchema = createInsertSchema(petsTable);