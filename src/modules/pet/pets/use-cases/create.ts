import { PetsRepository } from "../repository";
import { CreatePet, Pet } from "../types";

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(pet: CreatePet): Promise<Pet> {
    const createdPet = await this.petsRepository.createPet(pet);

    return createdPet;
  }
}
