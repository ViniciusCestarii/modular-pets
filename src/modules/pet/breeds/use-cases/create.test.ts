import { CreateBreedUseCase } from "./create";
import { InMemoryBreedsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreateBreed } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedAlreadyExistsError } from "../errors/breed-already-exists";

describe("Create breed use case", () => {
  let createBreedUseCase: CreateBreedUseCase;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    createBreedUseCase = new CreateBreedUseCase(
      inMemoryBreedsRepository,
      inMemorySpeciesRepository,
    );
  });

  it("should create a new breed", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed: CreateBreed = {
      name: "German Shepherd",
      speciesId: specie.id,
    };

    const createdBreed = await createBreedUseCase.execute(breed);

    expect(createdBreed).toMatchObject({
      id: expect.any(String),
      name: "German Shepherd",
      speciesId: specie.id,
    });
  });

  it("should throw SpecieNotFound when trying to create a breed with a non-existent specie id", async () => {
    const breed: CreateBreed = {
      name: "German Shepherd",
      speciesId: "NonExistentId",
    };

    expect(createBreedUseCase.execute(breed)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });

  it("should throw BreedAlreadyExistsError when creating a breed that already exists", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const breed: CreateBreed = {
      name: "German Shepherd",
      speciesId: specie.id,
    };

    expect(createBreedUseCase.execute(breed)).rejects.toThrowError(
      BreedAlreadyExistsError,
    );
  });
});
