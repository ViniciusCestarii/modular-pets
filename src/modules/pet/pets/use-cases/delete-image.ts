import { ImageNotFoundError } from "@/modules/shared/images/errors/image-not-found";
import { ImagesRepository } from "@/modules/shared/images/repository";
import { Image } from "@/modules/shared/images/types";

export class DeletePetImageUseCase {
  constructor(private imagesRepository: ImagesRepository) {}

  async execute(imageId: Image["id"]): Promise<void> {
    const image = await this.imagesRepository.getImageById("pet", imageId);

    if (!image) {
      throw new ImageNotFoundError();
    }

    await this.imagesRepository.deleteImage("pet", imageId);
  }
}
