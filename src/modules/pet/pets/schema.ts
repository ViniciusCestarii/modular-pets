import { t } from "elysia";
import { createSelectSchema } from "drizzle-typebox";
import { petsTable } from "./pet";
import { PetNotFoundError } from "./errors/pet-not-found";
import { swaggerViewImageSchema } from "@/modules/shared/images/schema";
import { swaggerBreedSchema } from "../breeds/schema";
import { swaggerSpecieSchema } from "../species/schema";

const sexSchema = [
  t.Literal("MALE"),
  t.Literal("FEMALE"),
  t.Literal("UNKNOWN"),
];

export const createPetSchema = t.Object({
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  observations: t.Optional(t.String()),
  sex: t.Union(sexSchema, {
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
  specieId: t.String({
    format: "uuid",
  }),
});

export const updatePetSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String(),
  birthdate: t.String({ format: "date" }),
  observations: t.Optional(t.String()),
  sex: t.Union(sexSchema, {
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
  specieId: t.String({
    format: "uuid",
  }),
});

export const listPetsSchema = t.Object({
  page: t.Integer({ minimum: 1 }),
  pageSize: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
  name: t.Optional(t.String()),
  sex: t.Optional(t.Union(sexSchema)),
  breedId: t.Optional(t.String({ format: "uuid" })),
  specieId: t.Optional(t.String({ format: "uuid" })),
  minBirthdate: t.Optional(
    t.String({
      format: "date",
    }),
  ),
  maxBirthdate: t.Optional(
    t.String({
      format: "date",
    }),
  ),
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
