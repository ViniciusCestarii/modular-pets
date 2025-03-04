import Elysia, { t } from "elysia";
import { PetNotFoundError } from "../errors/pet-not-found";
import { makeFindPetByIdUseCase } from "../factories/make-find-by-id";

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
    },
  );
