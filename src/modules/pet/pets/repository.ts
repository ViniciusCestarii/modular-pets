import { CreatePet, ListPets, Pet, PetList, PetView } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<PetView>;
  findPetById(id: Pet["id"]): Promise<PetView | null>;
  listPets(filter: ListPets): Promise<PetList>;
}
