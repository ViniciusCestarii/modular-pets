import { Static } from "elysia";
import { createPetSchema, petSchema } from "./schema";

export type Pet = Static<typeof petSchema>;

export type CreatePet = Static<typeof createPetSchema>;
