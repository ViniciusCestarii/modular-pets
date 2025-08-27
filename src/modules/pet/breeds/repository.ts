import { CreateBreed, Breed, UpdateBreed } from "./types";

export interface BreedsRepository {
  createBreed(breed: CreateBreed): Promise<Breed>;
  updateBreed(breed: UpdateBreed): Promise<Breed>;
  findAllBreedsByspecieId(specieId: string): Promise<Breed[]>;
  findBreedById(id: string): Promise<Breed | null>;
  findBreedByNameAndSpecieId(
    name: string,
    specieId: string,
  ): Promise<Breed | null>;
  deleteBreed(id: Breed["id"]): Promise<void>;
}
