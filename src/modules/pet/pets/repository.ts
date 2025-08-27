import { CreatePet, ListPets, Pet, PetList, PetView, UpdatePet } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<PetView>;
  findPetById(id: Pet["id"]): Promise<PetView | null>;
  listPets(filter: ListPets): Promise<PetList>;
  updatePet(pet: Partial<UpdatePet>): Promise<PetView>;
  deletePet(petId: Pet["id"]): Promise<void>;
}
