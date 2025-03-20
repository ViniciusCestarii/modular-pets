import { UploadPetImageUseCase } from "../use-cases/upload-image";
import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { makeImageRespository } from "@/modules/shared/images/factories/make-image-repository";

export const makeUploadImagePetsUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const imageRepository = makeImageRespository();

  const useCase = new UploadPetImageUseCase(
    drizzlePetsRepository,
    imageRepository,
  );

  return useCase;
};
