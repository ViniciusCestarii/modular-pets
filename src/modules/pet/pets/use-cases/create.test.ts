import { CreatePetUseCase } from "./create";
import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, test } from "bun:test";
import { CreatePet } from "../types";

describe("Create pet use case", () => {
  let createPetUseCase: CreatePetUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    createPetUseCase = new CreatePetUseCase(inMemoryPetsRepository);
  });

  test("should create a new pet", async () => {
    const pet: CreatePet = {
      name: "Buddy",
      birthdate: "2021-01-01",
    };

    const createdPet = await createPetUseCase.execute(pet);

    expect(createdPet).toHaveProperty("id");
    expect(createdPet.name).toBe(pet.name);
  });
});
