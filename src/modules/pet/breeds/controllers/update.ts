import Elysia from "elysia";
import { swaggerBreedSchema, updateBreedSchema } from "../schema";
import { makeUpdateBreedUseCase } from "../factories/make-update";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import {
  swaggerBreedNotFoundErrorSchema,
  swaggerSpecieNotFoundErrorSchema,
} from "../../shared/schema";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";

export const updateBreed = new Elysia()
  .use(auth())
  .error({
    BreedNotFoundError,
    SpecieNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "BreedNotFoundError":
        set.status = "Not Found";
        return error;
      case "SpecieNotFoundError":
        set.status = "Bad Request";
        return error;
    }
  })
  .put(
    "/breeds",
    async ({ body, set }) => {
      const updateBreedUseCase = makeUpdateBreedUseCase();

      const updatedBreed = await updateBreedUseCase.execute(body);

      set.status = "OK";
      return updatedBreed;
    },
    {
      body: updateBreedSchema,
      auth: true,
      detail: {
        summary: "Update breed",
        description: "Update a breed",
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
          400: {
            description: "Specie not found",
            content: {
              "application/json": {
                schema: swaggerBreedNotFoundErrorSchema,
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
            description: "Breed not found",
            content: {
              "application/json": {
                schema: swaggerSpecieNotFoundErrorSchema,
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
