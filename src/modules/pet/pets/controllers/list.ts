import Elysia from "elysia";
import { listPetsSchema, swaggerPetSchema } from "../schema";
import { makeListPetsUseCase } from "../factories/make-list";

export const listPets = new Elysia().get(
  "/pets",
  async ({ query }) => {
    const listPetsUseCase = makeListPetsUseCase();

    const pets = await listPetsUseCase.execute(query);

    return pets;
  },
  {
    query: listPetsSchema,
    detail: {
      summary: "List pets",
      description: "List paginated pets",
      tags: ["Pet"],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["pets", "total"],
                properties: {
                  pets: {
                    type: "array",
                    items: swaggerPetSchema,
                  },
                  total: {
                    type: "integer",
                    description: "Total number of pets in the database",
                    example: 100,
                  },
                },
              },
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
