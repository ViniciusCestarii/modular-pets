import { CreatePetUseCase } from "./create";
import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { InMemoryBreedsRepository } from "../../breeds/repositories/in-memory-repository";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";

describe("Create pet use case", () => {
  let createPetUseCase: CreatePetUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    createPetUseCase = new CreatePetUseCase(
      inMemoryPetsRepository,
      inMemorySpeciesRepository,
      inMemoryBreedsRepository,
    );
  });

  it("should create a new pet", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const pet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      observations: "She's a very playful dog",
      sex: "FEMALE",
      breedId: breed.id,
      speciesId: specie.id,
    };

    const createdPet = await createPetUseCase.execute(pet);

    expect(createdPet).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      observations: "She's a very playful dog",
      sex: "FEMALE",
      breedId: breed.id,
      speciesId: specie.id,
    });
  });

  it("should throw SpecieNotFound when creating with invalid specie id", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const pet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      breedId: breed.id,
      speciesId: "NonExistentSpecieId",
    };

    expect(createPetUseCase.execute(pet)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });

  it("should throw BreedNotFoundError when creating with invalid breed id", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const pet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      breedId: "NonExistentBreedId",
      speciesId: specie.id,
    };

    expect(createPetUseCase.execute(pet)).rejects.toThrowError(
      BreedNotFoundError,
    );
  });

  it("should throw InvalidBreedSpecieError when creating with invalid breed specieId", async () => {
    const specieDog = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const specieCat = await inMemorySpeciesRepository.createSpecie({
      name: "Cat",
    });

    const breedCat = await inMemoryBreedsRepository.createBreed({
      name: "Siamese",
      speciesId: specieCat.id,
    });

    const pet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      speciesId: specieDog.id,
      breedId: breedCat.id,
    };

    expect(createPetUseCase.execute(pet)).rejects.toThrowError(
      InvalidBreedSpecieError,
    );
  });
});
