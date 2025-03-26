import { Static } from "elysia";
import { createBreedSchema, updateBreedSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { breedsTable } from "./breed";

export type Breed = InferSelectModel<typeof breedsTable>;
export type CreateBreed = Static<typeof createBreedSchema>;
export type UpdateBreed = Static<typeof updateBreedSchema>;
