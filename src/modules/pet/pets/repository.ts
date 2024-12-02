import { CreatePet, Pet } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<Pet>;
  findPetById(id: string): Promise<Pet | null>;
}
