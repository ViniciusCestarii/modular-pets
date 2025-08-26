import { InMemoryBreedsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { DeleteBreedUseCase } from "./delete";

describe("Delete breed use case", () => {
  let deleteBreedUseCase: DeleteBreedUseCase;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    deleteBreedUseCase = new DeleteBreedUseCase(
      inMemoryBreedsRepository,
      inMemorySpeciesRepository,
    );
  });

  it("should delete a breed", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    expect(deleteBreedUseCase.execute(breed.id)).resolves.toBeUndefined();
  });

  it("should throw BreedNotFoundError when trying to delete a breed that doesn't exist", async () => {
    expect(
      deleteBreedUseCase.execute("3ab4ee9f-e37b-4a1c-be3c-9915d39f092d"),
    ).rejects.toThrowError(BreedNotFoundError);
  });
});
