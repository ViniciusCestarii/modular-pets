import { Static } from "elysia";
import { createSpecieSchema, specieSchema } from "./schema";

export type Specie = Static<typeof specieSchema>;

export type CreateSpecie = Static<typeof createSpecieSchema>;
