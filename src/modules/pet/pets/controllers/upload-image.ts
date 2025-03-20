import Elysia, { t } from "elysia";
import { makeUploadImagePetsUseCase } from "../factories/make-upload-image";
import { PetNotFoundError } from "../errors/pet-not-found";
import { auth } from "@/utils/auth/plugin";
import { swaggerImageSchema } from "@/modules/shared/images/schema";
import { swaggerErrorPetNotFoundSchema } from "../schema";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";

export const uploadPetImage = new Elysia()
  .use(auth)
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
  .post(
    "/pets/:id/images",
    async ({ params, body, set }) => {
      const uploadPetImageUseCase = makeUploadImagePetsUseCase();

      const image = await uploadPetImageUseCase.execute(params.id, body.image);

      set.status = "Created";

      return image;
    },
    {
      auth: true,
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      body: t.Object({
        image: t.File({ format: "image/*" }),
      }),
      detail: {
        summary: "Upload pet image",
        description: "Upload a new image for a pet",
        tags: ["Pet"],
        responses: {
          201: {
            description: "Success",
            content: {
              "application/json": {
                schema: swaggerImageSchema,
              },
            },
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
