import { Pagination } from "@/modules/shared/types/pagination";
import { PetsRepository } from "../repository";
import { CreatePet, Pet, PetList, PetView } from "../types";

export class InMemoryPetsRepository implements PetsRepository {
  private pets: Pet[] = [];
  private idCounter = 1;

  async createPet(pet: CreatePet): Promise<Pet> {
    const newPet: Pet = {
      id: this.idCounter.toString(),
      ...pet,
      observations: pet.observations ?? null,
      sex: pet.sex ?? "UNKNOWN",
      mainImageId: null,
    };
    this.pets.push(newPet);
    this.idCounter++;

    return newPet;
  }

  async findPetById(id: string): Promise<PetView | null> {
    const petFound = this.pets.find((pet) => pet.id === id);

    if (!petFound) {
      return null;
    }

    return {
      ...petFound,
      images: [],
      breed: null,
      specie: null,
    };
  }

  async listPets({ page, pageSize }: Pagination): Promise<PetList> {
    page--;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedPets = this.pets.slice(start, end);
    const pets: PetView[] = paginatedPets.map((pet) => ({
      ...pet,
      images: [],
      breed: null,
      specie: null,
    }));

    return { pets, total: this.pets.length };
  }
}
