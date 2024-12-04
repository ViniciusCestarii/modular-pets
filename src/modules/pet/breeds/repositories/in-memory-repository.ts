import { BreedsRepository } from "../repository";
import { CreateBreed, Breed } from "../types";

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

  async findBreedById(id: string): Promise<Breed | null> {
    return this.breeds.find((breed) => breed.id === id) || null;
  }

  async findBreedByName(name: string): Promise<Breed | null> {
    return this.breeds.find((breed) => breed.name === name) || null;
  }
}
