import Elysia from "elysia";
import { createPetSchema } from "../schema";
import { makeCreatePetUseCase } from "../factories/make-create";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";
import { auth } from "@/modules/shared/auth/plugin";

export const createPet = new Elysia()
  .use(auth())
  .error({
    SpecieNotFoundError,
    BreedNotFoundError,
    InvalidBreedSpecieError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieNotFoundError":
        set.status = "Bad Request";
        return error;
      case "BreedNotFoundError":
        set.status = "Bad Request";
        return error;
      case "InvalidBreedSpecieError":
        set.status = "Bad Request";
        return error;
    }
  })
  .post(
    "/pets",
    async ({ body, set }) => {
      const createPetUseCase = makeCreatePetUseCase();

      const createdPet = await createPetUseCase.execute(body);

      set.status = "Created";
      return createdPet;
    },
    {
      body: createPetSchema,
      detail: {
        tags: ["Pet"],
      },
    },
  );
