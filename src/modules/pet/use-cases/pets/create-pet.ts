import { PetsRepository } from "../../repositories/pets-repository";
import { CreatePet, Pet } from "../../types/pets-types";

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
  ) {}

  async execute(pet: CreatePet): Promise<Pet> {
    const createdPet = await this.petsRepository.createPet(pet);

    return createdPet;
  }
}