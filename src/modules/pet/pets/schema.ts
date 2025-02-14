import { t } from "elysia";

export const createPetSchema = t.Object({
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  observations: t.Optional(t.String()),
  sex: t.Optional(
    t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
      default: "UNKNOWN",
    }),
  ),
  breedId: t.String({
    format: "uuid",
  }),
  speciesId: t.String({
    format: "uuid",
  }),
});
