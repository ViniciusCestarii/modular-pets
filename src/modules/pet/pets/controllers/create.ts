import Elysia from "elysia";
import { createPetSchema } from "../schema";
import { makeCreatePetUseCase } from "../factories/make-create";

export const createPet = new Elysia().post(
  "/pets",
  async ({ body, set }) => {
    const createPetUseCase = makeCreatePetUseCase();

    const createdPet = await createPetUseCase.execute(body);

    set.status = "Created";
    return createdPet;
  },
  {
    body: createPetSchema,
  },
);
