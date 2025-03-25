import { UpdateBreedUseCase } from "./update";
import { InMemoryBreedsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { UpdateBreed } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";

describe("Update breed use case", () => {
  let updateBreedUseCase: UpdateBreedUseCase;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    updateBreedUseCase = new UpdateBreedUseCase(
      inMemoryBreedsRepository,
      inMemorySpeciesRepository,
    );
  });

  it("should update a breed", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const breedToUpdate: UpdateBreed = {
      id: breed.id,
      name: "Pug",
      speciesId: specie.id,
    };

    const updatedBreed = await updateBreedUseCase.execute(breedToUpdate);

    expect(updatedBreed).toMatchObject(breedToUpdate);
  });

  it("should throw BreedNotFoundError when trying to update a breed with a non-existent specie id", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const breedToUpdate: UpdateBreed = {
      id: "NonExistentId",
      name: "German Shepherd",
      speciesId: specie.id,
    };

    expect(updateBreedUseCase.execute(breedToUpdate)).rejects.toThrowError(
      BreedNotFoundError,
    );
  });

  it("should throw SpecieNotFoundError when trying to update a breed that doesn't exist", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const breedToUpdate: UpdateBreed = {
      id: breed.id,
      name: "German Shepherd",
      speciesId: "NonExistentId",
    };

    expect(updateBreedUseCase.execute(breedToUpdate)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });
});
