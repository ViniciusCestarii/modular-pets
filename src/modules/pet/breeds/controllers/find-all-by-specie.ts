import Elysia, { t } from "elysia";
import { swaggerBreedSchema } from "../schema";
import { makeFindAllBreedsBySpecieUseCase } from "../factories/make-find-all-by-specie";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { swaggerSpecieNotFoundErrorSchema } from "../../shared/schema";

export const findAllBreedsBySpecie = new Elysia()
  .error({
    SpecieNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieNotFoundError":
        set.status = "Bad Request";
        return error;
    }
  })
  .get(
    "/species/:id/breeds",
    async ({ params, set }) => {
      const findAllBreedsBySpecieUseCase = makeFindAllBreedsBySpecieUseCase();

      const createdBreed = await findAllBreedsBySpecieUseCase.execute(
        params.id,
      );

      set.status = "OK";
      return createdBreed;
    },
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      detail: {
        summary: "Find all breeds by specie",
        description: "Find all breeds by specie",
        tags: ["Pet"],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: t.Array(swaggerBreedSchema),
              },
            },
          },
          400: {
            description: "Specie not found",
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
