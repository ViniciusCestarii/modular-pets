import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../../species/repository";
import { BreedsRepository } from "../repository";
import { UpdateBreed, Breed } from "../types";

export class UpdateBreedUseCase {
  constructor(
    private breedsRepository: BreedsRepository,
    private speciesRepository: SpeciesRepository,
  ) {}

  async execute(breed: UpdateBreed): Promise<Breed> {
    const existingBreed = await this.breedsRepository.findBreedById(breed.id);

    if (!existingBreed) {
      throw new BreedNotFoundError();
    }

    const specie = await this.speciesRepository.findSpecieById(breed.specieId);

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    const updatedBreed = await this.breedsRepository.updateBreed(breed);

    return updatedBreed;
  }
}
