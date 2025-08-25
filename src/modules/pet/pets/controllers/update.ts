import Elysia from "elysia";
import { updatePetSchema, swaggerViewPetSchema } from "../schema";
import { makeUpdatePetUseCase } from "../factories/make-update";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import {
  swaggerBreedNotFoundErrorSchema,
  swaggerInvalidBreedSpecieErrorSchema,
  swaggerSpecieNotFoundErrorSchema,
} from "../../shared/schema";
import { PetNotFoundError } from "../errors/pet-not-found";

export const updatePet = new Elysia()
  .use(auth())
  .error({
    SpecieNotFoundError,
    BreedNotFoundError,
    InvalidBreedSpecieError,
    PetNotFoundError,
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
      case "PetNotFoundError":
        set.status = "Not Found";
        return error;
    }
  })
  .put(
    "/pets",
    async ({ body, set }) => {
      const updatePetUseCase = makeUpdatePetUseCase();

      const updatedPet = await updatePetUseCase.execute(body);

      set.status = "OK";
      return updatedPet;
    },
    {
      body: updatePetSchema,
      auth: true,
      detail: {
        summary: "Update pet",
        description: "Update a pet",
        tags: ["Pet"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: swaggerViewPetSchema,
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    swaggerSpecieNotFoundErrorSchema,
                    swaggerBreedNotFoundErrorSchema,
                    swaggerInvalidBreedSpecieErrorSchema,
                  ],
                },
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
          404: {
            description: "Not Found",
          },
          422: {
            description: "Validation Error",
          },
        },
      },
    },
  );
