import Elysia from "elysia";
import { createBreedSchema } from "../schema";
import { makeCreateBreedUseCase } from "../factories/make-create";

export const createBreed = new Elysia().post(
  "/breeds",
  async ({ body, set }) => {
    const createBreedUseCase = makeCreateBreedUseCase();

    const createdBreed = await createBreedUseCase.execute(body);

    set.status = "Created";
    return createdBreed;
  },
  {
    body: createBreedSchema,
  },
);
