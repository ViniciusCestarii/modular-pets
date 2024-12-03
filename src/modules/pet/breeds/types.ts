import { Static } from "elysia";
import { createBreedSchema, breedSchema } from "./schema";

export type Breed = Static<typeof breedSchema>;

export type CreateBreed = Static<typeof createBreedSchema>;
