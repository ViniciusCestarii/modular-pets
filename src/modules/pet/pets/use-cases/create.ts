import { BreedsRepository } from "../../breeds/repository";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../../species/repository";
import { PetsRepository } from "../repository";
import { CreatePet, Pet } from "../types";

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private speciesRepository: SpeciesRepository,
    private breedsRepository: BreedsRepository,
  ) {}

  async execute(pet: CreatePet): Promise<Pet> {
    const specie = await this.speciesRepository.findSpecieById(pet.specieId);

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    const breed = await this.breedsRepository.findBreedById(pet.breedId);

    if (!breed) {
      throw new BreedNotFoundError();
    }

    if (breed.specieId !== specie.id) {
      throw new InvalidBreedSpecieError();
    }

    const createdPet = await this.petsRepository.createPet(pet);

    return createdPet;
  }
}
