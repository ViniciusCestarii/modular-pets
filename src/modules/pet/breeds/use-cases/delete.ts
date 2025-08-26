import { BreedNotFoundError } from "../../shared/errors/breed-not-found";
import { SpeciesRepository } from "../../species/repository";
import { BreedsRepository } from "../repository";
import { Breed } from "../types";

export class DeleteBreedUseCase {
  constructor(
    private breedsRepository: BreedsRepository,
    private speciesRepository: SpeciesRepository,
  ) {}

  async execute(breedId: Breed["id"]): Promise<void> {
    const existingBreed = await this.breedsRepository.findBreedById(breedId);

    if (!existingBreed) {
      throw new BreedNotFoundError();
    }

    await this.breedsRepository.deleteBreed(breedId);
  }
}
