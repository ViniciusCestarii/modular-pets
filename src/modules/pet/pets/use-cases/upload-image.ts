import { Pet } from "../types";
import { ImagesRepository } from "@/modules/shared/images/repository";
import { Image } from "@/modules/shared/images/types";
import { PetsRepository } from "../repository";
import { PetNotFoundError } from "../errors/pet-not-found";

export class UploadPetImageUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  // I could add custom logic like resizing, filters, storaging multiple sizes, etc.
  async execute(petId: Pet["id"], image: File): Promise<Image> {
    const pet = await this.petsRepository.findPetById(petId);

    if (!pet) {
      throw new PetNotFoundError();
    }

    const uploadedImage = await this.imagesRepository.uploadImage(
      {
        ownerId: petId,
        ownerType: "pet",
      },
      image,
    );

    return uploadedImage;
  }
}
