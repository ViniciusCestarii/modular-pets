import { UpdateSpecieUseCase } from "./update";
import { InMemorySpeciesRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { UpdateSpecie } from "../types";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";

describe("Update specie use case", () => {
  let updateSpecieUseCase: UpdateSpecieUseCase;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    updateSpecieUseCase = new UpdateSpecieUseCase(inMemorySpeciesRepository);
  });

  it("should update a specie", async () => {
    const createdSpecie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const specie: UpdateSpecie = {
      id: createdSpecie.id,
      name: "Cat",
    };

    const updatedSpecie = await updateSpecieUseCase.execute(specie);

    expect(updatedSpecie).toMatchObject(specie);
  });

  it("should throw SpecieNotFoundError when trying to update a specie that does not exist", async () => {
    const specie: UpdateSpecie = {
      id: "123",
      name: "Dog",
    };

    expect(updateSpecieUseCase.execute(specie)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });
});
