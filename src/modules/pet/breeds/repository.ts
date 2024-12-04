import { CreateBreed, Breed } from "./types";

export interface BreedsRepository {
  createBreed(breed: CreateBreed): Promise<Breed>;
  findBreedById(id: string): Promise<Breed | null>;
  findBreedByName(name: string): Promise<Breed | null>;
}
