import { t } from "elysia";

export const createPatientSchema = t.Object({
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  medicalObservations: t.Optional(t.String()),
  sex: t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")]),
  breed: t.String(),
  specie: t.String(),
});
