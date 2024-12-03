import Elysia from "elysia";
import { createSpecieSchema } from "../schema";
import { makeCreateSpecieUseCase } from "../factories/make-create";
import { SpecieAlredyExistsError } from "../errors/specie-alredy-exists";

export const createSpecie = new Elysia()
  .error({
    SpecieAlredyExistsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "SpecieAlredyExistsError":
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
    },
  );
