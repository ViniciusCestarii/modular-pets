import { Pagination } from "@/modules/shared/types/pagination";
import { CreatePet, PetList, PetView } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<PetView>;
  findPetById(id: string): Promise<PetView | null>;
  listPets(filter: Pagination): Promise<PetList>;
}
