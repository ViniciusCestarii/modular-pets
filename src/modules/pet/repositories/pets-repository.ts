import { CreatePet, Pet } from "../types/pets-types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<Pet>;
}