import Elysia from "elysia";
import { listPetsSchema } from "../schema";
import { makeListPetsUseCase } from "../factories/make-list";

export const listPets = new Elysia().get(
  "/pets",
  async ({ query }) => {
    const listPetsUseCase = makeListPetsUseCase();

    const pets = await listPetsUseCase.execute(query);

    return pets;
  },
  {
    query: listPetsSchema,
  },
);
