import { DeletePetImageUseCase } from "../use-cases/delete-image";
import { makeImageRespository } from "@/modules/shared/images/factories/make-image-repository";

export const makeDeleteImagePetsUseCase = () => {
  const imageRepository = makeImageRespository();

  const useCase = new DeletePetImageUseCase(imageRepository);

  return useCase;
};
