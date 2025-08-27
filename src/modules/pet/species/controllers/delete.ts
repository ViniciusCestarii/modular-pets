import Elysia, { t } from "elysia";
import { swaggerSpecieSchema } from "../schema";
import { makeDeleteSpecieUseCase } from "../factories/make-delete";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import { swaggerSpecieNotFoundErrorSchema } from "../../shared/schema";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";

export const deleteSpecie = new Elysia()
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
  .delete(
    "/species/:id",
    async ({ params, set }) => {
      const deleteSpecieUseCase = makeDeleteSpecieUseCase();

      await deleteSpecieUseCase.execute(params.id);

      set.status = "No Content";
    },
    {
      auth: true,
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      detail: {
        summary: "Delete specie",
        description: "Delete a specie",
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
