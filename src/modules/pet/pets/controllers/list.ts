import Elysia from "elysia";
import { listPetSchema } from "../schema";
import { makeListPetsUseCase } from "../factories/make-list";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";

export const listPet = new Elysia()
  .error({
    SpecieNotFoundError,
    BreedNotFoundError,
    InvalidBreedSpecieError,
  })
  .get(
    "/pets",
    async ({ query }) => {
      const listPetsUseCase = makeListPetsUseCase();

      const pets = await listPetsUseCase.execute(query);

      return pets;
    },
    {
      query: listPetSchema,
    },
  );
