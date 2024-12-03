import { BreedsRepository } from "../repository";
import { CreateBreed, Breed } from "../types";

export class CreateBreedUseCase {
  constructor(private breedsRepository: BreedsRepository) {}

  async execute(breed: CreateBreed): Promise<Breed> {
    // TODO: Validate if breed already exists and if species exists
    const createdBreed = await this.breedsRepository.createBreed(breed);

    return createdBreed;
  }
}
