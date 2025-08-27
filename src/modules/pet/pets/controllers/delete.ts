import Elysia, { t } from "elysia";
import { PetNotFoundError } from "../errors/pet-not-found";
import { swaggerErrorPetNotFoundSchema } from "../schema";
import { makeDeletePetUseCase } from "../factories/make-delete";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";

export const deletePet = new Elysia()
  .use(auth())
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
  .delete(
    "/pets/:id",
    async ({ set, params }) => {
      const deletePetUseCase = makeDeletePetUseCase();

      await deletePetUseCase.execute(params.id);

      set.status = "No Content";
    },
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      detail: {
        summary: "Delete pet",
        description: "Delete a pet by its id",
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
