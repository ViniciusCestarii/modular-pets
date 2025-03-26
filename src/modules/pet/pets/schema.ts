import { t } from "elysia";
import { createSelectSchema } from "drizzle-typebox";
import { petsTable } from "./pet";
import { PetNotFoundError } from "./errors/pet-not-found";
import { swaggerViewImageSchema } from "@/modules/shared/images/schema";
import { swaggerBreedSchema } from "../breeds/schema";
import { swaggerSpecieSchema } from "../species/schema";

export const createPetSchema = t.Object({
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  observations: t.Optional(t.String()),
  sex: t.Union([t.Literal("MALE"), t.Literal("FEMALE"), t.Literal("UNKNOWN")], {
    default: "UNKNOWN",
  }),
  mainImageId: t.Optional(
    t.String({
      format: "uuid",
    }),
  ),
  breedId: t.String({
    format: "uuid",
  }),
  speciesId: t.String({
    format: "uuid",
  }),
});

export const listPetsSchema = t.Object({
  page: t.Integer({ minimum: 1 }),
  pageSize: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
});

// just for swagger
export const swaggerPetSchema = createSelectSchema(petsTable) as never; // this must be never or it give ts error
export const swaggerViewPetSchema = t.Intersect([
  swaggerPetSchema,
  t.Object({
    images: t.Array(swaggerViewImageSchema),
    breed: swaggerBreedSchema,
    specie: swaggerSpecieSchema,
  }),
]);

export const swaggerErrorPetNotFoundSchema = t.Object({
  name: t.Literal(PetNotFoundError.name),
  message: t.Literal(new PetNotFoundError().message),
});
