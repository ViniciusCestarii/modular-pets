import { t } from "elysia";
import { InvalidBreedSpecieError } from "./errors/invalid-breed-specie";
import { SpecieNotFoundError } from "./errors/specie-not-found";
import { BreedNotFoundError } from "./errors/breed-not-found";

export const swaggerInvalidBreedSpecieErrorSchema = t.Object({
  name: t.Literal(InvalidBreedSpecieError.name),
  message: t.Literal(new InvalidBreedSpecieError().message),
});

export const swaggerSpecieNotFoundErrorSchema = t.Object({
  name: t.Literal(SpecieNotFoundError.name),
  message: t.Literal(new SpecieNotFoundError().message),
});

export const swaggerBreedNotFoundErrorSchema = t.Object({
  name: t.Literal(BreedNotFoundError.name),
  message: t.Literal(new BreedNotFoundError().message),
});
