import { t } from "elysia";

export const createBreedSchema = t.Object({
  name: t.String(),
  speciesId: t.String({
    format: "uuid",
  }),
});
