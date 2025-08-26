import { BreedsRepository } from "../../breeds/repository";
import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { InvalidBreedSpecieError } from "../../shared/errors/invalid-breed-specie";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../../species/repository";
import { PetNotFoundError } from "../errors/pet-not-found";
import { PetsRepository } from "../repository";
import { UpdatePet, Pet } from "../types";

export class UpdatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private speciesRepository: SpeciesRepository,
    private breedsRepository: BreedsRepository,
  ) {}

  async execute(updatePet: UpdatePet): Promise<Pet> {
    const pet = await this.petsRepository.findPetById(updatePet.id);

    if (!pet) {
      throw new PetNotFoundError();
    }

    const specie = await this.speciesRepository.findSpecieById(
      updatePet.specieId,
    );

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    const breed = await this.breedsRepository.findBreedById(updatePet.breedId);

    if (!breed) {
      throw new BreedNotFoundError();
    }

    if (breed.specieId !== specie.id) {
      throw new InvalidBreedSpecieError();
    }

    const updatedPet = await this.petsRepository.updatePet(updatePet);

    return updatedPet;
  }
}
