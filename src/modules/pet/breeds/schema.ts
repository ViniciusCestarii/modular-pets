import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { breedsTable } from "./breed";
import { BreedAlreadyExistsError } from "./errors/breed-already-exists";

export const createBreedSchema = t.Object({
  name: t.String(),
  speciesId: t.String({
    format: "uuid",
  }),
});

export const updateBreedSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String(),
  speciesId: t.String({
    format: "uuid",
  }),
});

// just for swagger
export const swaggerBreedSchema = createSelectSchema(breedsTable);

export const swaggerBreedAlreadyExistsSchema = t.Object({
  name: t.Literal(BreedAlreadyExistsError.name),
  message: t.Literal(new BreedAlreadyExistsError().message),
});
