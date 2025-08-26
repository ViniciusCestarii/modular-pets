import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { InMemoryBreedsRepository } from "../../breeds/repositories/in-memory-repository";
import { PetNotFoundError } from "../errors/pet-not-found";
import { DeletePetUseCase } from "./delete";

describe("Delete pet use case", () => {
  let deletePet: DeletePetUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    deletePet = new DeletePetUseCase(inMemoryPetsRepository);
  });

  it("should delete a pet", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const petToCreate: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const newPet = await inMemoryPetsRepository.createPet(petToCreate);

    expect(deletePet.execute(newPet.id)).resolves.toBeUndefined();
  });

  it("should throw PetNotFound when trying to delete a pet that doens't exist", async () => {
    expect(
      deletePet.execute("00000000-0000-0000-0000-000000000000"),
    ).rejects.toThrowError(PetNotFoundError);
  });
});
