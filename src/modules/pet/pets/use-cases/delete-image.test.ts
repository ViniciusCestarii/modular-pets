import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { DeletePetImageUseCase } from "./delete-image";
import { InMemoryImagesRepository } from "@/modules/shared/images/repositories/in-memory-repository";
import { dogImageFile } from "@/test";
import { ImageNotFoundError } from "@/modules/shared/images/errors/image-not-found";

describe("Delete pet image use case", () => {
  let deleteImagePetUseCase: DeletePetImageUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemoryImagesRepository: InMemoryImagesRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryImagesRepository = new InMemoryImagesRepository();
    deleteImagePetUseCase = new DeletePetImageUseCase(inMemoryImagesRepository);
  });

  it("should delete an image", async () => {
    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const image = await inMemoryImagesRepository.uploadImage(
      {
        ownerId: pet.id,
        ownerType: "pet",
      },
      dogImageFile,
    );

    expect(deleteImagePetUseCase.execute(image.id)).pass();
  });

  it("should throw ImageNotFound when trying to delete an image that doens't exist", async () => {
    expect(
      deleteImagePetUseCase.execute("00000000-0000-0000-0000-000000000000"),
    ).rejects.toThrowError(ImageNotFoundError);
  });
});
