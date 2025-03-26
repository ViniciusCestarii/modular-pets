import { FindAllSpecieUseCase } from "./find-all";
import { InMemorySpeciesRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";

describe("Find all species use case", () => {
  let findAllSpecieUseCase: FindAllSpecieUseCase;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    findAllSpecieUseCase = new FindAllSpecieUseCase(inMemorySpeciesRepository);
  });

  it("should find all species", async () => {
    inMemorySpeciesRepository.createSpecie({
      name: "Cat",
    });

    inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const species = await findAllSpecieUseCase.execute();

    expect(species).toHaveLength(2);
  });
});
