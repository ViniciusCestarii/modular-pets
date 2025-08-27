import { ListPetsUseCase } from "./list";
import { InMemoryPetsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePet } from "../types";
import { InMemorySpeciesRepository } from "../../species/repositories/in-memory-repository";
import { InMemoryBreedsRepository } from "../../breeds/repositories/in-memory-repository";

describe("Create pet use case", () => {
  let listPetUseCase: ListPetsUseCase;
  let inMemoryPetsRepository: InMemoryPetsRepository;
  let inMemorySpeciesRepository: InMemorySpeciesRepository;
  let inMemoryBreedsRepository: InMemoryBreedsRepository;

  beforeEach(() => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemorySpeciesRepository = new InMemorySpeciesRepository();
    inMemoryBreedsRepository = new InMemoryBreedsRepository();
    listPetUseCase = new ListPetsUseCase(
      inMemoryPetsRepository,
      inMemorySpeciesRepository,
      inMemoryBreedsRepository,
    );
  });

  it("should create a new pet", async () => {
    const specie = await inMemorySpeciesRepository.createSpecie({
      name: "Dog",
    });

    const breed = await inMemoryBreedsRepository.createBreed({
      name: "German Shepherd",
      specieId: specie.id,
    });

    const pet: CreatePet = {
      name: "Nina",
      status: "ACTIVE",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    };

    await inMemoryPetsRepository.createPet(pet);

    const paginatedPets = await listPetUseCase.execute({
      page: 1,
      pageSize: 10,
    });

    expect(paginatedPets.pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      breedId: breed.id,
      specieId: specie.id,
    });

    expect(paginatedPets.total).toBe(1);
  });
});
