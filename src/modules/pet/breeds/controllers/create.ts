import Elysia from "elysia";
import { createBreedSchema } from "../schema";
import { makeCreateBreedUseCase } from "../factories/make-create";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedAlreadyExistsError } from "../errors/breed-already-exists";
import { auth } from "@/modules/shared/auth/plugin";

export const createBreed = new Elysia()
  .use(auth())
  .error({
    SpecieNotFoundError,
    BreedAlreadyExistsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieNotFoundError":
        set.status = "Bad Request";
        return error;
      case "BreedAlreadyExistsError":
        set.status = "Conflict";
        return error;
    }
  })
  .post(
    "/breeds",
    async ({ body, set }) => {
      const createBreedUseCase = makeCreateBreedUseCase();

      const createdBreed = await createBreedUseCase.execute(body);

      set.status = "Created";
      return createdBreed;
    },
    {
      body: createBreedSchema,
      auth: true,
      detail: {
        tags: ["Pet"],
      },
    },
  );
