import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { breedsTable } from "./breed";

export const createBreedSchema = t.Object({
  name: t.String(),
  speciesId: t.String({
    format: "uuid",
  }),
});

// just for swagger
export const breedSchema = createSelectSchema(breedsTable);
