import Elysia, { t } from "elysia";
import { swaggerSpecieSchema } from "../schema";
import { makeFindAllSpecieUseCase } from "../factories/make-find-all";

export const findAllSpecies = new Elysia().get(
  "/species",
  async ({ set }) => {
    const findAllSpecieUseCase = makeFindAllSpecieUseCase();

    const createdSpecie = await findAllSpecieUseCase.execute();

    set.status = "OK";
    return createdSpecie;
  },
  {
    detail: {
      summary: "Find all species",
      description: "Find all species",
      tags: ["Pet"],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: t.Array(swaggerSpecieSchema),
            },
          },
        },
      },
    },
  },
);
