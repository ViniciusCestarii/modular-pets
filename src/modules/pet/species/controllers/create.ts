import Elysia from "elysia";
import { createSpecieSchema, swaggerSpecieSchema } from "../schema";
import { makeCreateSpecieUseCase } from "../factories/make-create";
import { SpecieAlreadyExistsError } from "../errors/specie-alredy-exists";
import { auth } from "@/modules/shared/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import { swaggerSpecieNotFoundErrorSchema } from "../../shared/schema";

export const createSpecie = new Elysia()
  .use(auth())
  .error({
    SpecieAlreadyExistsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieAlreadyExistsError":
        set.status = "Conflict";
        return error;
    }
  })
  .post(
    "/species",
    async ({ body, set }) => {
      const createSpecieUseCase = makeCreateSpecieUseCase();

      const createdSpecie = await createSpecieUseCase.execute(body);

      set.status = "Created";
      return createdSpecie;
    },
    {
      body: createSpecieSchema,
      auth: true,
      detail: {
        summary: "Create specie",
        description: "Create a new specie",
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
          409: {
            description: "Specie already exists",
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
