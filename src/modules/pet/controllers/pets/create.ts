import Elysia from "elysia";
import { createPetSchema } from "../../schemas/pets-schema";
import { makeCreatePetUseCase } from "../../use-cases/pets/factories/makeCreatePet";

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
