import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { UploadPetImageUseCase } from "./upload-image";
import { InMemoryImagesRepository } from "@/modules/shared/images/repositories/in-memory-repository";
import { dogImageFile } from "@/test";
import { PetNotFoundError } from "../errors/pet-not-found";

describe("Create pet use case", () => {
  let uploadImagePetUseCase: UploadPetImageUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemoryImagesRepository: InMemoryImagesRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryImagesRepository = new InMemoryImagesRepository();
    uploadImagePetUseCase = new UploadPetImageUseCase(
      inMemoryPetsRepository,
      inMemoryImagesRepository,
    );
  });

  it("should create a new image", async () => {
    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const image = await uploadImagePetUseCase.execute(pet.id, dogImageFile);

    expect(image).toMatchObject({
      id: expect.any(String),
      src: expect.any(String),
      ownerId: pet.id,
      ownerType: "pet",
    });
  });

  it("should throw PetNotFound when trying to upload an image to a pet that doens't exist", async () => {
    expect(
      uploadImagePetUseCase.execute(
        "00000000-0000-0000-0000-000000000000",
        dogImageFile,
      ),
    ).rejects.toThrowError(PetNotFoundError);
  });
});
