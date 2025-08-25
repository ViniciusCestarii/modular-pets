import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryBreedsRepository } from "../../breeds/repositories/in-memory-repository";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { CreatePet, UpdatePet } from "../types";
import { UpdatePetUseCase } from "./update";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { PetNotFoundError } from "../errors/pet-not-found";

describe("Update pet use case", () => {
  let updatePetUseCase: UpdatePetUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    updatePetUseCase = new UpdatePetUseCase(
      inMemoryPetsRepository,
      inMemorySpeciesRepository,
      inMemoryBreedsRepository,
    );
  });

  it("should update a pet", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const petToUpdate: UpdatePet = {
      ...pet,
      mainImageId: pet.mainImageId ?? undefined,
      observations: "She's a very playful dog and loves to swim",
    };

    const updatedPet = await updatePetUseCase.execute(petToUpdate);

    expect(updatedPet).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog and loves to swim",
      breedId: breed.id,
      specieId: specie.id,
    });
  });

  it("should throw SpecieNotFound when updating with invalid specie id", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const petToUpdate: UpdatePet = {
      ...pet,
      observations: pet.observations ?? undefined,
      mainImageId: pet.mainImageId ?? undefined,
      specieId: "NonExistentSpecieId",
    };

    expect(updatePetUseCase.execute(petToUpdate)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });

  it("should throw BreedNotFoundError when updating with invalid breed id", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const petToUpdate: UpdatePet = {
      ...pet,
      observations: pet.observations ?? undefined,
      mainImageId: pet.mainImageId ?? undefined,
      breedId: "NonExistentBreedId",
    };

    expect(updatePetUseCase.execute(petToUpdate)).rejects.toThrowError(
      BreedNotFoundError,
    );
  });

  it("should throw InvalidBreedSpecieError when creating with invalid breed specieId", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const anotherSpecie = await inMemorySpeciesRepository.createSpecie({
      name: "Cat",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    const pet = await inMemoryPetsRepository.createPet(createPet);

    const petToUpdate: UpdatePet = {
      ...pet,
      observations: pet.observations ?? undefined,
      mainImageId: pet.mainImageId ?? undefined,
      specieId: anotherSpecie.id,
    };

    expect(updatePetUseCase.execute(petToUpdate)).rejects.toThrowError(
      InvalidBreedSpecieError,
    );
  });

  it("should throw PetNotFoundError when trying to update a non-existent pet", async () => {
    const petToUpdate: UpdatePet = {
      id: "NonExistentPetId",
      name: "Nina",
      birthdate: "2021-01-01",
      breedId: "SomeBreedId",
      specieId: "SomeSpecieId",
      sex: "UNKNOWN",
      mainImageId: "SomeImageId",
    };

    expect(updatePetUseCase.execute(petToUpdate)).rejects.toThrowError(
      PetNotFoundError,
    );
  });
});
