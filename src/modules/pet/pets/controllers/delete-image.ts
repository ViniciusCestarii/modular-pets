import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";
import { ImageNotFoundError } from "@/modules/shared/images/errors/image-not-found";
import { auth } from "@/utils/auth/plugin";
import Elysia, { t } from "elysia";
import { makeDeleteImagePetsUseCase } from "../factories/make-delete-image";

export const deletePetImage = new Elysia()
  .use(auth)
  .error({
    ImageNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "ImageNotFoundError":
        set.status = "Not Found";
        return error;
    }
  })
  .delete(
    "/pets/images/:id",
    async ({ params, set }) => {
      const deletePetImageUseCase = makeDeleteImagePetsUseCase();

      const image = await deletePetImageUseCase.execute(params.id);

      set.status = "No Content";

      return image;
    },
    {
      auth: true,
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      detail: {
        summary: "Delete pet image",
        description: "Delete a pet image",
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
            description: "Image not found",
          },
          422: {
            description: "Validation Error",
          },
        },
      },
    },
  );
