import { Static } from "elysia";
import { createSpecieSchema, updateSpecieSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { speciesTable } from "./specie";

export type Specie = InferSelectModel<typeof speciesTable>;

export type CreateSpecie = Static<typeof createSpecieSchema>;

export type UpdateSpecie = Static<typeof updateSpecieSchema>;
