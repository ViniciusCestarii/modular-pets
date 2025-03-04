import { Pagination } from "@/modules/shared/types/pagination";
import { CreatePet, Pet, PetList } from "./types";

export interface PetsRepository {
  createPet(pet: CreatePet): Promise<Pet>;
  findPetById(id: string): Promise<Pet | null>;
  listPets(filter: Pagination): Promise<PetList>;
}
