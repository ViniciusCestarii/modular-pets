import { CreateBreed, Breed, UpdateBreed } from "./types";

export interface BreedsRepository {
  createBreed(breed: CreateBreed): Promise<Breed>;
  updateBreed(breed: UpdateBreed): Promise<Breed>;
  findBreedById(id: string): Promise<Breed | null>;
  findBreedByName(name: string): Promise<Breed | null>;
}
