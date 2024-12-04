import { CreateSpecieUseCase } from "./create";
import { InMemorySpeciesRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreateSpecie } from "../types";
import { SpecieAlreadyExistsError } from "../errors/specie-alredy-exists";

describe("Create specie use case", () => {
  let createSpecieUseCase: CreateSpecieUseCase;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;

  beforeEach(() => {
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    createSpecieUseCase = new CreateSpecieUseCase(inMemorySpeciesRepository);
  });

  it("should create a new specie", async () => {
    const specie: CreateSpecie = {
      name: "Dog",
    };

    const createdSpecie = await createSpecieUseCase.execute(specie);

    expect(createdSpecie).toHaveProperty("id");
    expect(createdSpecie.name).toBe(specie.name);
  });

  it("should throw SpecieAlreadyExistsError when creating a specie that already exists", async () => {
    await inMemorySpeciesRepository.createSpecie({ name: "Dog" });

    const specie: CreateSpecie = {
      name: "Dog",
    };

    expect(createSpecieUseCase.execute(specie)).rejects.toThrowError(
      SpecieAlreadyExistsError,
    );
  });
});
