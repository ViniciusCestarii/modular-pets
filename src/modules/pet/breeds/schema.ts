import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { breedsTable } from "./breed";

export const breedSchema = createSelectSchema(breedsTable);

export const createBreedSchema = createInsertSchema(breedsTable);
