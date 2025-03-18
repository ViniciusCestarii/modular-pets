import { DbImagesRepository } from "@/modules/shared/images/repositories/db-repository";
import { UploadPetImageUseCase } from "../use-cases/upload-image";
import { DrizzlePetsRepository } from "../repositories/drizzle-repository";

export const makeUploadImagePetsUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const dbImageRepository = new DbImagesRepository();

  const useCase = new UploadPetImageUseCase(
    drizzlePetsRepository,
    dbImageRepository,
  );

  return useCase;
};
