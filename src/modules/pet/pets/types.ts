import { Static } from "elysia";
import { createPetSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { petsTable } from "./pet";

export type Pet = InferSelectModel<typeof petsTable>;

export type CreatePet = Static<typeof createPetSchema>;
