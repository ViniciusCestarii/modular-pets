import { BreedsRepository } from "../repository";
import { CreateBreed, Breed, UpdateBreed } from "../types";

export class InMemoryBreedsRepository implements BreedsRepository {
  private breeds: Breed[] = [];
  private idCounter = 1;

  async createBreed(breed: CreateBreed): Promise<Breed> {
    const newBreed: Breed = {
      id: this.idCounter.toString(),
      ...breed,
    };
    this.breeds.push(newBreed);
    this.idCounter++;
    return newBreed;
  }

  async updateBreed(breed: UpdateBreed): Promise<Breed> {
    const index = this.breeds.findIndex((b) => b.id === breed.id);

    this.breeds[index] = {
      ...this.breeds[index],
      ...breed,
    };

    const updatedBreed = this.breeds[index];

    return updatedBreed;
  }

  async findAllBreedsBySpeciesId(speciesId: string): Promise<Breed[]> {
    return this.breeds
      .filter((breed) => breed.speciesId === speciesId)
      .toSorted((a, b) => a.name.localeCompare(b.name));
  }

  async findBreedById(id: string): Promise<Breed | null> {
    return this.breeds.find((breed) => breed.id === id) || null;
  }

  async findBreedByName(name: string): Promise<Breed | null> {
    return this.breeds.find((breed) => breed.name === name) || null;
  }
}
