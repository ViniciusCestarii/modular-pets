import { t } from "elysia";
import { createSelectSchema } from "drizzle-typebox";
import { petsTable } from "./pet";

export const createPetSchema = t.Object({
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  observations: t.Optional(t.String()),
  sex: t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
    default: "UNKNOWN",
  }),
  breedId: t.String({
    format: "uuid",
  }),
  speciesId: t.String({
    format: "uuid",
  }),
});

// just for swagger
export const petSchema = createSelectSchema(petsTable) as never;

export const listPetsSchema = t.Object({
  page: t.Integer({ minimum: 1 }),
  pageSize: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
});
