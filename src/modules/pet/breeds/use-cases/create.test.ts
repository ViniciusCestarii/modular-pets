import { CreateBreedUseCase } from "./create";
import { InMemoryBreedsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreateBreed } from "../types";

describe("Create breed use case", () => {
  let createBreedUseCase: CreateBreedUseCase;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    createBreedUseCase = new CreateBreedUseCase(inMemoryBreedsRepository);
  });
  // TODO: Test if breed already exists and if species exists

  it("should create a new breed", async () => {
    const breed: CreateBreed = {
      name: "Buddy",
      speciesId: "1",
    };

    const createdBreed = await createBreedUseCase.execute(breed);

    expect(createdBreed).toHaveProperty("id");
    expect(createdBreed.name).toBe(breed.name);
  });
});
