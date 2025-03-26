import { Pagination } from "@/modules/shared/types/pagination";
import { CreatePet, Pet, PetList, PetView } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<Pet>;
  findPetById(id: string): Promise<PetView | null>;
  listPets(filter: Pagination): Promise<PetList>;
}
