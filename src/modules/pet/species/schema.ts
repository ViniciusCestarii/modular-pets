import { createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { speciesTable } from "./specie";
import { SpecieAlreadyExistsError } from "./errors/specie-alredy-exists";

export const createSpecieSchema = t.Object({
  name: t.String(),
});

export const updateSpecieSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String(),
});

// just for swagger
export const swaggerSpecieSchema = createSelectSchema(speciesTable);

export const swaggerSpecieAlreadyExistsErrorSchema = t.Object({
  name: t.Literal(SpecieAlreadyExistsError.name),
  message: t.Literal(new SpecieAlreadyExistsError().message),
});
