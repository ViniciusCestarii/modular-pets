import Elysia, { t } from "elysia";
import { makeUploadImagePetsUseCase } from "../factories/make-upload-image";
import { PetNotFoundError } from "../errors/pet-not-found";
import { auth } from "@/modules/shared/auth/plugin";

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
        tags: ["Pet"],
      },
    },
  );
