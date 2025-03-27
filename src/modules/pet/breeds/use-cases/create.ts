import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../../species/repository";
import { BreedAlreadyExistsError } from "../errors/breed-already-exists";
import { BreedsRepository } from "../repository";
import { CreateBreed, Breed } from "../types";

export class CreateBreedUseCase {
  constructor(
    private breedsRepository: BreedsRepository,
    private speciesRepository: SpeciesRepository,
  ) {}

  async execute(breed: CreateBreed): Promise<Breed> {
    const specie = await this.speciesRepository.findSpecieById(breed.speciesId);

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    const existingBreed =
      await this.breedsRepository.findBreedByNameAndSpecieId(
        breed.name,
        breed.speciesId,
      );

    if (existingBreed) {
      throw new BreedAlreadyExistsError();
    }

    const createdBreed = await this.breedsRepository.createBreed(breed);

    return createdBreed;
  }
}
