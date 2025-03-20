import Elysia from "elysia";
import {
  swaggerBreedSchema,
  createBreedSchema,
  swaggerBreedAlreadyExistsSchema,
} from "../schema";
import { makeCreateBreedUseCase } from "../factories/make-create";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedAlreadyExistsError } from "../errors/breed-already-exists";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";

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
        summary: "Create breed",
        description: "Create a new breed",
        tags: ["Pet"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: swaggerBreedSchema,
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: swaggerUnauthorizedSchema,
              },
            },
          },
          409: {
            description: "Breed already exists",
            content: {
              "application/json": {
                schema: swaggerBreedAlreadyExistsSchema,
              },
            },
          },
          422: {
            description: "Validation error",
          },
        },
      },
    },
  );
