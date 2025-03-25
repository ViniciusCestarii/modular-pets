import Elysia from "elysia";
import { updateSpecieSchema, swaggerSpecieSchema } from "../schema";
import { makeUpdateSpecieUseCase } from "../factories/make-update";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import { swaggerSpecieNotFoundErrorSchema } from "../../shared/schema";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";

export const updateSpecie = new Elysia()
  .use(auth())
  .error({
    SpecieNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieNotFoundError":
        set.status = "Not Found";
        return error;
    }
  })
  .put(
    "/species",
    async ({ body, set }) => {
      const updateSpecieUseCase = makeUpdateSpecieUseCase();

      const updatedSpecie = await updateSpecieUseCase.execute(body);

      set.status = "OK";
      return updatedSpecie;
    },
    {
      body: updateSpecieSchema,
      auth: true,
      detail: {
        summary: "Update specie",
        description: "Update a specie",
        tags: ["Pet"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: swaggerSpecieSchema,
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
            description: "Specie not found",
            content: {
              "application/json": {
                schema: swaggerSpecieNotFoundErrorSchema,
              },
            },
          },
          422: {
            description: "Validation Error",
          },
        },
      },
    },
  );
