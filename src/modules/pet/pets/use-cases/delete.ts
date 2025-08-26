import { PetsRepository } from "../repository";
import { Pet } from "../types";
import { PetNotFoundError } from "../errors/pet-not-found";

export class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(id: Pet["id"]): Promise<void> {
    const pet = await this.petsRepository.findPetById(id);

    if (!pet) {
      throw new PetNotFoundError();
    }

    await this.petsRepository.deletePet(id);
  }
}
