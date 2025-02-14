import { Static } from "elysia";
import { createBreedSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { breedsTable } from "./breed";

export type Breed = InferSelectModel<typeof breedsTable>;
export type CreateBreed = Static<typeof createBreedSchema>;
