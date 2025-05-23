import Elysia, { t } from "elysia";
import { PetNotFoundError } from "../errors/pet-not-found";
import { makeFindPetByIdUseCase } from "../factories/make-find-by-id";
import { swaggerErrorPetNotFoundSchema, swaggerViewPetSchema } from "../schema";

export const findPetById = new Elysia()
  .error({
    PetNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "PetNotFoundError":
        set.status = "Not Found";
        return error;
    }
  })
  .get(
    "/pets/:id",
    async ({ params }) => {
      const findPetByIdUseCase = makeFindPetByIdUseCase();

      const pet = await findPetByIdUseCase.execute(params.id);

      return pet;
    },
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      detail: {
        summary: "Find pet by id",
        description: "Find a pet by its id",
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
          404: {
            description: "Pet not found",
            content: {
              "application/json": {
                schema: swaggerErrorPetNotFoundSchema,
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
