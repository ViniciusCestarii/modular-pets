import { FindAllBreedsBySpecieUseCase } from "./find-all-by-specie";
import { InMemoryBreedsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";

describe("Find all breeds by specie use case", () => {
  let findAllBreedsBySpecieUseCase: FindAllBreedsBySpecieUseCase;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    findAllBreedsBySpecieUseCase = new FindAllBreedsBySpecieUseCase(
      inMemoryBreedsRepository,
      inMemorySpeciesRepository,
    );
  });

  it("should find all breeds by specie", async () => {
    const specieDog = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const specieCat = await inMemorySpeciesRepository.createSpecie({
      name: "Cat",
    });

    const dog1 = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      speciesId: specieDog.id,
    });

    const dog2 = await inMemoryBreedsRepository.createBreed({
      name: "Labrador Retriever",
      speciesId: specieDog.id,
    });

    await inMemoryBreedsRepository.createBreed({
      name: "Maine Coon",
      speciesId: specieCat.id,
    });

    const breedsFound = await findAllBreedsBySpecieUseCase.execute(
      specieDog.id,
    );

    expect(breedsFound).toBeArray();
    expect(breedsFound.length).toBe(2);
    expect(breedsFound[0]).toMatchObject(dog1);
    expect(breedsFound[1]).toMatchObject(dog2);
  });

  it("should throw SpecieNotFound when trying to find breeds with a non-existent specie id", async () => {
    expect(
      findAllBreedsBySpecieUseCase.execute("NonExistentId"),
    ).rejects.toThrowError(SpecieNotFoundError);
  });
});
