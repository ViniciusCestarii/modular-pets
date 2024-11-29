import { Static } from "elysia";
import { createPetSchema, petSchema } from "../schemas/pets-schema";

export type Pet = Static<typeof petSchema>;

export type CreatePet = Static<typeof createPetSchema>;
