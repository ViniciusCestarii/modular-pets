import Elysia from "elysia";
import { createSpecieSchema } from "../schema";
import { makeCreateSpecieUseCase } from "../factories/make-create";
import { SpecieAlreadyExistsError } from "../errors/specie-alredy-exists";

export const createSpecie = new Elysia()
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
    "/specie",
    async ({ body, set }) => {
      const createSpecieUseCase = makeCreateSpecieUseCase();

      const createdSpecie = await createSpecieUseCase.execute(body);

      set.status = "Created";
      return createdSpecie;
    },
    {
      body: createSpecieSchema,
    },
  );
