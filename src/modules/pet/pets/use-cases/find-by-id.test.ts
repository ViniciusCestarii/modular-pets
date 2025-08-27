import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { InMemoryBreedsRepository } from "../../breeds/repositories/in-memory-repository";
import { FindPetByIdUseCase } from "./find-by-id";
import { PetNotFoundError } from "../errors/pet-not-found";

describe("Find pet by id use case", () => {
  let findPetById: FindPetByIdUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    findPetById = new FindPetByIdUseCase(inMemoryPetsRepository);
  });

  it("should create a new pet", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const petToCreate: CreatePet = {
      name: "Nina",
      status: "ACTIVE",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const newPet = await inMemoryPetsRepository.createPet(petToCreate);

    const pet = await findPetById.execute(newPet.id);

    expect(pet).toMatchObject({
      id: newPet.id,
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    });
  });

  it("should throw PetNotFound when trying to find a pet that doens't exist", async () => {
    expect(
      findPetById.execute("00000000-0000-0000-0000-000000000000"),
    ).rejects.toThrowError(PetNotFoundError);
  });
});
