import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { speciesTable } from "./specie";

export const createSpecieSchema = t.Object({
  name: t.String(),
});

// just for swagger
export const specieSchema = createSelectSchema(speciesTable) as never;
