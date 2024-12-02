import { PetsRepository } from "../repository";
import { CreatePet, Pet } from "../types";

export class InMemoryPetsRepository implements PetsRepository {
  private pets: Pet[] = [];
  private idCounter = 1;

  async createPet(pet: CreatePet): Promise<Pet> {
    const newPet: Pet = {
      id: this.idCounter.toString(),
      ...pet,
    };
    this.pets.push(newPet);
    this.idCounter++;
    return newPet;
  }

  async findPetById(id: string): Promise<Pet | null> {
    return this.pets.find((pet) => pet.id === id) || null;
  }
}
