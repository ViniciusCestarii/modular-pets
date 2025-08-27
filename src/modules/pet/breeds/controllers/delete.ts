import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import { auth } from "@/utils/auth/plugin";
import Elysia, { t } from "elysia";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { swaggerBreedNotFoundErrorSchema } from "../../shared/schema";
import { makeDeleteBreedUseCase } from "../factories/make-delete";

export const deleteBreed = new Elysia()
  .use(auth())
  .error({
    BreedNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "BreedNotFoundError":
        set.status = "Not Found";
        return error;
    }
  })
  .delete(
    "/breeds/:id",
    async ({ params, set }) => {
      const deleteBreedUseCase = makeDeleteBreedUseCase();

      await deleteBreedUseCase.execute(params.id);

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
        summary: "Delete a breed",
        description: "Delete a breed by its id",
        tags: ["Pet"],
        responses: {
          204: {
            description: "Success",
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
                schema: swaggerBreedNotFoundErrorSchema,
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
