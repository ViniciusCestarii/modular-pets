import { InMemorySpeciesRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { UpdateSpecie } from "../types";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { DeleteSpecieUseCase } from "./delete";

describe("Delete specie use case", () => {
  let deleteSpecieUseCase: DeleteSpecieUseCase;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    deleteSpecieUseCase = new DeleteSpecieUseCase(inMemorySpeciesRepository);
  });

  it("should delete a specie", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    expect(deleteSpecieUseCase.execute(specie.id)).resolves.toBeUndefined();
  });

  it("should throw SpecieNotFoundError when trying to delete a specie that does not exist", async () => {
    const specie: UpdateSpecie = {
      id: "123",
      name: "Dog",
    };

    expect(deleteSpecieUseCase.execute(specie.id)).rejects.toThrowError(
      SpecieNotFoundError,
    );
  });
});
