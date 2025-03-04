import { PetsRepository } from "../repository";
import { Pet } from "../types";
import { PetNotFoundError } from "../errors/pet-not-found";

export class FindPetByIdUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(id: Pet["id"]): Promise<Pet> {
    const pet = await this.petsRepository.findPetById(id);

    if (!pet) {
      throw new PetNotFoundError();
    }

    return pet;
  }
}
